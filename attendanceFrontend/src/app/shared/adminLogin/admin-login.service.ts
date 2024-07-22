import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {

  globalbaseurl:any

  constructor(private http:HttpClient,@Inject('embaseurl')_baseurl:any) {
    this.globalbaseurl=_baseurl
   }

   adminapi(userId: string, password: string): Observable<any> {
    return this.http.post(`${this.globalbaseurl}/adminLogin`, { userId, password });
  }
}
