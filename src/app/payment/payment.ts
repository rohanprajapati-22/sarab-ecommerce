import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { OrderResponse } from '../order-service';
import { PaymentService, PaymentResponse } from '../payment-service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.html',
  styleUrl: './payment.css',
  standalone: true,
})
export class Payment implements AfterViewInit, OnDestroy {
  order = input.required<OrderResponse>();
  paid = output<PaymentResponse>();
  cancel = output<void>();

  @ViewChild('cardElement', { static: false }) cardElementRef!: ElementRef<HTMLDivElement>;

  private paymentService = inject(PaymentService);
  private snackbar = inject(SnackbarService);

  readonly isPaying = signal<boolean>(false);
  readonly error = signal<string>('');
  readonly cardReady = signal<boolean>(false);
  readonly blocked = signal<'expired' | 'cancelled' | null>(null);

  private stripe: Stripe | null = null;
  private card: StripeCardElement | null = null;

  private stripePromise = loadStripe(
    'pk_test_51UFrF3RzwLVBcCozAFQAtJEU65C4MtlQuFkRhy45cCqSekIGLXM0ZgykpOtO4hn7qWf6NfCSVvHO4TCAKSbFahe000jwR4hQAg',
  );

  get payAmount(): string {
    return (this.order()?.totalAmount ?? 0).toFixed(2);
  }

  async ngAfterViewInit() {
    const state = `${this.order()?.orderStatus ?? ''} ${this.order()?.paymentStatus ?? ''}`.toLowerCase();
    if (state.includes('expired')) {
      this.blocked.set('expired');
      return;
    }
    if (state.includes('cancelled')) {
      this.blocked.set('cancelled');
      return;
    }

    this.stripe = await this.stripePromise;

    if (!this.stripe || !this.cardElementRef) {
      this.error.set('Failed to load Stripe. Please refresh and try again.');
      this.snackbar.error('Failed to load Stripe. Please refresh and try again.');
      return;
    }

    const elements = this.stripe.elements();
    this.card = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          '::placeholder': { color: '#aab7c4' },
        },
        invalid: { color: '#fa755a' },
      },
    });

    this.card.mount(this.cardElementRef.nativeElement);

    this.card.on('ready', () => {
      this.cardReady.set(true);
    });

    this.card.on('change', (event) => {
      if (event.error) {
        this.error.set(event.error.message);
      } else {
        this.error.set('');
      }
    });
  }

  ngOnDestroy() {
    this.card?.destroy();
  }

  async payNow() {
    if (this.isPaying() || !this.stripe || !this.card) {
      return;
    }

    const order = this.order();
    if (!order) {
      return;
    }

    this.error.set('');
    this.isPaying.set(true);

    this.paymentService.createStripePayment(Number(order.orderId)).subscribe({
      next: async (res) => {
        try {
          const result = await this.stripe!.confirmCardPayment(res.clientSecret, {
            payment_method: {
              card: this.card!,
            },
          });

          this.isPaying.set(false);

          if (result.error) {
            console.error('Stripe confirmation error:', result.error);
            const message = result.error.message || 'Payment failed. Please try again.';
            this.error.set(message);
            this.snackbar.error(message);
          } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
            this.paymentService
              .confirmPayment({
                orderId: Number(order.orderId),
                paymentIntentId: res.paymentIntentId,
              })
              .subscribe({
                next: () => {
                  this.isPaying.set(false);
                  this.paid.emit({
                    message: 'Payment successful',
                    paymentId: res.paymentIntentId as unknown as number,
                    transactionId: res.paymentIntentId,
                    paymentStatus: 'Succeeded',
                  });
                },
                error: (confirmErr) => {
                  this.isPaying.set(false);
                  console.error('API confirm error:', confirmErr);
                  this.error.set(
                    'Payment succeeded but order update failed. Please contact support.',
                  );
                  this.snackbar.error('Payment succeeded but order update failed. Please contact support.');
                },
              });
          } else {
            console.error('Unexpected payment intent status:', result.paymentIntent?.status);
            this.error.set('Payment could not be completed. Please try again.');
            this.snackbar.error('Payment could not be completed. Please try again.');
          }
        } catch (stripeErr) {
          this.isPaying.set(false);
          console.error('Stripe confirmCardPayment threw:', stripeErr);
          this.error.set('An error occurred during payment processing. Please try again.');
          this.snackbar.error('An error occurred during payment processing. Please try again.');
        }
      },
      error: (err) => {
        this.isPaying.set(false);
        const message = err?.error?.message || 'Payment failed. Please try again.';
        if (/expired/i.test(message)) {
          this.blocked.set('expired');
          return;
        }
        if (/cancelled/i.test(message)) {
          this.blocked.set('cancelled');
          return;
        }
        this.error.set(message);
        this.snackbar.error(message);
      },
    });
  }
}
