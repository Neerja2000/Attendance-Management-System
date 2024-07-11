import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AddEmployeeComponent } from './admin/add-employee/add-employee.component';

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
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
