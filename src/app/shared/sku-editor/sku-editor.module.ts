import { NzModalModule } from 'ng-zorro-antd/modal';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { SkuEditorComponent } from './sku-editor.component';
import { SkuEditorSpecificationComponent } from './sku-editor-specification/sku-editor-specification.component';
import { SkuEditorSkusComponent } from './sku-editor-skus/sku-editor-skus.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SkuEditorSpecItemComponent } from './sku-editor-spec-item/sku-editor-spec-item.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { STModule } from '@delon/abc/st';
import { SkuEditorSpecWrapperComponent } from './sku-editor-spec-wrapper/sku-editor-spec-wrapper.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [SkuEditorComponent, SkuEditorSpecificationComponent, SkuEditorSkusComponent, SkuEditorSpecItemComponent, SkuEditorSpecWrapperComponent],
  imports: [
    NzFormModule,
    NzInputModule,
    CommonModule,
    NzCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    NzTableModule,
    STModule,
    NzTableModule,
    NzSwitchModule,
    NzButtonModule,
    TranslateModule,
    NzModalModule
  ],
  exports: [SkuEditorComponent],
})
export class SkuEditorModule {
}
