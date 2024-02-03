import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  emailConfirmationSource: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  emailConfirmationSource$ = this.emailConfirmationSource.asObservable();

  passwordChangeSource: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  passwordChangeSource$ = this.emailConfirmationSource.asObservable();

  constructor() { }
}
