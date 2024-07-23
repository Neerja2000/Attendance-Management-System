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
      sessionStorage.setItem('token', ''); // Employee login response doesn't include a token
    } else if (res.token) {
      // Handling admin login response
      sessionStorage.setItem('_id', ''); // Admin login response doesn't include `_id`
      sessionStorage.setItem('token', res.token || '');
    } else {
      console.error('Invalid response format:', res);
    }
  }

  

  getId(){
    return sessionStorage.getItem('_id')
  }
  getToken(){

    return sessionStorage.getItem('token')
  }
  removedata() {
    sessionStorage.removeItem('_id')
    sessionStorage.removeItem('token')
  }

}
 