import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UserModel } from '../../helpers/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userService: AuthService, private router: Router, public loader: LoadingBarService) { }

  successMessage: string;
  serverErrorMessages: string;
  userDetail: UserModel[] = [];
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  model: UserModel = {
    id: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  };

  onSubmit(form: NgForm) {
    this.loader.start(10);
    // console.log(form.value);
    this.userService.register(form.value).subscribe(
      res => {
        this.successMessage = res;
        console.log(res);
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 3000);
        this.loader.stop();
      },
      err => {
        if (err.error.msg) {
          this.serverErrorMessages = err.error.msg[0].message;
          this.loader.stop();
        }
        if (err.error.message) {
          this.serverErrorMessages = err.error.message;
          this.loader.stop();
        }
        console.log(err);
        alert(err);
        this.loader.stop();
      }
    );
  }
  ngOnInit(): void {
  }

}
