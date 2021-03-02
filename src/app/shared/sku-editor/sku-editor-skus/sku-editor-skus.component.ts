
import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { I18NService } from '@core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Sku } from '../interface';
import { cloneDeep, find } from 'lodash';
import { STColumn, STComponent } from '@delon/abc/st';


@Component({
  selector: 'sku-editor-skus',
  templateUrl: './sku-editor-skus.component.html',
  styleUrls: ['./sku-editor-skus.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SkuEditorSkusComponent),
      multi: true,
    },
  ],
})
export class SkuEditorSkusComponent implements ControlValueAccessor {

  @ViewChild('st') st: STComponent;
  
  @Input() currency: String;

  data: any[] = [];
  private _change: Function;

  @Input()
  set row(value: any[]) {
    value = value || [];
    this.data = value.map(t => ({
        salesPrice: '',
        costPrice: '',
        marketPrice: '',
        stock: '',
        defaultFlag: false,
        ...find(this.getValue(), t),
        ...t,
        disFlag: !t.disFlag ,
      }),
    );
  }

  value: Sku[] = [];

  cols = [];

  presetColumns: STColumn[] = [
    {title: this.i18n.fanyi('app.product.sales_price'), index: 'salesPrice', render: 'salesPrice'},
    {title: this.i18n.fanyi('app.product.cost_price'), index: 'costPrice', render: 'costPrice'},
    {title: this.i18n.fanyi('app.product.market_price'), index: 'marketPrice', render: 'marketPrice'},
    // {title: '最大佣金', index: 'zdyj', render: 'zdyj'},
    // {title: '赠送积分', index: 'stock', render: 'stock'},
    {title: this.i18n.fanyi('app.product.stock'), index: 'stock', render: 'stock'},
    {title: this.i18n.fanyi('app.public.default'), index: 'defaultFlag', render: 'defaultFlag'},
    {title: this.i18n.fanyi('app.public.enabled'), index: 'disFlag', render: 'disFlag'},
  ];

  allColumns = [];

  @Input()
  set columns(cols: STColumn[]) {
    this.cols = cols;
    this.allColumns = [...cols, ...this.presetColumns];
  }

  constructor(
    private i18n: I18NService,
  ) {
  }

  registerOnChange(fn: any): void {
    this._change = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this.data = obj;
  }

  change(): void { 
    setTimeout(()=>{
      const list = this.getValue();
      list.forEach(t => {
        const tempSpecsNames = [];
        for (const key in t) {
          if (t.hasOwnProperty(key)) {
            const index = this.cols.findIndex(item=> item.index == key);
            if(index> -1) {
              tempSpecsNames.push(t[key]);
            }
          }
        }
        t.disFlag = !t.disFlag;
        t.specsNames = tempSpecsNames.join(',');
        delete t._values
      });
      this._change(list);
    })
  }

  getValue(): any[] {
    const list = cloneDeep(this.st.list);
    list.forEach(t => delete t._values);
    return list;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  changeDefault($event: boolean, row): void {
    this.st.list.forEach(t => t.defaultFlag = false);
    row.defaultFlag = true;
    this.change();
  }

  changeDisFlag($event: boolean, row): void {
    if (!$event && row.defaultFlag) {
      row.defaultFlag = false;
    }
    this.change();
  }
}
