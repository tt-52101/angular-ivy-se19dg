import { _HttpClient } from '@delon/theme';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductAttributeService {



  /**
   * 根据商品类别获取商品属性
   * @param categoryId 
   */
  getProductAttrListByCateogryId(categoryId) {
    return this.http.post('/open/category/attribute/list', {categoryId});
  }
  


  constructor(
    private http: _HttpClient
  ) { }



}
