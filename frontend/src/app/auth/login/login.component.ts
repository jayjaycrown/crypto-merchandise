import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { AuthService } from '../../services/auth.service';
import { UserModel } from 'src/app/helpers/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userDetail: UserModel[] = [];

  model = {
    email: '',
    password: ''
  };
  successMessage: string;
  serverErrorMessages: string;
  constructor(private userService: AuthService, private router: Router, public loader: LoadingBarService) { }

  onSubmit(form: NgForm) {
    this.loader.start(10);
    this.userService.login(form.value).subscribe(
      res => {
        this.successMessage = res.message;
        this.userService.setUser(res.userId, res.status);
        this.userService.setToken(res.token);
        // this.userDetail = res.user;
        // console.log(this.userDetail);
        alert(this.successMessage);
        this.loader.stop();
        // .router.navigateByUrl('/event');
      },
      err => {
        this.serverErrorMessages = err.error;
        alert(this.serverErrorMessages);
        console.log(err);
        this.loader.stop();
      }
    );
  }

  ngOnInit(): void {
  }

}
