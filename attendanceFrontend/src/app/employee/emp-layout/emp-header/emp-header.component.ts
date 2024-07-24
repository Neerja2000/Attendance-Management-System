import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-emp-header',
  templateUrl: './emp-header.component.html',
  styleUrls: ['./emp-header.component.css']
})
export class EmpHeaderComponent implements OnInit {



  
  constructor(private authservice:AuthService, private router:Router){

  }
  ngOnInit(): void {
    
  }
  logout(){
    this.authservice.removedata()
   
    this.router.navigateByUrl('/login')
  }
}
