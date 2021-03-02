import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector} from '@angular/core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService, BaseApi, GET, Query, Path } from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import { zip, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { I18NService } from '../i18n/i18n.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService, JWTTokenModel, DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { MeService } from '@services/me.service';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService extends BaseApi {
  constructor(
    iconSrv: NzIconService,
    public injector: Injector,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private meService: MeService,
  ) {
    super(injector);
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }



  @GET('open/i18n/locale')
  getLocale(@Query('lang') lang: string, @Query('appid') appid: number): Observable<any> {
    return;
  }

  @GET('open/i18n/:locale')
  changeLocale(@Path('locale') locale: string,  @Query('appid') appid: number): Observable<any> {
    return;
  }

  load(): Promise<any> {
    return new Promise(resolve => {
      zip(this.getLocale(this.i18n.defaultLang, 10000), this.changeLocale(this.i18n.defaultLang, 10000))
        .pipe(
          // 接收其他拦截器后产生的异常消息
          catchError(() => {
            resolve(null);
            return throwError('error');
          }),
        )
        .subscribe(
          async ([changeLang, langDataRes]) => {
            // setting language data
            this.translate.setTranslation(this.i18n.defaultLang, langDataRes);
            this.translate.setDefaultLang(this.i18n.defaultLang);

            // application data
            this.settingService.setApp({
              name: '骆驼油气商城',
            });
            // 设置页面标题的后缀
            this.titleService.default = 'T';
            this.titleService.suffix = '骆驼油气商城';

          },
          () => {},
          async () => {
            try {
              if (this.tokenService.get<JWTTokenModel>(JWTTokenModel).token) {
                await this.meService.getUserMe();
              }
            } catch (error) {}
            resolve(null);
          },
        );
    });
  }
}
