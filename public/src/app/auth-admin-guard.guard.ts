import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './http.service';

@Injectable()
export class AuthAdminGuardGuard implements CanActivate {
  
  constructor(private httpService: HttpService, private router: Router){}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let url: string = state.url;
    return this.checkLogin(url);

  }

  checkLogin(url: string): boolean {
  
    if(this.httpService.loggedSession.admin){
      return true;
    }
    this.httpService.requestSession().subscribe(
      success => {
       
        if(success.admin == true){
          this.router.navigate([url]);
          return true;
        }
        this.router.navigate(['/dashboard'])
        return false;
        
      },
      err => {
        
        this.router.navigate(['/register'])
        return false;
        
      }
    )
  }




}
