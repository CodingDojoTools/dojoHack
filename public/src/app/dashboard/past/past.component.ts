import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpService } from '../../http.service';
import { Hackathon, Session } from '../../models';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.css']
})
export class PastComponent implements OnInit, OnDestroy {
  @Input() pastHackathons: Hackathon[]
  sessionSub: Subscription;
  session: Session;
  

  constructor(private httpService: HttpService) { 
    
  }

  ngOnInit() {
  }
  ngOnDestroy(){
    // this.sessionSub.unsubscribe();
  }


}
