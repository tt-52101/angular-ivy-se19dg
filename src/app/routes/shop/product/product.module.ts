import { ProductService } from './product.service';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ModifyComponent } from './modify/modify.component';
import { SkuEditorModule } from '@shared/sku-editor/sku-editor.module';
import { BatchImportComponent } from './batch-import/batch-import.component';


@NgModule({
  declarations: [ProductComponent, ModifyComponent, BatchImportComponent],
  imports: [
    SkuEditorModule,
    SharedModule,
    ProductRoutingModule
  ],
  providers: [
    ProductService
  ],
  entryComponents: [
    BatchImportComponent
  ]
})
export class ProductModule { }
