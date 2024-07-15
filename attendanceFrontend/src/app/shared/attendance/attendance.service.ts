import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  globalbaseurl:any
  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any)
   {
    this.globalbaseurl=_baseurl
    }
    getAttendance(){
      return this.http.get(this.globalbaseurl+'/attendance/getAll')
    }
}
