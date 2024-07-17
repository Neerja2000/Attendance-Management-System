import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  globalbaseurl: any;
  private apiUrl = 'http://localhost:3000/admin/emprating/getAll';
  constructor(private http: HttpClient, @Inject('baseurl') _baseurl: any) {
    this.globalbaseurl = _baseurl;
  }

 
  empRatingapi(week?: string, month?: string): Observable<any> {
    let params = new HttpParams();
    if (week) {
      params = params.set('week', week);
    }
    if (month) {
      params = params.set('month', month);
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  updateAdminRating(_id: string, adminRating: number): Observable<any> {
    const payload = { _id, adminRating };
   
    return this.http.put(`${this.globalbaseurl}/adminrating/add`, payload);
  }
  
}