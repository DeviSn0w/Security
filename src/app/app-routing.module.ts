import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Authentication/login/login.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './Authentication/register/register.component';
import { MainDashboardComponent } from './Dashboard/main-dashboard/main-dashboard.component';
import { ErrorComponent } from './Errors/error/error.component';
import { NotFoundComponent } from './Errors/not-found/not-found.component';
import { ComplaintListComponent } from './Complaints/complaint-list/complaint-list.component';
import { UsersListComponent } from './Dashboard/users-list/users-list.component';
import { authGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Register', component: RegisterComponent },

  { path: 'MainDashboard', component: MainDashboardComponent, canActivate: [authGuard] },


  { path: 'Users', component: UsersListComponent, canActivate: [authGuard,AdminGuard] },

  { path: 'Complaints', component: ComplaintListComponent, canActivate: [authGuard] },



  { path: 'error', component: ErrorComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
