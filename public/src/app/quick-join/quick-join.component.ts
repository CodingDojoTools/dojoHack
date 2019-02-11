import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-quick-join',
  templateUrl: './quick-join.component.html',
  styleUrls: ['./quick-join.component.css']
})
export class QuickJoinComponent implements OnInit {
  @Input() hackathonId: number;
  @Output() markAsJoined = new EventEmitter();
  
  constructor(private httpService: HttpService) { }
  ngOnInit() {
  }
  joinHackathon(){
   
    this.httpService.getObs(`/hackathons/${this.hackathonId}/join`).subscribe(
      body => {
        
        this.markAsJoined.emit(this.hackathonId);
      },
      err => console.log(err)
    )
  }

}
