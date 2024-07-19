import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpRatingService {

  employeebaseurl:any

  constructor(private http:HttpClient,@Inject('embaseurl')_baseurl:any) {
    this.employeebaseurl=_baseurl
   }


  addEmpAttendanceapi(RatingData: any){
    return this.http.post(this.employeebaseurl+'/rating/add',RatingData)
   }

   getSingleRating(employeeId: string): Observable<any> {
    return this.http.get(`${this.employeebaseurl}/rating/getSingle/${employeeId}`);
  }
}
