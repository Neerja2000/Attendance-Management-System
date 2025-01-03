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

   getTodayAttendanceByEmployeeId(employeeId: string) {
    return this.http.get(`${this.employeebaseurl}/attendance/today/${employeeId}`, { headers: this.getHeaders() });
  }
  
  getAttendanceByDateAndEmployeeId(employeeId: string, date: string): Observable<any> {
    return this.http.get<any>(`${this.employeebaseurl}/attendance/${employeeId}/date?date=${date}`,{ headers: this.getHeaders() });
  }
 
}
