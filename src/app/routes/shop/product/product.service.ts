import { ACLService } from '@delon/acl';
import { _HttpClient } from '@delon/theme';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';

@Injectable()
export class ProductService {


  /**
   * 获取商品标签
   * @param data 
   */
  getProductTagsList(data) {
    return this.http.post('/open/product/tag/list', data);
  }



  /**
   * 获取品牌列表
   * @param data 
   */
  getProductBrandList(data) {
    return this.http.post('/open/brand/list', data);
  }



  /**
   * 获取商品类别列表
   * @param data 
   */
  getProductCategoryList(data) {
    return this.http.post('/open/category/list', data);
  }

  /**
   * 获取商品类别列表
   * @param pid 
   */
  getProductDetail(pid) {
    return this.http.get( this.aclService.data.roles.includes('ROLE_SUPER_ADMIN')? `/v1/admin/product/${pid}`: `/v1/store/product/${pid}`);
  }


  /**
   * 根据类目ID查询商品属性
   * @param data 
   */
  getProductAttributeList(data) {
    return this.http.post('/open/category/attribute/list', data);
  }


  /**
   * 根据类目ID查询商品规格
   * @param data 
   */
  getProductSpecsList(data) {
    return this.http.post('/open/category/specs/list', data);
  }


  /**
   * 获取文库集合
   * @param data 
   */
  getResourceLibraryList(data) {
    return this.http.post('/v1/library/list', data);
  }
  


   /**
    * 新增或修改商品
    * @param data 
    */
  updateProduct(data) {
    // return this.http.get( this.aclService.data.roles.includes('ROLE_SUPER_ADMIN')? `/v1/admin/product/${pid}`: `/v1/product/${pid}`);
    if (this.aclService.data.roles.includes('ROLE_SUPER_ADMIN')) {
      return data.id? this.http.put('/v1/admin/product', data): this.http.post('/v1/admin/product', data);
    }
    return data.id? this.http.put('/v1/store/product', data): this.http.post('/v1/store/product', data);
  }

  

   /**
   * 删除
   * @param id 
   */
  delete(id){
    return this.http.delete(`/v1/store/product/${id}`)
  }


  /**
   * 批量导入
   * @param file 
   */
  batchImport(file){
    const formData = new FormData();
    formData.append('file', file);
    // const req = new HttpRequest('POST', '/v1/attachment/upload', formData, {
    //   reportProgress: true,
    // });
    return this.http.request('POST', '/v1/attachment/upload', {
      body: formData,
      reportProgress: true
    });
  }


  constructor(
    private aclService: ACLService,
    private http: _HttpClient
  ) { }
}
