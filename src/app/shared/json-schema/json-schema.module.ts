

import { NgModule } from '@angular/core';
import { DelonFormModule, WidgetRegistry,  } from '@delon/form';
import { SharedModule } from '../shared.module';

import { AddressWidget } from './widgets/address/address.widget';
import { EditorWidget } from './widgets/editor/editor.widget';
import { ImageUploadWidget } from './widgets/image-upload/image-upload.widget';
import { ImgWidget } from './widgets/img/img.widget';
import { ValuesWidget } from './widgets/values/values.widget';
import { CropperComponent } from './widgets/image-upload/cropper/cropper.component';
import { TinymceWidget } from './widgets/tinymce/tinymce.widget';
import { NgxTinymceModule } from 'ngx-tinymce';
import {  OtpWidget } from './widgets/otp/otp.widget';



export const SCHEMA_THIRDS_COMPONENTS = [EditorWidget, ImgWidget, AddressWidget, ImageUploadWidget, ValuesWidget, CropperComponent, TinymceWidget, OtpWidget];

@NgModule({
  declarations: SCHEMA_THIRDS_COMPONENTS,
  entryComponents: SCHEMA_THIRDS_COMPONENTS,
  imports: [  SharedModule, DelonFormModule.forRoot(), NgxTinymceModule.forRoot({
    // baseURL: './assets/tinymce/',
    // or cdn
    baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/5.3.2/'
  })],
  exports: [...SCHEMA_THIRDS_COMPONENTS],
})
export class JsonSchemaModule {
  constructor(widgetRegistry: WidgetRegistry) {
    widgetRegistry.register(ValuesWidget.KEY, ValuesWidget);
    widgetRegistry.register(EditorWidget.KEY, EditorWidget);
    widgetRegistry.register(ImgWidget.KEY, ImgWidget);
    widgetRegistry.register(AddressWidget.KEY, AddressWidget);
    widgetRegistry.register(ImageUploadWidget.KEY, ImageUploadWidget);
    widgetRegistry.register(TinymceWidget.KEY, TinymceWidget);
    widgetRegistry.register(OtpWidget.KEY, OtpWidget);
  }
}
