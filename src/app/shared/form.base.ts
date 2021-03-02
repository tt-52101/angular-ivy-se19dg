import { Injectable, ViewChild } from '@angular/core';
import { SFComponent, SFSchema } from '@delon/form';
import { NzModalRef  } from 'ng-zorro-antd/modal';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { isObject, isArray, isString } from 'util';

@Injectable()
export class FormBase {
  @ViewChild('sf') sf: SFComponent;

  public isLoading: boolean = false;

  // 多选字段，需要处理,号分割；
  public tags = [
    'statuses',
    'roles',
    // 'partnerId',
    // 'lenderPartnerIds',
    'residentialDistrict',
    'correspondentDistrict',
    'district',
    'correspondentDistrict',
    'registeredDistrict',
  ];

  // 所有需要处理费率的字段
  public rates = [];

  public formatForm(form) {
    const payload = { ...form };
    Object.keys(form).forEach(key => {
      if (form.hasOwnProperty(key) && !(form[key] instanceof Date) && isObject(form[key]) && !isArray(form[key])) {
        Object.assign(payload, form[key]);
        payload[key] = undefined;
      }
      if (this.tags.includes(key) && isString(form[key])) {
        payload[key] = [form[key]];
      }
      if (this.rates.indexOf(key) > -1 && form[key]) {
        payload[key] = form[key] / 100;
      }
    });
    return payload;
  }

  // 表单初始化统一处理
  public setFormValue(sfCop: SFComponent, sf: SFSchema, payload?, path: string = '') {
    if (!payload) {
      return;
    }
    Object.keys(sf.properties).forEach(key => {
      if (sf.properties.hasOwnProperty(key)) {
        if (sf.properties[key].type === 'object') {
          this.setFormValue(sfCop, sf.properties[key], payload, `/${key}`);
        } else if (payload[key] !== undefined) {
          if (this.rates.includes(key)) {
            sfCop.setValue(`${path}` + `/${key}`, (parseFloat(payload[key]) * 100).toFixed(2));
            return;
          }
          sfCop.setValue(
            `${path}` + `/${key}`,
            this.tags.includes(key) && payload[key].indexOf(',') > -1 ? payload[key].split(',') : payload[key],
          );
        }

        if (key.indexOf('confirmEmail') > -1) {
          this.sf.setValue(`${path}` + `/${key}`, payload['email']);
        }
      }
    });
  }

  constructor(public modalRef?: NzModalRef, public drawRef?: NzDrawerRef) {}
}
