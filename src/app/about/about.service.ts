import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface AboutFeature {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface AboutContent {
  yearsOfExcellence: number;
  eyebrow: string;
  title: string;
  titleHighlight: string;
  story: string;
  mainImage: string;
  secondaryImage: string;
  features: AboutFeature[];
  buttonText: string;
  buttonUrl: string;
}

@Injectable({ providedIn: 'root' })
export class AboutService {
  private readonly http = inject(HttpClient);

  getAboutContent(): Observable<AboutContent> {
    return this.http.get<AboutContent>('/api/About');
  }
}
