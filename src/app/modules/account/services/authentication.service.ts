import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthStatus} from "../../shared/models/auth-status";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getAuthStatus() {
    return this.http.get<AuthStatus>(this.baseUrl + "Authentication/AuthStatus", { withCredentials: true });
  }

  refreshAccessToken() {
    return this.http.put(this.baseUrl + "Authentication/RefreshAccessToken", null,
      { responseType: 'json', withCredentials: true });
  }
}
