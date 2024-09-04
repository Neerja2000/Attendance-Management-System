import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { HeaderComponent } from './admin/layout/header/header.component';
import { SidebarComponent } from './admin/layout/sidebar/sidebar.component';
import { FooterComponent } from './admin/layout/footer/footer.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ViewEmployeesComponent } from './admin/view-employees/view-employees.component';
import { AddEmployeeComponent } from './admin/add-employee/add-employee.component';
import { UpdateEmployeeComponent } from './admin/update-employee/update-employee.component';
import { ViewAttendanceComponent } from './admin/view-attendance/view-attendance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ViewAttendanceDetailsComponent } from './admin/view-attendance-details/view-attendance-details.component';
import { LoginComponent } from './login/login.component';
import { AddRatingComponent } from './admin/add-rating/add-rating.component';
import { ViewRatingComponent } from './admin/view-rating/view-rating.component';
import { EmpLayoutComponent } from './employee/emp-layout/emp-layout.component';
import { EmpHeaderComponent } from './employee/emp-layout/emp-header/emp-header.component';
import { EmpFooterComponent } from './employee/emp-layout/emp-footer/emp-footer.component';
import { EmpSidebarComponent } from './employee/emp-layout/emp-sidebar/emp-sidebar.component';
import { EmpDashboardComponent } from './employee/emp-dashboard/emp-dashboard.component';
import { EmpAddAttendanceComponent } from './employee/emp-add-attendance/emp-add-attendance.component';
import { EmpViewAttendanceComponent } from './employee/emp-view-attendance/emp-view-attendance.component';
import { EmpAddRatingComponent } from './employee/emp-add-rating/emp-add-rating.component';
import { EmpViewRatingComponent } from './employee/emp-view-rating/emp-view-rating.component'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminpasswordComponent } from './admin/adminpassword/adminpassword.component';
import { EmployeePasswordComponent } from './employee/employee-password/employee-password.component';
import { AddDailyRatingComponent } from './employee/add-daily-rating/add-daily-rating.component';
import { ViewDailyRatingComponent } from './admin/view-daily-rating/view-daily-rating.component';
import { DailyRatingViewComponent } from './employee/daily-rating-view/daily-rating-view.component';



@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    ViewEmployeesComponent,
    AddEmployeeComponent,
    UpdateEmployeeComponent,
    ViewAttendanceComponent,
    ViewAttendanceDetailsComponent,
    LoginComponent,
    AddRatingComponent,
    ViewRatingComponent,
    EmpLayoutComponent,
    EmpHeaderComponent,
    EmpFooterComponent,
    EmpSidebarComponent,
    EmpDashboardComponent,
    EmpAddAttendanceComponent,
    EmpViewAttendanceComponent,
    EmpAddRatingComponent,
    EmpViewRatingComponent,
    AdminpasswordComponent,
    EmployeePasswordComponent,
    AddDailyRatingComponent,
    ViewDailyRatingComponent,
    DailyRatingViewComponent
   
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
