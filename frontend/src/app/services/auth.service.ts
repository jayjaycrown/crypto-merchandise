import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';


import { UserModel } from '../helpers/user.model';

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

  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };
  // tslint:disable-next-line: variable-name
  private _refreshNeded$ = new Subject<UserModel>();
  get refreshNeded$() {
    return this._refreshNeded$;
  }
  constructor(private http: HttpClient) { }
}
