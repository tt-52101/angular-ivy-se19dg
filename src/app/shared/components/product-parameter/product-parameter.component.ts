
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { ProductParameterService } from './product-parameter.service';

/**
 * 使用方式：
 *
 * <product-param [json]="jsonobj" (change)="changfun($event)"></product-param>
 */
@Component({
  selector: 'product-parameter',
  templateUrl: './product-parameter.component.html',
  styleUrls: ['./product-parameter.component.less'],
  providers: [ProductParameterService]
})
export class ProductParameterComponent implements OnInit, OnChanges {
  @Output() update = new EventEmitter<any>();

  @Input() json: any = [];

  @Input() categoryId: string;

  list: any = [];

  
  constructor(
    private productParameterService: ProductParameterService
  ) {}

  ngOnInit() {
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes.categoryId && changes.categoryId.currentValue) {
      this.getProductAttrList(changes.categoryId.currentValue);
    }
  }



  /**
   * 查询商品属性，初始化表单
   * @param categoryId 
   */
  getProductAttrList(categoryId) {
    this.productParameterService.getProductParameterListByCateogryId(categoryId).subscribe(parameterList=> {
      if (this.json.length) {
        this.list = this.json;
      } else {
        this.list = parameterList.map(item=> {
          item.values = item.values.map(cItem=> {
            return {
              name: cItem
            }
          });
          return item;
        })
      }
    }, err=> {
    })
  }


  /**
   * 添加子节点
   * @param idx 外层索引
   */
  add(idx) {
    this.list[idx].values.push({
      name: '',
      value: '',
    });
  }
  /**
   * 删除根节点
   * @param idx 外层索引
   */
  del(idx) {
    this.list.splice(idx, 1);
  }

  /**
   * 添加根节点
   */
  addroot() {
    this.list.push({
      name: '',
      values: [
        {
          name: '',
          value: '',
        },
      ],
    });
  }

  /**
   * 删除子节点
   * @param idx 外层数组索引
   * @param idx2 内层数组索引
   */
  delsub(idx, idx2) {
    this.list[idx].values.splice(idx2, 1);
  }

  /**
   * 事件通知
   */
  notify() {
    this.update.emit(this.list);
  }
}
