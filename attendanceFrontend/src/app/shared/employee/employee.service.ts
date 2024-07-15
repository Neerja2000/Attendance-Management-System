import { HttpClient } from '@angular/common/http';
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


addEmployeeapi(form:any)
{
  return this.http.post(this.globalbaseurl+'/employee/add',form)
}

viewEmployeeapi(): Observable<any> {
  
  return this.http.get(this.globalbaseurl + "/employee/getAll");
}
getSingleEmployee(params: { id: string }): Observable<any> {
  return this.http.get(`${this.globalbaseurl}/employee/getSingle?id=${params.id}`);
}

updateEmployeeapi( data: any): Observable<any> {
  return this.http.put<any>(`${this.globalbaseurl}/employee/update`, data);
}
deleteEmployeeapi(id: string): Observable<any> {
  return this.http.delete(`${this.globalbaseurl}/employee/delete?id=${id}`);
}

}
