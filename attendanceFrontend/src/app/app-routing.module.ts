import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AddEmployeeComponent } from './admin/add-employee/add-employee.component';
import { ViewEmployeesComponent } from './admin/view-employees/view-employees.component';
import { UpdateEmployeeComponent } from './admin/update-employee/update-employee.component';
import { ViewAttendanceComponent } from './admin/view-attendance/view-attendance.component';

const routes: Routes = [
{
  path:"",redirectTo:"admin/layout/dashboard",pathMatch:'full'
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
      path:'update-employee',component:UpdateEmployeeComponent
    },
    {
      path:'view-attendance',component:ViewAttendanceComponent
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
