import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private httpService: HttpService, private _router: Router) { }

  ngOnInit() {
  }
  logout(){
    this.httpService.logout();
    this._router.navigate(['/register'])
  }

}
