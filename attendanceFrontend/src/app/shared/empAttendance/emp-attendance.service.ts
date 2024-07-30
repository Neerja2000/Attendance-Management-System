import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpAttendanceService {

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

   addEmpAttendanceapi(employeeData: any){
    return this.http.post(this.employeebaseurl+'/attendance/add',employeeData,{ headers: this.getHeaders() })
   }

     getTodayAttendance(): Observable<any> {
    return this.http.get(`${this.employeebaseurl}/attendance/today`,{ headers: this.getHeaders() });
  }
}
