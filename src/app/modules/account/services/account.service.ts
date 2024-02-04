import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {BehaviorSubject, map} from "rxjs";
import {User} from "../../shared/models/user";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  currentUserSource$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthenticationService) {
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

  loadCurrentUser() {
    return this.http.get<User>(this.baseUrl + "User/CurrentUser", { withCredentials: true })
      .pipe(
        map(user =>
          this.currentUserSource.next(user)
        )
      );
  }

  private removeAuthCredentials() {
    return this.http.post<string>(this.baseUrl + "User/Logout", null,
      { responseType: 'json', withCredentials: true });
  }

  tryAuthenticate() {
    this.authService.getAuthStatus().subscribe(authStatus => {
      if (!authStatus?.containsAccessToken && authStatus?.containsRefreshToken) {
        this.authService.refreshAccessToken().subscribe(
          () => {
            this.authService.getAuthStatus().subscribe(
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
