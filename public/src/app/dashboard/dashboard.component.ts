import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private httpService: HttpService, private _router: Router) { }

  ngOnInit() {
    // if(this.httpService.loggedInId){
    //   console.log("logged in")
    // }
    // else {
    //   this._router.navigate(['/']);
    // }
  }

}
