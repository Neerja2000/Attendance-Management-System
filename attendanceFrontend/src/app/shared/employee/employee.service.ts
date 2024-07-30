import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 globalbaseurl:any

  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any) {
    this.globalbaseurl=_baseurl
   }

   private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
addEmployeeapi(form:any)
{
  return this.http.post(this.globalbaseurl+'/employee/add',form,{ headers: this.getHeaders() })
}

viewEmployeeapi(): Observable<any> {
  
  return this.http.get(this.globalbaseurl + "/employee/getAll",{ headers: this.getHeaders() });
}
getSingleEmployee(params: { id: string }): Observable<any> {
  return this.http.get(`${this.globalbaseurl}/employee/getSingle?id=${params.id}`,{ headers: this.getHeaders() });
}

updateEmployeeapi( data: any): Observable<any> {
  return this.http.put<any>(`${this.globalbaseurl}/employee/update`, data,{ headers: this.getHeaders() });
}
deleteEmployeeapi(id: string): Observable<any> {
  return this.http.delete(`${this.globalbaseurl}/employee/delete?id=${id}`,{ headers: this.getHeaders() });
}



}
