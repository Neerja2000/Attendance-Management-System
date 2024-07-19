import { Component, NgModule } from '@angular/core';
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
import { ViewRatingComponent } from './admin/view-rating/view-rating.component';
import { EmpLayoutComponent } from './employee/emp-layout/emp-layout.component';
import { EmpDashboardComponent } from './employee/emp-dashboard/emp-dashboard.component';
import { EmpAddAttendanceComponent } from './employee/emp-add-attendance/emp-add-attendance.component';
import { EmpViewAttendanceComponent } from './employee/emp-view-attendance/emp-view-attendance.component';
import { EmpAddRatingComponent } from './employee/emp-add-rating/emp-add-rating.component';

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
    },
    {
      path:'view-rating',component:ViewRatingComponent
    }
  ]
  },
  {
    path:"employee/layout",component:EmpLayoutComponent,
    children:[{
      path:'emp-dashboard',component:EmpDashboardComponent
    },
    {
      path:'emp-add-attendance',component:EmpAddAttendanceComponent
    },
    {
      path:'emp-view-attendance',component:EmpViewAttendanceComponent
    },
    {
      path:'emp-add-rating',component:EmpAddRatingComponent
    },
    {
      path:'emp-view-rating',component:EmpViewAttendanceComponent
    }
  ]
  }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
