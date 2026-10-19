import { Injectable } from '@angular/core';

export interface InvoicePdfItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface InvoicePdfData {
  invoiceNumber: string;
  orderId: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  orderDate: string;
  orderStatus: string;
  paymentStatus: string;
  items: InvoicePdfItem[];
  totalAmount: number;
}

@Injectable({ providedIn: 'root' })
export class InvoicePdfService {
  async download(order: InvoicePdfData): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 16;
    const right = pageWidth - margin;
    const orderDate = new Date(order.orderDate);
    const formattedDate = Number.isNaN(orderDate.getTime())
      ? order.orderDate
      : orderDate.toLocaleString();
    const money = (amount: number): string => `€${(amount ?? 0).toFixed(2)}`;

    pdf.setProperties({
      title: `Invoice ${order.invoiceNumber}`,
      subject: `Order ${order.orderId}`,
      author: 'Sarab Restaurant',
    });

    const drawTableHeader = (y: number): number => {
      pdf.setFillColor(246, 243, 237);
      pdf.roundedRect(margin, y, pageWidth - margin * 2, 10, 2, 2, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(83, 77, 67);
      pdf.text('ITEM', margin + 4, y + 6.5);
      pdf.text('QTY', 118, y + 6.5, { align: 'center' });
      pdf.text('UNIT PRICE', 151, y + 6.5, { align: 'right' });
      pdf.text('AMOUNT', right - 4, y + 6.5, { align: 'right' });
      return y + 10;
    };

    pdf.setFillColor(39, 105, 70);
    pdf.roundedRect(margin, 14, pageWidth - margin * 2, 28, 4, 4, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(19);
    pdf.text('SARAB', margin + 7, 26);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('FAST FOOD & RESTAURANT', margin + 7, 34);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.text('INVOICE', right - 7, 25, { align: 'right' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(order.invoiceNumber, right - 7, 33, { align: 'right' });

    pdf.setTextColor(45, 42, 36);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('BILLED TO', margin, 54);
    pdf.text('ORDER DETAILS', 119, 54);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(75, 70, 62);
    pdf.text(order.customerName || '', margin, 61);
    let customerY = 66;
    for (const value of [order.email, order.phone, order.address]) {
      if (!value) continue;
      const lines = pdf.splitTextToSize(value, 88);
      pdf.text(lines, margin, customerY);
      customerY += lines.length * 4.5;
    }
    pdf.setTextColor(75, 70, 62);
    pdf.text(`Order number: #${order.orderId}`, 119, 61);
    pdf.text(`Date: ${formattedDate}`, 119, 67);
    pdf.text(`Order status: ${order.orderStatus}`, 119, 73);
    pdf.text(`Payment status: ${order.paymentStatus}`, 119, 79);

    let y = Math.max(customerY, 83) + 7;
    if (y > pageHeight - 55) {
      pdf.addPage();
      y = 18;
    }
    y = drawTableHeader(y);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(55, 52, 46);

    for (const item of order.items ?? []) {
      const itemLines = pdf.splitTextToSize(item.productName || 'Item', 88);
      const rowHeight = Math.max(10, itemLines.length * 4.5 + 5);
      if (y + rowHeight > pageHeight - 32) {
        pdf.addPage();
        y = drawTableHeader(18);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(55, 52, 46);
      }

      pdf.text(itemLines, margin + 4, y + 6);
      pdf.text(String(item.quantity), 118, y + 6, { align: 'center' });
      pdf.text(money(item.price), 151, y + 6, { align: 'right' });
      pdf.text(money(item.subtotal), right - 4, y + 6, { align: 'right' });
      pdf.setDrawColor(235, 231, 224);
      pdf.line(margin, y + rowHeight, right, y + rowHeight);
      y += rowHeight;
    }

    if (y + 34 > pageHeight - 14) {
      pdf.addPage();
      y = 20;
    }
    y += 8;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(99, 93, 83);
    pdf.text('Payment status', 119, y);
    pdf.text(order.paymentStatus, right, y, { align: 'right' });
    pdf.setDrawColor(225, 220, 211);
    pdf.line(119, y + 4, right, y + 4);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(39, 105, 70);
    pdf.text('TOTAL', 119, y + 13);
    pdf.text(money(order.totalAmount), right, y + 13, { align: 'right' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(135, 129, 119);
    pdf.text('Thank you for choosing Sarab!', pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.save(`Invoice-${String(order.orderId).padStart(5, '0')}.pdf`);
  }
}

