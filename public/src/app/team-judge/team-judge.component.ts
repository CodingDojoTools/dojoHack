import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-team-judge',
  templateUrl: './team-judge.component.html',
  styleUrls: ['./team-judge.component.css']
})
export class TeamJudgeComponent implements OnInit {
  @Input('group')
  

  public teamForm: FormGroup;


  constructor() { }

  ngOnInit() {
  }

}
