import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Hackathon } from '../../models';

@Component({
  selector: 'app-posted',
  templateUrl: './posted.component.html',
  styleUrls: ['./posted.component.css']
})
export class PostedComponent implements OnInit {
  postedHackathons: Hackathon[] = []

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.httpService.fetchPosted((res) => {
      if(res.status){
       
        this.postedHackathons = res.hacks;
       
      }
      else {
        console.log("We don't appear to have any luck.")
      }
    })
  }

}
