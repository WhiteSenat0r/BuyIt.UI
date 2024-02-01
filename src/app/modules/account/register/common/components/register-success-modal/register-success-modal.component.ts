import {Component} from '@angular/core';
import {registerModalBackgroundAnimation, registerModalWindowAnimation} from "./register-success-modal.animations";
import {Router} from "@angular/router";
import {RegisterService} from "../register.service";

@Component({
  selector: 'app-register-success-modal',
  templateUrl: './register-success-modal.component.html',
  animations: [registerModalBackgroundAnimation, registerModalWindowAnimation]
})
export class RegisterSuccessModalComponent {

  constructor(private router: Router, public registerService: RegisterService) {
  }

  toggleModal() {
    this.registerService.registrationSource.next(null);
  }
}
