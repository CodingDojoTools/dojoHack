import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpService } from './http.service';



@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private httpService: HttpService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    console.log("AuthGuard canActivate called");
    let url: string = state.url;
    console.log("the url", url)
    return this.checkLogin(url);
    
  }
  checkLogin(url: string): boolean {
    if(this.httpService.isLoggedIn){
      return true;
    }
    this.httpService.redirectUrl = url;
    this.httpService.requestSession().subscribe(
      success => true,
      err => false
    )
    // use the httpService to find out what our session is
    // if we have a session, we'll navigate to the redirecturl

    
    // this.httpService.loginTeam(login)
    // .subscribe(success => console.log("team in", success), 
    // err=>console.log("failed"))
  }

}
