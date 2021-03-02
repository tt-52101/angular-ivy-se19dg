import { Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { TitleService, VERSION as VERSION_ALAIN } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { VERSION as VERSION_ZORRO } from 'ng-zorro-antd/version';
import { filter } from 'rxjs/operators';
import { StartupService } from '@core';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent implements OnInit {
  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleSrv: TitleService,
    private modalSrv: NzModalService,
    private startupSrv: StartupService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    renderer.setAttribute(el.nativeElement, 'ng-alain-version', VERSION_ALAIN.full);
    renderer.setAttribute(el.nativeElement, 'ng-zorro-version', VERSION_ZORRO.full);
  }

  ngOnInit() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('jwt')) {
      this.tokenService.clear();
      const _jwt = params.get('jwt')
      const exitstJwt =  JSON.parse(atob(_jwt));
      this.tokenService.set(exitstJwt);
      this.startupSrv.load().then(() => {
        let url = this.tokenService.referrer!.url || '/dashboard';
        if (url.includes('/passport')) url = '/';
        this.router.navigateByUrl(url);
      });

    }
    
    // console.log(location.href)
    // this.activatedRoute.queryParams.subscribe(res=> {
    //   console.log(res)
    // });



    this.router.events.pipe(filter((evt) => evt instanceof NavigationEnd)).subscribe(() => {
      this.titleSrv.setTitle();
      this.modalSrv.closeAll();
    });
  }
}
