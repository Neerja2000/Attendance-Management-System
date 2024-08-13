import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 globalbaseurl:any  
 employeebaseurl:any


 constructor(
  private http: HttpClient,
  @Inject('baseurl') private _baseurl: any,
  @Inject('embaseurl') private _embaseurl: any
) {
  this.globalbaseurl = _baseurl;
  this.employeebaseurl = _embaseurl;
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
  return this.http.request('DELETE', `${this.globalbaseurl}/employee/delete`, {
    headers: this.getHeaders(),
    body: { id: id }  // Send the id in the request body
  });
}



passwordChange(body: any): Observable<any> {
  const token = sessionStorage.getItem('token') || '';
 

  const headers = new HttpHeaders().set('Authorization', token);
console.log("Sending token:", token);
return this.http.post(`${this.employeebaseurl}/employee/password`, body, { headers });
}



}
