import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpService } from './http.service';



@Injectable()
export class AuthGuardService implements CanActivate {
  // res: boolean = false;

  constructor(private httpService: HttpService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    let url: string = state.url;
    return this.checkLogin(url);
    
  }
  checkLogin(url: string): boolean {
    
    if(this.httpService.loggedSession.isLoggedIn){
      return true;
    }
    this.httpService.requestSession().subscribe(
      success => {
       
        this.router.navigate([url])
       
      },
      err => {
     
        this.router.navigate(['/register'])
      
      }
    )
    
   
  }

}
