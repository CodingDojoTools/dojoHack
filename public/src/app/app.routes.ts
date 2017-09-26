import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SubmissionComponent } from './submission/submission.component';
import { DetailsComponent } from './details/details.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { ProfileComponent } from './profile/profile.component'; 
import { WatchComponent } from './watch/watch.component';
import { AuthGuardService } from './auth-guard.service';


const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' },
    //**********************  ADMIN  ********************************
    { path: 'register/admin', component: }



    //**********************  TEAMS  ********************************

    { path: 'register', component: RegisterComponent},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
    { path: 'guide', component: GuidelinesComponent},
    { path: 'details/:id', component: DetailsComponent, canActivate: [AuthGuardService]},
    { path: 'hackathon/:purpose/:id', component: SubmissionComponent, canActivate: [AuthGuardService]},
    // { path: 'hackathon/update/:id', component: SubmissionComponent, canActivate: [AuthGuardService]},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
    {path: 'watch/:id', component: WatchComponent, canActivate: [AuthGuardService]},
    {path: '**', redirectTo: 'register'}
    
];

export const routing = RouterModule.forRoot(APP_ROUTES);
