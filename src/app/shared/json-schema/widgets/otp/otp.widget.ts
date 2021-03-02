import { Component, OnInit, OnChanges, ChangeDetectorRef, Injector, AfterViewInit } from '@angular/core';
import { I18NService } from '@core';
import { ControlWidget, SFValue, SFItemComponent, SFComponent } from '@delon/form';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'sf-otp',
  template: `
    <sf-item-wrap
      [id]="id"
      [schema]="schema"
      [ui]="ui"
      [showError]="showError"
      [error]="error"
      [showTitle]="schema.title"
    >
      <div class="d-flex">
        <input
          nz-input
          [attr.id]="id"
          [ngModel]="value"
          [nzSize]="ui.size"
          [disabled]="disabled"
          [attr.disabled]="disabled"
          (ngModelChange)="change($event)"
          [attr.maxLength]="schema.maxLength || null"
          [attr.type]="ui.type || 'text'"
          [attr.placeholder]="ui.placeholder"
          [attr.autoFocus]="ui.autofocus"
        />
        <button
          class="ml-sm"
          nz-button
          [nzType]="ui.size"
          [disabled]="flag"
          [attr.type]="'button'"
          (click)="sendOtpHandler($event)"
        >
          {{ flag ? timer : ('app.action.get_otp' | translate) }}
        </button>
      </div>
    </sf-item-wrap>
  `,
  preserveWhitespaces: false,
})
export class OtpWidget extends ControlWidget implements OnInit, AfterViewInit {
  static readonly KEY = 'otp';

  public config: {
    reqUrl: string;
    reqMethod: string;
    tragetKey: string;
    methodKey: string;
    hadAreaCode: boolean;
  };

  public flag: Boolean;

  public timer: String = 'Get otp';

  keyupEvt(event) {
    if (event.keyCode === 13) {
      return;
    }
  }

  ngOnInit(): void {
    this.config = this.ui.config || {};
    this.timer = this.i18n.fanyi('app.action.get_otp');
  }

  ngAfterViewInit(): void {
    this.sfComp.formChange.subscribe(form => {
      const math = this.sfComp.getProperty('/' + this.sfComp.getValue('/' + this.config.tragetKey)).schema.pattern;
      if (math) {
        this.flag = form[this.config.tragetKey] ? !new RegExp(math).test(this.sfComp.getValue('/' + this.sfComp.getValue('/' + this.config.tragetKey))) : true;
      }
    });
  }

  change(value: SFValue) {
    if (this.ui.change) {
      this.ui.change(value);
    }
    this.setValue(value);
  }

  reset(value: SFValue): void {
    if (value === null || value === undefined) {
      return;
    }
  }

  _change() {
    this.setValue(this.value);
  }

  sendOtpHandler(event) {
    const payload = {};
    payload[this.config.tragetKey] = this.sfComp.getValue('/' + this.config.tragetKey).toLocaleUpperCase();
    payload[this.sfComp.getValue('/' + this.config.tragetKey)] = this.sfComp.getValue('/' + this.sfComp.getValue('/' + this.config.tragetKey));

    if (this.config.hadAreaCode) {
      payload['areaCode'] = this.sfComp.getValue('/areaCode');
    }

    this.http
      .request(this.config.reqMethod, this.config.reqUrl, {
        body: payload,
      })
      .subscribe(
        (response: any) => {
          this.countDown(response.countdown);
        },
        err => {},
      );
  }

  /**
   * 倒计时
   * @param times 时间
   */
  countDown(times: number) {
    this.flag = true;
    let count = times;
    const t = setInterval(() => {
      if (count > 0) {
        count -= 1;
        this.timer = '' + count + 's';
      } else {
        clearInterval(t);
        this.timer = this.i18n.fanyi('app.action.get_otp');
        this.flag = false;
      }
      this.cd.detectChanges();
    }, 1000);
  }

  constructor(
    public cd: ChangeDetectorRef,
    public injector: Injector,
    public sfItemComp: SFItemComponent,
    public sfComp: SFComponent,
    public http: _HttpClient,
    public i18n: I18NService
  ) {
    super(cd, injector, sfItemComp, sfComp);
  }
}
