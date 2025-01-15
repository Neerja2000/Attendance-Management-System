import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalenderService {



  globalbaseurl:any

  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any) {
    this.globalbaseurl=_baseurl
   }

   addCalenderApi(form: any) {
    return this.http.post(`${this.globalbaseurl}/calender/add`, form);
  }
  getCalenderApi(date: string) {
    return this.http.get(`${this.globalbaseurl}/viewCalendarByDate`, {
      params: { date },
    });
  }

  
  getAllCalender() {
    return this.http.get(`${this.globalbaseurl}/viewAllCalender`);
  }
}
