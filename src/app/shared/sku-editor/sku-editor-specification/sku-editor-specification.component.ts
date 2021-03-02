import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'sku-editor-specification',
  templateUrl: './sku-editor-specification.component.html',
  styleUrls: ['./sku-editor-specification.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SkuEditorSpecificationComponent),
      multi: true,
    },
  ],
})
export class SkuEditorSpecificationComponent implements ControlValueAccessor {
  data: SpecModel;

  _change: Function;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      name: '',
      values: fb.array([]),
    });
  }

  registerOnChange(fn: any): void {
    this._change = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: SpecModel): void {
    this.data = cloneDeep(obj);
    this.form = this.fb.group({
      id: obj?.id,
      name: obj?.name,
      values: this.fb.array((obj?.values || [])?.map(t => this.fb.control(t))),
    });
  }

  handlechange(): void {
    this._change(this.form.value);
  }
}

export interface SpecModel {
  name: string;
  id: any;
  values: { text, id, checkFlag }[];
}
