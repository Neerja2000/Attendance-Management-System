import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpRatingService {

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
  employeebaseurl:any

  constructor(private http:HttpClient,@Inject('embaseurl')_baseurl:any) {
    this.employeebaseurl=_baseurl
   }


   addEmpRatingapi(RatingData: any){
    return this.http.post(this.employeebaseurl+'/rating/add',RatingData,{ headers: this.getHeaders() })
   }

   addEmpDailyRatingapi(RatingData: any){
    return this.http.post(this.employeebaseurl+'/dailyRating/add',RatingData,{ headers: this.getHeaders() })
   }


   getSingleRating(employeeId: string): Observable<any> {
    return this.http.get(`${this.employeebaseurl}/rating/getSingle/${employeeId}`,{ headers: this.getHeaders() });
  }
  getSingleEmployeeRating(employeeId: string): Observable<any> {
    return this.http.get(`${this.employeebaseurl}/dailyRating/getSingle/${employeeId}`,{ headers: this.getHeaders() });
  }
}
