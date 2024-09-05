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
import { EmpViewRatingComponent } from './employee/emp-view-rating/emp-view-rating.component';
import { AuthGuard } from './auth_guard/auth_guard';
import { AdminpasswordComponent } from './admin/adminpassword/adminpassword.component';
import { EmployeePasswordComponent } from './employee/employee-password/employee-password.component';
import { AddDailyRatingComponent } from './employee/add-daily-rating/add-daily-rating.component';
import { ViewDailyRatingComponent } from './admin/view-daily-rating/view-daily-rating.component';
import { DailyRatingViewComponent } from './employee/daily-rating-view/daily-rating-view.component';
import { AddProjectComponent } from './admin/add-project/add-project.component';
import { AddProjectTaskComponent } from './admin/add-project-task/add-project-task.component';
import { ViewProjectComponent } from './admin/view-project/view-project.component';

const routes: Routes = [
{
  path:"",redirectTo:"/login",pathMatch:'full'
},
{
  path:"login",component:LoginComponent
},
{
  path:'changePassword',component:AdminpasswordComponent
},
  {
    path:"admin/layout",component:LayoutComponent,
    children:[{
      path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard]
      
    },
    {
      path:'add-employee',component:AddEmployeeComponent,canActivate: [AuthGuard]
    },
    {
      path:'view-employee',component:ViewEmployeesComponent,canActivate: [AuthGuard]
    },
    {
      path:'update-employee/:id',component:UpdateEmployeeComponent,canActivate: [AuthGuard]
    },
    {
      path:'view-attendance',component:ViewAttendanceComponent,canActivate: [AuthGuard]
    },
    {
      path:'view-attendance-details/:id',component:ViewAttendanceDetailsComponent,canActivate: [AuthGuard]
    },
    {
      path:'add-rating/:id',component:AddRatingComponent,canActivate: [AuthGuard]
    },
    {
      path:'view-rating',component:ViewRatingComponent,canActivate: [AuthGuard]
    },
    {
      path:'view-daily-rating',component:ViewDailyRatingComponent
    },
    {
      path:'add-project',component:AddProjectComponent
    },
    {
      path:'add-project-task',component:AddProjectTaskComponent
    },{
      path:'view-project',component:ViewProjectComponent
    }
  ]
  },
  {
      path:'employee/password',component:EmployeePasswordComponent
  },
  {
    path:"employee/layout",component:EmpLayoutComponent,
    children:[{
      path:'emp-dashboard',component:EmpDashboardComponent,canActivate:[AuthGuard]
    },
    {
      path:'emp-add-attendance',component:EmpAddAttendanceComponent,canActivate: [AuthGuard]
    },
    {
      path:'emp-view-attendance',component:EmpViewAttendanceComponent,canActivate: [AuthGuard]
    },
    {
      path:'emp-add-rating',component:EmpAddRatingComponent,canActivate: [AuthGuard]
    },
    {
      path:'emp-view-rating/:employeeId',component:EmpViewRatingComponent,canActivate: [AuthGuard]
    },
    {
      path:'add-daily-rating',component:AddDailyRatingComponent,canActivate:[AuthGuard]
    },
    {
      path:'daily-rating-view',component:DailyRatingViewComponent,canActivate:[AuthGuard]
    }
  ]
  }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
