import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor() { }
  storedata(res: any) {
    // Check if response is for employee or admin login
    if (res.data && res.data._id) {
      // Handling employee login response
      sessionStorage.setItem('_id', res.data._id || '');
      sessionStorage.setItem('token', res.token || ''); // Store token if available
    } else if (res.token) {
     
      // Handling admin login response
      sessionStorage.setItem('_id',res.id ||''); // Admin login response doesn't include `_id`
      sessionStorage.setItem('token', res.token || '');
      
    } else {
      console.error('Invalid response format:', res);
    }
  }

  getId() {
    return sessionStorage.getItem('_id');
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  removedata() {
    sessionStorage.removeItem('_id');
    sessionStorage.removeItem('token');
  }

}
 