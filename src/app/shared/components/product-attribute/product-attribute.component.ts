import { ProductAttributeService } from './product-attribute.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
/**
 * 使用方式：
 *
 * <product-attribute [json]="jsonobj" (change)="changfun($event)"></product-attribute>
 */
@Component({
  selector: 'product-attribute',
  templateUrl: './product-attribute.component.html',
  styleUrls: ['./product-attribute.component.less'],
  providers: [ProductAttributeService]
})
export class ProductAttributeComponent implements OnInit, OnChanges{

  @Output() update = new EventEmitter<any>();

  @Input() json: any = [];

  @Input() categoryId: string;

  list: any = [];

  constructor(
    private productAttrService: ProductAttributeService
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
    this.productAttrService.getProductAttrListByCateogryId(categoryId).subscribe(attrList=> {
      this.list = attrList;
      if (this.json) {
        this.list.forEach(item => {
          const cItem = this.json.find(c=> item.values.findIndex(d=> d.id == c.attributeId) > -1);
          if (cItem) {
            item.selected = cItem.attributeId;
          }
        });
      }
    }, err=> {
      console.log(err)
    })
  }

  /**
   * 事件通知
   */
  notify() {
    this.update.emit(this.list);
  }
}
