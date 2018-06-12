import { CadG2 } from './cad-g2';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Constants } from '../util/constants';

@Injectable()
export class CadG2Service {

  private url = Constants.urlEndpoint + "cad-g2/";

  constructor(private http: Http) { }

  public getById(id: number): Observable<CadG2> {
    return this.http.get(this.url + id).map(res => res.json());
  }

}
