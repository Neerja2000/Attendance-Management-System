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

 
  empRatingapi(){
    return this.http.get(this.globalbaseurl + "/emprating/getAll");
  }

  updateAdminRating(_id: string, adminRating: number): Observable<any> {
    const payload = { _id, adminRating };
    console.log("hhh",payload)
    return this.http.put(`${this.globalbaseurl}/adminrating/add`, payload);
  }
  
}