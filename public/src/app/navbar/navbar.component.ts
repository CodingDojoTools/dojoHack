import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { CountdownService } from '../countdown.service';
import { Subscription } from 'rxjs/Subscription';
import { Hackathon, Session } from '../models';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  sessionSub: Subscription;
  session: Session;

  constructor(private httpService: HttpService, private _router: Router, private count: CountdownService) { 
    this.sessionSub = this.httpService.session.subscribe(
      session => {
        console.log("Receiving from behavior subject", session)
        this.session = session;
      },
      err => console.log("Error with subscribing to behavior subject",err)
    )
  }

  ngOnInit() {}

  logout(){
    this._router.navigate(['/register'])
    this.count.logoutMsg = "You've been logged out";
    this.httpService.updateSession(new Session());
    this.httpService.getObs('/logout').subscribe(
      body => {
        console.log("logout body", body)
       
      },
      err => console.log("Error with trying to logout", err)
    )
    this._router.navigate(['/register'])
  }

}
