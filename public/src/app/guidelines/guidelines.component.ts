import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.css']
})
export class GuidelinesComponent implements OnInit {

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.httpService.getObs('/locations').subscribe(
      body => console.log("got locations, GUIDELINES", body),
      err => console.log("Got errors on locations, GUIDELINES")
    )
  }

}
