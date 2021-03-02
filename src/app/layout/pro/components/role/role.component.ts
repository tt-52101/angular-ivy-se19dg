import { ACLService } from '@delon/acl';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'layout-pro-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.less']
})
export class RoleComponent implements OnInit {

  constructor(
    public acl: ACLService
  ) { }

  ngOnInit(): void { 
    console.log(this.acl)
  }

}
