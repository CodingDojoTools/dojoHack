import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { RegisterMembersComponent } from './register-members/register-members.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { AddressComponent } from './dynamic/address/address.component';
import { HttpService } from './http.service';
import { CountdownService } from './countdown.service';
import { AuthGuardService } from './auth-guard.service';
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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    RegisterMembersComponent,
    DynamicComponent,
    AddressComponent,
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
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    BrowserAnimationsModule,
  ],
  providers: [
    HttpService,
    AuthGuardService,
    CountdownService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
