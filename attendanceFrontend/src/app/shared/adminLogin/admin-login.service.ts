import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  globalbaseurl:any

  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any) {
    this.globalbaseurl=_baseurl
   }

   adminapi(email: string, password: string): Observable<any> {
  
    return this.http.post(`${this.globalbaseurl}/adminLogin`, { email, password });
  }
  passwordChange(form: FormData) {
    return this.http.post(`${this.globalbaseurl}/admin/password`, form,{ headers: this.getHeaders() });
  }
}
