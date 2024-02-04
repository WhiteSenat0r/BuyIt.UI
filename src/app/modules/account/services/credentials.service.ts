import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../../shared/models/user";

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  verifyEmail(verificationToken: string, email: string) {
    return this.http.put<User>(
      this.baseUrl + "Credentials/VerifyEmail?verificationtoken=" + verificationToken + "&email=" + email, null);
  }
}
