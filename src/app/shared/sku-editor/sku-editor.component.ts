
import { NzModalService } from 'ng-zorro-antd/modal';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { STColumn } from '@delon/abc/st';
import { Sku, SpecItemValueModel } from './interface';
import { Descartes2SKU } from 'descartes-sku.js';
import { ModalHelper } from '@delon/theme';
import { I18NService } from '@core';

@Component({
  selector: 'sku-editor',
  template: `
    <form [formGroup]="form">
      
      <div class="d-flex justify-content-center mb-md">
        <button nz-button nzType="default" (click)="handleReset()"><i nz-icon nzType="rest"
        nzTheme="outline"></i> {{"app.action.reset" | translate}}</button>
      </div>

      <sku-editor-spec-wrapper (ngModelChange)="handleChange($event)" formControlName="specs"></sku-editor-spec-wrapper>

      <sku-editor-skus formControlName="skus" [row]="rowData" [columns]="columns" [currency]="currency"
                       (ngModelChange)="handleSkuChange()"></sku-editor-skus>
    </form>
  `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SkuEditorComponent),
      multi: true,
    },
  ],
})
export class SkuEditorComponent implements ControlValueAccessor {
  form: FormGroup;
  columns: STColumn[] = [];
  skus: Sku[];
  rowData: any[];
  @Input() currency: String;
  @Output() reset = new EventEmitter<any>();
  
  private _change: Function;

  constructor(
    public i18n: I18NService,
    private fb: FormBuilder,
    private modal: NzModalService
    ) {
    this.form = fb.group({
      specs: [[]],
      skus: [],
    });
  }

  handleReset(): void {
    this.modal.confirm({
      nzTitle: this.i18n.fanyi('sku-editor.reset_tips'),
      nzOnOk: () => {
        this.reset.emit(true);
      }
    });
  }

  handleChange($event): void {
    this.setColumn($event);
    this.setRowBody($event);
    this._change(this.form.value);
  }

  registerOnChange(fn: any): void {
    this._change = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(value: { specs: any[], skus: any[] }): void {
    this.setColumn(value?.specs);
    this.setRowBody(value?.specs, value?.skus);
    const spec = value?.specs;
    this.form = this.fb.group({
      specs: [spec],
      skus: [],
    });
  }

  private setColumn(specs: { name, id, values }[]): void {
    if (!specs) {
      return;
    }
    const column: STColumn[] = [];
    specs.map(({name, id}) => {
      column.push({
        title: name,
        index: id,
      });
    });
    this.columns = column;
  }

  setRowBody(value: { name, id, values: SpecItemValueModel[] }[], skus?: any[]): void {
    if (!value) {
      return;
    }
    // const _lastRowData = this.rowData;
    if (skus) {
      this.rowData = skus.map(item=> {
        item.specsValues.split(',').forEach((specItem, specIndex) => {
            const parent = value.find(item=> item.values.findIndex(c=> c.id == specItem) > -1);
            item[parent.id] = item.specsNames.split(',')[specIndex]
            item['sort'] = specIndex;
        });
        return item;
      });
      return;
    }

    const obj = {};
    value.map(t => {
      obj[t.id] = t.values.filter(t1 => t1.checkFlag).map(t2 => t2.name);
    });
    
    let descartes = new Descartes2SKU(obj).descartes();
    this.rowData = descartes;
  }

  handleSkuChange(): void {
    this._change(this.form.value);
  }
}
