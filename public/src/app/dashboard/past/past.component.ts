import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Hackathon } from '../../models';

@Component({
  selector: 'app-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.css']
})
export class PastComponent implements OnInit {
  pastHackathons: Hackathon[] = []

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.httpService.fetchPast((res) => {
      if(res.status){
        console.log("we got past hackahtons to post!")
        this.pastHackathons = res.hacks;
        console.log(this.pastHackathons)
      }
      else {
        console.log("We don't appear to have any luck.")
      }
    })
  }


}
