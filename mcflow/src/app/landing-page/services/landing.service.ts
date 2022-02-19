import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ContactUs } from '../models/contact-us.model';

@Injectable({
  providedIn: 'root'
})
export class LandingService {
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  sendContactUs(contactUs: ContactUs) {
    return this.http.post(
      `${environment.baseApiUrl}/user/contact`,
      contactUs,
      this.httpOptions
    );
  }
}
