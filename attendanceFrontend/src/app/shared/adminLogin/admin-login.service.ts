import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {

  globalbaseurl:any

  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any) {
    this.globalbaseurl=_baseurl
   }

   adminapi(email: string, password: string): Observable<any> {
    console.log(email)
    console.log(password)
    return this.http.post(`${this.globalbaseurl}/adminLogin`, { email, password });
  }
}
