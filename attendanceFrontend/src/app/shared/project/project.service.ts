import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  globalbaseurl:any
  token:any
  employeebaseurl:any
  constructor(private http:HttpClient,@Inject("baseurl")_baseurl:any,private authService:AuthService, @Inject('embaseurl')_embaseurl: any) 
  
  { 
    this.globalbaseurl=_baseurl
    this.employeebaseurl = _embaseurl;
    this.token=this.authService.getToken()
  }

  private getEmpHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
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

    return this.http.post(this.globalbaseurl+"/project/add",formData,{ headers: this.getHeaders() });
  }
  getAllProjectApi() {
    return this.http.get(this.globalbaseurl + "/project/getAll", { headers: this.getHeaders() });
  }
getSingleProjectApi(projectId: string){
return this.http.get(`${this.globalbaseurl}/project/single/${projectId}`, {headers:this.getHeaders()});

}


  deleteProjectApi(projectId: string) {
    return this.http.delete(`${this.globalbaseurl}/project/delete/${projectId}`, {
      headers: this.getHeaders()
    });
  }

  updateProjectApi(projectId: string, formData: FormData) {
    return this.http.put(`${this.globalbaseurl}/project/update/${projectId}`, formData, {
      headers: this.getHeaders()
    });
  }
  
  getProjectBudgets(projectId: string) {
    return this.http.get(`${this.globalbaseurl}/task/projectsbudget/${projectId}`, {
      headers: this.getHeaders()
    });
  }

  getProjectsByEmployee(employeeId: string) {
    return this.http.get(`${this.employeebaseurl}/getProjectsByEmployee/${employeeId}`, {
      headers: this.getEmpHeaders()
    });
  }

   
  

  assignTask(taskAssignment: any): Observable<any> {
    // Include employeeId in the URL
    const url = `${this.globalbaseurl}/assign-task/${taskAssignment.employeeId}`;
  
    // Log the token for debugging purposes
    console.log("tok", this.getHeaders());
  
    return this.http.post(url, taskAssignment, { headers: this.getHeaders() });
  }

  
  addTaskApi(formData: FormData) {
    return this.http.post(`${this.globalbaseurl}/task/add`, formData, { headers: this.getHeaders() });
  }
  changeTaskStatus(taskId: string, status: boolean) {
    console.log(taskId)
    console.log("status",status)
    const body = { status }; // Pass the status in the request body
    return this.http.post(
      `${this.globalbaseurl}/task/status/${taskId}`,
      body, // Include the status in the body
      { headers: this.getHeaders() } // Attach the headers
    );
  }
  
 
  getAllTaskProjectId(projectId: string) {
    return this.http.get(`${this.globalbaseurl}/task/getAll`, {
        headers: this.getHeaders(),
        params: { projectId } // Pass the projectId as a query parameter
    });



   
}


calculatedProjectBudget(employeeId: string, projectId: string, taskId: string) {
  const payload = { projectId, taskId };
  return this.http.post(`${this.globalbaseurl}/calculate-budget/${employeeId}`, payload, {
    headers: this.getHeaders()
  });
}






deleteTask(taskId: string): Observable<any> {
  return this.http.delete(`${this.globalbaseurl}/task/delete/${taskId}`, { headers: this.getHeaders() });
}


getAssignTaskApi(EmployeeId: string) {
  return this.http.get(`${this.globalbaseurl}/assign-task/getAllWeekTasksForEmployee/${EmployeeId}`, {
      headers: this.getHeaders()
    
  });



 
}

updateTaskStatus(taskId: string, newStatus: string): Observable <any> {
  return this.http.patch(`${this.employeebaseurl}/task-status/${taskId}`, { status: newStatus },{headers: this.getHeaders()});
}


approveTaskApi(taskId: string): Observable<any> {
  // Assuming the approve-task endpoint is defined in the backend
  return this.http.patch(`${this.globalbaseurl}/approve-task-status/${taskId}`, {}, {
    headers: this.getHeaders()
  });
}




completeTaskApi(taskId: string, rating: number, review:string): Observable<any> {
  return this.http.post <any>(`${this.globalbaseurl}/complete-task`, { taskId, rating,review });
}

requestChangesApi(taskId: string, feedback: string[]): Observable<any> {
  return this.http.post <any>(`${this.globalbaseurl}/request-changes`, { taskId, feedback });
}






uploadContent(formData: FormData): Observable<any> {
  return this.http.post(`${this.globalbaseurl}/importantContent/add`, formData);
}

// Get all uploaded content
getAllContent(): Observable<any> {
  return this.http.get(`${this.globalbaseurl}/importantContent/get`);
}


getPendingTasksCount(employeeId: string,month:string): Observable<any> {
  return this.http.get<any>(`${this.employeebaseurl}/dashboard/pending-tasks/${employeeId}?month=${month}`,{headers: this.getHeaders()});
}


// announcement
addAnnouncement(formData: FormData): Observable<any> {
  return this.http.post(`${this.globalbaseurl}/announcement/add`,formData, { headers: this.getHeaders() });
}
viewAnnouncement(): Observable<any> {
  return this.http.get(`${this.employeebaseurl}/announcements/get`, { headers: this.getHeaders() });
}
likeapi(announcementId: string, userId: string): Observable<any> {
  // Choose either employeebaseurl or globalbaseurl as your primary base URL
  const commonUrl = this.employeebaseurl || this.globalbaseurl; // Set a default base URL if one is undefined
  
  return this.http.post(
    `${commonUrl}/announcements/likes/${announcementId}`, 
    { userId }, 
    { headers: this.getHeaders() }
  );
}
addComment(announcementId: string, commentData: { user: string, text: string }): Observable<any> {
  const commonUrl = this.employeebaseurl || this.globalbaseurl;

  return this.http.post(`${commonUrl}/announcements/comments/${announcementId}`, commentData,{ headers: this.getHeaders() });
}



updateTask(taskId: string, updateData: any): Observable<any> {
  return this.http.patch(`${this.globalbaseurl}/tasks/urgent${taskId}`, updateData);
}
}
