import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry, tap, shareReplay } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
// import * as moment from 'moment';



import { environment } from '../../environments/environment';
import { UserModel } from '../helpers/user.model';

const apiUrl = environment.loginApi;
const membersUrl = environment.adminMembersApi;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/fhir+json',
    AUTHORIZATION: ' bearer [jwt]'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string;
  user: string;

  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };
  // tslint:disable-next-line: variable-name
  private _refreshNeded$ = new Subject<UserModel>();
  get refreshNeded$() {
    return this._refreshNeded$;
  }
  constructor(private http: HttpClient) { }
  register(user: any) {
    return this.http.post<UserModel>(apiUrl + '/signup', user, this.noAuthHeader)
      .pipe(
        catchError(this.handleError('Register', user))
      );
  }

  login(authCredentials: any) {
    return this.http.post(apiUrl + '/login', authCredentials, httpOptions)
      .pipe(tap(res => this.setSession(res)), shareReplay(),
        catchError(this.handleError('Login', authCredentials))
      );
  }
  private setSession(authResult) {
    // const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    // localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  getAllMembers() {
    return this.http.get(membersUrl, httpOptions).pipe(
      retry(3), catchError(this.handleError('getAllMembers'))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.error.message}`);
      // alert(error);
      return of(result as T);
    };
  }
  setUser(user: string) {
    localStorage.setItem('user', user);
  }
  // setToken(token: string) {
  //   localStorage.setItem('token', token);

  // }

  private log(message: string) {

    console.log(message);
    alert(message);
  }
}
