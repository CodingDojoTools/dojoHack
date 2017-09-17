import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SubmissionComponent} from './submission/submission.component';
import { AuthGuardService } from './auth-guard.service';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
    { path: 'entry', component: SubmissionComponent, canActivate: [AuthGuardService]}
    
];

export const routing = RouterModule.forRoot(APP_ROUTES);

// import { Routes, RouterModule } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { RegistrationComponent } from './registration/registration.component';
// const APP_ROUTES: Routes = [
//     { path: '', redirectTo: 'login', pathMatch: 'full' },
//     { path: 'login', component: LoginComponent },
//     { path: 'registration', component: RegistrationComponent },
//     { path: 'task', component: TaskComponent, children:[
// 		{ path: 'public', component: TaskPublicComponent },
// 		{ path: 'private', component: TaskPrivateComponent }
//     ]}
// ];
// export const routing = RouterModule.forRoot(APP_ROUTES);