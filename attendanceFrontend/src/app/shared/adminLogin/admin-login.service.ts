import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  
    return this.http.post(`${this.globalbaseurl}/adminLogin`, { email, password });
  }
  passwordChange(body: any): Observable<any> {
    const token = sessionStorage.getItem('token') || '';
   

    const headers = new HttpHeaders().set('Authorization', token);
console.log("Sending token:", token);
return this.http.post(`${this.globalbaseurl}/admin/password`, body, { headers });
  }
}
