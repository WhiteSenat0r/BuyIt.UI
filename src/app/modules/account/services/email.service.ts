import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  sendEmailConfirmationLetter(email: string) {
    return this.http.post(
      this.baseUrl + 'Email/SendEmailConfirmationLetter?email=' + email, null)
  };

  sendEmailSuccessfulVerificationLetter(email: string) {
    return this.http.post(
      this.baseUrl + 'Email/SendEmailSuccessfulVerificationLetter?email=' + email, null)
  };
}
