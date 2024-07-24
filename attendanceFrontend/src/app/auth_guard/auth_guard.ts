import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
  })

  export class AuthGuard implements CanActivate{

    constructor(private authservice:AuthService,private router:Router,private snackBar:MatSnackBar){}
    canActivate():boolean{
        if(this.authservice.getToken()==null)
        {
            this.snackBar.open('Login failed.  Unauthorized User.', 'Close', {
                duration: 3000, // Duration in milliseconds
                panelClass: ['error-snackbar'],
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });
          this.router.navigateByUrl("/login")
          return false
        }
        else
        return true
     }

    
  }