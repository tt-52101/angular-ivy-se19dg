import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SpecItemValueModel } from '../interface';

@Component({
  selector: 'sku-editor-spec-wrapper',
  templateUrl: './sku-editor-spec-wrapper.component.html',
  styleUrls: ['./sku-editor-spec-wrapper.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SkuEditorSpecWrapperComponent),
      multi: true,
    },
  ],
})
export class SkuEditorSpecWrapperComponent implements ControlValueAccessor {
  form: FormGroup;
  private _change: Function;

  constructor(private fb: FormBuilder) {
    this.init();
  }

  registerOnChange(fn: any): void {
    this._change = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: SpecItemValueModel[]): void {
    this.init(obj);
  }

  private init(list: SpecItemValueModel[] = []): void {
    this.form = this.fb.group({
      spec: this.fb.array((list || [])),
    });
  }

  handleChange(e): void {
    this._change(this.form?.value?.spec);
  }
}
