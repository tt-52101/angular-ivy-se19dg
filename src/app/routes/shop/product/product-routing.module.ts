
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './product.component';
import { ModifyComponent } from './modify/modify.component';

const routes: Routes = [
  { 
    path: '', 
    component: ProductComponent 
  },
  {
    path: 'create',
    component: ModifyComponent,
    data: {
      title: '创建商品',
      titleI18n: 'app.product.add'
    }
  },
  {
    path: 'edit/:pid',
    component: ModifyComponent,
    data: {
      title: '编辑商品',
      titleI18n: 'app.product.edit'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
