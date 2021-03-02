import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { SpecItemValueModel } from '../interface';

@Component({
  selector: 'sku-editor-spec-item',
  templateUrl: './sku-editor-spec-item.component.html',
  styleUrls: ['./sku-editor-spec-item.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SkuEditorSpecItemComponent),
      multi: true,
    },
  ],
})
export class SkuEditorSpecItemComponent implements ControlValueAccessor {
  name: string;
  checkFlag: boolean;
  private id: any;

  private _change: Function;
  private _touch: Function;

  registerOnChange(fn: any): void {
    this._change = fn;
  }

  registerOnTouched(fn: any): void {
    this._touch = fn;
  }

  writeValue(value: SpecItemValueModel): void {
    this.name = value?.name;
    this.id = value?.id;
    this.checkFlag = value?.checkFlag;
  }

  emit(): void {
    if (typeof this._change === 'function') {
      const {name, checkFlag, id} = this;
      this._change(cloneDeep({id, name, checkFlag}));
    }
  }
}
