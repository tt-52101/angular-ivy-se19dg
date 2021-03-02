import { _HttpClient } from '@delon/theme';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductParameterService {



  /**
   * 根据商品类别获取商品类目参数
   * @param categoryId 
   */
  getProductParameterListByCateogryId(categoryId) {
    return this.http.post('/open/category/parameter/list', {categoryId});
  }
  


  constructor(
    private http: _HttpClient
  ) { }



}
