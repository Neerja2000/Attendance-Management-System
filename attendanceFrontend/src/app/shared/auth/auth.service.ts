import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor() { }
 


  storedata(res: any) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Get local hours
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Get local minutes
    const loginTime = `${hours}:${minutes}`; // Format time as HH:mm
  
    if (res.data && res.data._id) {
      sessionStorage.setItem('_id', res.data._id || '');
      sessionStorage.setItem('token', res.token || '');
      sessionStorage.setItem('loginTime', loginTime); // Save login time for employee
    } else if (res.token) {
      sessionStorage.setItem('_id', res.id || '');
      sessionStorage.setItem('token', res.token || '');
      sessionStorage.setItem('loginTime', loginTime); // Save login time for admin
    } else {
      console.error('Invalid response format:', res);
    }
  
    console.log('Login Time Stored:', loginTime); // Log the stored login time
  }
  
  
  
  getLoginTime() {
    const loginTime = sessionStorage.getItem('loginTime');
    console.log('Retrieved Login Time:', loginTime); // Log the retrieved login time
    return loginTime;
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
 