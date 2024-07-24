import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  ngOnInit(): void {
    
  }

  constructor(private authservice:AuthService, private router:Router){

  }
  logout(){
    this.authservice.removedata()
   
    this.router.navigateByUrl('/login')
  }
}
