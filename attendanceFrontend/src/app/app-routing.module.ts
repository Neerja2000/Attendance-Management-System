import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';

const routes: Routes = [
{
  path:"",redirectTo:"admin/layout/dashboard",pathMatch:'full'
},
  {
    path:"admin/layout",component:LayoutComponent,
    children:[{
      path: 'dashboard', component: DashboardComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
