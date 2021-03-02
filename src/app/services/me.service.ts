import { ArrayService } from '@delon/util';
import { isArray } from 'util';
import { Injectable, Injector } from '@angular/core';
import { _HttpClient, MenuService, SettingsService, GET, BaseUrl, BaseApi } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { Observable, forkJoin } from 'rxjs';


@Injectable()
export class MeService extends BaseApi {
  constructor(
    public injector: Injector,
    private aclService: ACLService,
    private settingService: SettingsService,
    private menuService: MenuService,
    private arrayService: ArrayService,
    private http: _HttpClient,
  ) {
    super(injector);
  }

  // formateMenu(item) {
  //   const _item = {
  //     text: item.name,
  //     group: item.children && item.children.length ? true : false,
  //     children: item.children && item.children.length ? item.children.map(zItem => this.formateMenu(zItem)) : undefined,
  //     link: item.children && item.children.length ? undefined : item.state,
  //     icon: 'anticon' + item.icon,
  //     reuse: true,
  //   };
  //   return _item;
  // }

  

  @GET('v1/store/me')
  getStoreByMe(): Observable<any> {
    return;
  }

  @GET('v1/member/me')
  getMemberByMe(): Observable<any> {
    return;
  }

  @GET('v1/me')
  getMe(): Observable<any> {
    return;
  }

  getUserMe() {
    return new Promise((resolve, reject) => {

      let getMe = this.getMe();
      let getMemberByMe = this.getMemberByMe();

      forkJoin([getMe, getMemberByMe])
      .subscribe(results => {
        const me =  results[0];
        const memberMe = results[1];

          this.settingService.setUser({
            name: memberMe.nickname || me.username || me.email || me.cellphone,
            avatar: memberMe.avatar
          });

          this.aclService.setAbility(me.permissions);

          this.aclService.attachRole(me.roles);

          // const _menu = isArray(payload.navigations) && payload.navigations.map(item => {
          //   return this.formateMenu(item);
          // });

          
          const navigations = me.navigations;
          this.arrayService.visitTree(navigations, (item)=> {
            item.text = item.title;
            item.link = item.state;
            item.icon = 'anticon' + item.icon;
            item.reuse = true;
          });
          this.menuService.add([
            {
              text: '首页',
              group: true,
              hideInBreadcrumb: true,
              children: navigations,
            },
          ]);
          resolve(true);
        // this.post1 = results[0];
        // this.post2 = results[1];
      });


      // this.getMe().subscribe(
      //   payload => {

      //   },
      //   err => {
      //     reject();
      //   },
      // );
    });
  }
}
