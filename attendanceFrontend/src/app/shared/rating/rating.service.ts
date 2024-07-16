import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  globalbaseurl: any;

  constructor(private http: HttpClient, @Inject('baseurl') _baseurl: any) {
    this.globalbaseurl = _baseurl;
  }

  addRatingapi(form: any): Observable<any> {
    return this.http.post(`${this.globalbaseurl}/rating/add`, form);
  }
  empRatingapi(){
    return this.http.get(this.globalbaseurl + "/emprating/getAll");
  }
}