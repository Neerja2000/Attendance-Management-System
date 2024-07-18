import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

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

   
}
