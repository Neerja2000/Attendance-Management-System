import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  globalbaseurl:any
  token:any
  constructor(private http:HttpClient,@Inject("baseurl")_baseurl:any,private authService:AuthService) 
  { 
    this.globalbaseurl=_baseurl
    this.token=this.authService.getToken()
  }
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
  addProjectApi(formData:FormData)
  {

    return this.http.post(this.globalbaseurl+"/project/add",formData,{ headers: this.getHeaders() })
  }


  getAllProjectApi() {
    return this.http.get(this.globalbaseurl + "/project/getAll", { headers: this.getHeaders() });
  }

  addTaskApi(formData: FormData) {
    return this.http.post(`${this.globalbaseurl}/task/add`, formData, { headers: this.getHeaders() });
  }
 
  getAllTaskProjectId(projectId: string) {
    return this.http.get(`${this.globalbaseurl}/task/getAll`, {
        headers: this.getHeaders(),
        params: { projectId } // Pass the projectId as a query parameter
    });
}
}
