import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

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
}
