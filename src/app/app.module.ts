import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Authentication/login/login.component';
import { RegisterComponent } from './Authentication/register/register.component';
import { ForgotPasswordComponent } from './Authentication/forgot-password/forgot-password.component';
import { MainDashboardComponent } from './Dashboard/main-dashboard/main-dashboard.component';
import { UserProfileComponent } from './Dashboard/user-profile/user-profile.component';
import { NavbarComponent } from './Shared/navbar/navbar.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { LandingComponent } from './landing/landing.component';
import { SideBarComponent } from './Shared/side-bar/side-bar.component';
import { ErrorComponent } from './Errors/error/error.component';
import { NotFoundComponent } from './Errors/not-found/not-found.component';
import { ComplaintListComponent } from './Complaints/complaint-list/complaint-list.component';
import { ComplaintDetailsComponent } from './Complaints/complaint-details/complaint-details.component';
import { UsersListComponent } from './Dashboard/users-list/users-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    MainDashboardComponent,
    UserProfileComponent,
    NavbarComponent,
    FooterComponent,
    LandingComponent,
    SideBarComponent,
    ErrorComponent,
    NotFoundComponent,
    ComplaintListComponent,
    ComplaintDetailsComponent,
    UsersListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule ,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
