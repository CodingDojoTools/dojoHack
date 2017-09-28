import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { RegisterMembersComponent } from './register-members/register-members.component';
import { HttpService } from './http.service';
import { CountdownService } from './countdown.service';
import { AuthGuardService } from './auth-guard.service';
import { AuthTeamGuard } from './auth-team.guard';
import { AuthAdminGuardGuard } from './auth-admin-guard.guard';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { JoinedComponent } from './dashboard/joined/joined.component';
import { PostedComponent } from './dashboard/posted/posted.component';
import { PastComponent } from './dashboard/past/past.component';
import { SubmissionComponent } from './submission/submission.component';
import { DetailsComponent } from './details/details.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { ProfileComponent } from './profile/profile.component';
import { QuickJoinComponent } from './quick-join/quick-join.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { WatchComponent } from './watch/watch.component'
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';
import { SafePipe } from './watch/watch.component';
import { AdminSignInComponent } from './admin-sign-in/admin-sign-in.component';
import { AdminDashComponent } from './admin-dash/admin-dash.component';
import { CreateHackComponent } from './create-hack/create-hack.component';
import { AdminDetailsComponent } from './admin-details/admin-details.component';
import { JudgeComponent } from './judge/judge.component';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    RegisterMembersComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    JoinedComponent,
    PostedComponent,
    PastComponent,
    SubmissionComponent,
    DetailsComponent,
    GuidelinesComponent,
    ProfileComponent,
    QuickJoinComponent,
    WatchComponent,
    SafePipe,
    AdminSignInComponent,
    AdminDashComponent,
    CreateHackComponent,
    AdminDetailsComponent,
    JudgeComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    BrowserAnimationsModule,
    NgxCarouselModule
  ],
  providers: [
    HttpService,
    AuthGuardService,
    CountdownService,
    AuthAdminGuardGuard,
    AuthTeamGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
