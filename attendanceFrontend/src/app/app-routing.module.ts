import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AddEmployeeComponent } from './admin/add-employee/add-employee.component';
import { ViewEmployeesComponent } from './admin/view-employees/view-employees.component';
import { UpdateEmployeeComponent } from './admin/update-employee/update-employee.component';
import { ViewAttendanceComponent } from './admin/view-attendance/view-attendance.component';
import { ViewAttendanceDetailsComponent } from './admin/view-attendance-details/view-attendance-details.component';
import { LoginComponent } from './login/login.component';
import { AddRatingComponent } from './admin/add-rating/add-rating.component';

const routes: Routes = [
{
  path:"",redirectTo:"/login",pathMatch:'full'
},
{
  path:"login",component:LoginComponent
},
  {
    path:"admin/layout",component:LayoutComponent,
    children:[{
      path: 'dashboard', component: DashboardComponent
      
    },
    {
      path:'add-employee',component:AddEmployeeComponent
    },
    {
      path:'view-employee',component:ViewEmployeesComponent
    },
    {
      path:'update-employee/:id',component:UpdateEmployeeComponent
    },
    {
      path:'view-attendance',component:ViewAttendanceComponent
    },
    {
      path:'view-attendance-details/:id',component:ViewAttendanceDetailsComponent
    },
    {
      path:'add-rating/:id',component:AddRatingComponent
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
