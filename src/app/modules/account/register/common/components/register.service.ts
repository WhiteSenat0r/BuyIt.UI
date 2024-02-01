import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  registrationSource: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  registrationSource$ = this.registrationSource.asObservable();

  emailSource: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor() { }
}
