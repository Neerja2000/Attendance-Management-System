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
  embaseurl:any
  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any,@Inject('embaseurl')_embaseurl: any)
   {
    this.globalbaseurl=_baseurl,
    this.embaseurl=_embaseurl
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

  
    
    getAttendanceByDate(date: string): Observable<any> {
      const options = {
        headers: this.getHeaders(),
        params: { date }
      };
      return this.http.get(`${this.globalbaseurl}/attendance/day`, options);
    }


    getHolidays(employeeId:string,month: string): Observable<any> {
      return this.http.get<any>(`${this.embaseurl}/dashboard/getholidays/${employeeId}?month=${month}`, { headers: this.getHeaders() });
    }
    

    getLateArrivalsCount(employeeId: string, month: string): Observable<any> {
      return this.http.get<any>(`${this.embaseurl}/attendence/late-arrivals/${employeeId}?month=${month}`);
    }
  
    addWorkStatus(workData: any, employeeId: string): Observable<any> {
      return this.http.post(`${this.embaseurl}/workstatus/add/${employeeId}`, workData, { headers: this.getHeaders() });
    }
    
    // Function to fetch work status for a specific employee
    getWorkStatusByEmployee(employeeId: string): Observable<any> {
      return this.http.get(`${this.embaseurl}/workstatus/getSingle/${employeeId}`);
    }
  }
   

