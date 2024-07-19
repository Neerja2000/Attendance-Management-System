import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpAttendanceService {

  employeebaseurl:any

  constructor(private http:HttpClient,@Inject('embaseurl')_baseurl:any) {
    this.employeebaseurl=_baseurl
   }

   addEmpAttendanceapi(employeeData: any){
    return this.http.post(this.employeebaseurl+'/attendance/add',employeeData)
   }

     getTodayAttendance(): Observable<any> {
    return this.http.get(`${this.employeebaseurl}/attendance/today`);
  }
}
