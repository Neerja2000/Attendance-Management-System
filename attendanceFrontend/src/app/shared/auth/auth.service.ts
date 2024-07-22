import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  storedata(data: any) {
    if (data && data.token) {
      sessionStorage.setItem('token', data.token);
      
    } else {
      console.error('Invalid data received:', data);
    }
  }
  
  getId(){
    return sessionStorage.getItem('_id')
  }

  removedata(){
    sessionStorage.removeItem('_id')
   
  }
}
