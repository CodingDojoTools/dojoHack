import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SubmissionComponent } from './submission/submission.component';
import { DetailsComponent } from './details/details.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { ProfileComponent } from './profile/profile.component'; 
import { WatchComponent } from './watch/watch.component';
import { AuthGuardService } from './auth-guard.service';
import { AuthAdminGuardGuard } from './auth-admin-guard.guard';
import { AuthTeamGuard } from './auth-team.guard';
import { AdminSignInComponent } from './admin-sign-in/admin-sign-in.component';
import { AdminDashComponent } from './admin-dash/admin-dash.component';
import { CreateHackComponent } from './create-hack/create-hack.component';
import { AdminDetailsComponent } from './admin-details/admin-details.component';
import { JudgeComponent } from './judge/judge.component';
import { ProjectScoresComponent } from './project-scores/project-scores.component';



const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' },
    //**********************  ADMIN  ********************************
    { path: 'register/admin', component: AdminSignInComponent},
    { path: 'dashboard/admin', component: AdminDashComponent, canActivate: [AuthAdminGuardGuard]},
    { path: 'create/admin', component: CreateHackComponent, canActivate: [AuthAdminGuardGuard]},
    { path: 'details/:id/admin', component: AdminDetailsComponent, canActivate: [AuthAdminGuardGuard]},
    { path: 'judge/:id/admin', component: JudgeComponent, canActivate: [AuthAdminGuardGuard]},
    {path: 'score/:id/admin', component: ProjectScoresComponent, canActivate: [AuthAdminGuardGuard]},
    

    //**********************  TEAMS  ********************************

    { path: 'register', component: RegisterComponent},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthTeamGuard]},
    { path: 'guide', component: GuidelinesComponent},
    { path: 'details/:id', component: DetailsComponent, canActivate: [AuthTeamGuard]},
    { path: 'hackathon/:purpose/:id', component: SubmissionComponent, canActivate: [AuthTeamGuard]},
    { path: 'hackathon/update/:id', component: SubmissionComponent, canActivate: [AuthTeamGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthTeamGuard]},
    
    
    
    // ********************* BOTH TEAMS AND ADMIN *****************
    
    
    {path: 'watch/:id', component: WatchComponent, canActivate: [AuthGuardService]},
    {path: '**', redirectTo: 'register'}
    
];

export const routing = RouterModule.forRoot(APP_ROUTES);
