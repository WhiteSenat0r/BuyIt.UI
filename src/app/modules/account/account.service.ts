import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map, Observable} from "rxjs";
import {User} from "../shared/models/user";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthStatus} from "../shared/models/auth-status";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  currentUserSource$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {
  }

  login(loginData: any) {
    return this.http.post<User>(this.baseUrl + "User/Login", loginData, { withCredentials: true })
      .pipe(
        map(user => {
          this.currentUserSource.next(user);
        })
    );
  }

  logout() {
    this.currentUserSource.next(null);
    return this.removeAuthCredentials().subscribe();
  }

  register(registrationData: any) {
    return this.http.post<User>(this.baseUrl + "User/Register", registrationData);
  }

  verifyEmail(verificationToken: string, email: string) {
    return this.http.put<User>(
      this.baseUrl + "User/VerifyEmail?verificationtoken=" + verificationToken + "&email=" + email, null);
  }

  loadCurrentUser() {
    return this.http.get<User>(this.baseUrl + "User/CurrentUser", { withCredentials: true })
      .pipe(
        map(user =>
          this.currentUserSource.next(user)
        )
      );
  }

  getAuthStatus() {
    return this.http.get<AuthStatus>(this.baseUrl + "User/AuthStatus", { withCredentials: true });
  }

  refreshAccessToken(): Observable<string> {
    return this.http.put<string>(this.baseUrl + "User/RefreshAccessToken", null,
      { responseType: 'json', withCredentials: true });
  }

  private removeAuthCredentials() {
    return this.http.post<string>(this.baseUrl + "User/Logout", null,
      { responseType: 'json', withCredentials: true });
  }

  tryAuthenticate() {
    this.getAuthStatus().subscribe(authStatus => {
      if (!authStatus?.containsAccessToken && authStatus?.containsRefreshToken) {
        this.refreshAccessToken().subscribe(
          () => {
            this.getAuthStatus().subscribe(
              updatedAuthStatus => {
                if (updatedAuthStatus.containsAccessToken && updatedAuthStatus.containsRefreshToken
                  && this.currentUserSource.value == null) {
                  this.loadCurrentUser().subscribe();
                }
              });
          });
      }
      else if (authStatus.containsAccessToken && authStatus.containsRefreshToken
        && this.currentUserSource.value == null) {
        this.loadCurrentUser().subscribe();
      }
      else if (authStatus.containsAccessToken && authStatus.containsRefreshToken
        && this.currentUserSource.value !== null) {
        return;
      }
    });
  }
}
