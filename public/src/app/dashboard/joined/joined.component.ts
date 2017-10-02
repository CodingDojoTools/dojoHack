import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import { Hackathon, Session } from '../../models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-joined',
  templateUrl: './joined.component.html',
  styleUrls: ['./joined.component.css']
})
export class JoinedComponent implements OnInit, OnDestroy {
  @Input() joinedHackathons: Hackathon[];
  sessionSub: Subscription;
  session: Session;
  

  constructor(private httpService: HttpService, private _router: Router) { }

  ngOnInit() {
  }

  submitEntry(hackId){
   
    this._router.navigate(['entry', hackId])
  }

  ngOnDestroy(){
    // this.sessionSub.unsubscribe();
  }



  


  }

