import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataProvider {

  private _headers: Headers;

  constructor(public http: Http) {

    this._headers = new Headers();

  }

  loadData(url: string): Observable<any> {

    this._headers.append('Accept', 'application/json');

    return this.http.get(url, {
      headers: this._headers
    }).map(res => res.json());

  }

}
