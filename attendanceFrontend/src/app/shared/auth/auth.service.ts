import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  storedata(res:any){
    sessionStorage.setItem("_id",res.data._id)
    sessionStorage.setItem('token',res.token)
  }
  getId(){
    return sessionStorage.getItem('_id')
  }

  removedata(){
    sessionStorage.removeItem('_id')
   
  }
}
