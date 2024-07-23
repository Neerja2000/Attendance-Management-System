import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  storedata(res: any) {
    // Check if res has the expected properties
    if (res && res.token) {
      // Assuming `_id` is available directly on `res` and not in `res.data`
      sessionStorage.setItem('_id', res._id || ''); // Handle case where `_id` might be undefined
      sessionStorage.setItem('token', res.token || ''); // Handle case where `token` might be undefined
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
 