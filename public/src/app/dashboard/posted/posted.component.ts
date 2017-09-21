import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../http.service';
import { Hackathon, Session } from '../../models';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-posted',
  templateUrl: './posted.component.html',
  styleUrls: ['./posted.component.css']
})
export class PostedComponent implements OnInit, OnDestroy {

  @Input() postedHackathons: Hackathon[];
  @Output() markAsJoined = new EventEmitter();
  sessionSub: Subscription;
  session: Session;

  constructor(private httpService: HttpService) { 
    
  }

  ngOnInit() {}

  joinHackathon(hack){
    
    this.httpService.getObs(`/hackathons/${hack.id}/join`).subscribe(
      body => {
        console.log("We joined!", body);
        this.markAsJoined.emit(hack)
      },
      err => console.log("We have an error trying to join a hackathon!", err)
    )
      
  }
  ngOnDestroy(){
    // this.sessionSub.unsubscribe();
  }
}
