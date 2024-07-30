import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
  globalbaseurl:any
  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any)
   {
    this.globalbaseurl=_baseurl
    }
    // getAttendance(){
    //   return this.http.get(this.globalbaseurl+'/attendance/getAll')
    // }
    getEmployeeAttendance(employeeId: string): Observable<any> {
      return this.http.get<any>(`${this.globalbaseurl}/attendance/getEmployee?id=${employeeId}`,{ headers: this.getHeaders() });
    }
    getTodayAttendance(): Observable<any> {
      return this.http.get(this.globalbaseurl+'/attendance/today',{ headers: this.getHeaders() });
    }

   
}
