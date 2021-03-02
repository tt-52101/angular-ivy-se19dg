import { I18NService } from '@core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ControlWidget, SFItemComponent } from '@delon/form';

@Component({
  selector: 'sf-tinymce',
  template: `
    <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
      <tinymce  *ngIf="isVisible" [ngModel]="value" (ngModelChange)="change($event)" [config]="config" [loading]="loading" [delay]=100> </tinymce>
    </sf-item-wrap>
  `,
})
// tslint:disable-next-line:component-class-suffix
export class TinymceWidget extends ControlWidget implements OnInit {
  static readonly KEY = 'tinymce';
  config: {};
  loading: string;
  isVisible: boolean = false;

  ngOnInit(): void {
    this.loading = this.ui.loading || '加载中……';
    this.config = this.ui.config || {
      language: this.i18n.currentLang,
      language_url: `/assets/langs/${this.i18n.currentLang}.js`,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount',
        'lists, advlist'
      ],
      toolbar: 'undo redo | bullist numlist | image code',
      /* without images_upload_url set, Upload tab won't show up*/
      images_upload_url: '/v1/attachment/upload',
      /* we override default upload handler to simulate successful upload*/
      images_upload_handler:  (blobInfo, success, failure) => {
        const formData = new FormData();
        formData.append('file', blobInfo.blob());
        const req = new HttpRequest('POST', '/v1/attachment/upload', formData, {
          reportProgress: true,
        });
        this.http.request(req).subscribe((res: any) => {
          if (res.type == 4) {
            success(res.body.url)
          }
        }, err=> {

        });
      },
    };

    setTimeout(() => {
      this.isVisible = true;
      this.cd.detectChanges();
    },1000)
  }

  change(value: string): void {
    if (this.ui.change) this.ui.change(value);
    this.setValue(value);
  }

  constructor(
    private http: HttpClient,
    private i18n: I18NService,
    cd: ChangeDetectorRef,
    sfComp: SFItemComponent,
    injector: Injector
  ) {
    super(cd, injector, sfComp);
  }

}