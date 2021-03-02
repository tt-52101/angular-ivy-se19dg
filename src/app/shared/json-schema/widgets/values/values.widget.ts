import { Component, ElementRef, OnInit  } from '@angular/core';
import { ControlWidget, ControlUIWidget, FormProperty, SFArrayWidgetSchema } from '@delon/form';
import { SafeHtml } from '@angular/platform-browser';
import { isArray } from 'util';

@Component({
  selector: 'sf-values',
  templateUrl: './values.widget.html'
})
export class ValuesWidget extends ControlWidget {

    static readonly KEY = 'values';
    
    public list: any = [];

    add(e: FocusEvent): void {
        this.list.push({});
    }

    changeVal() {
        this.setValue(this.list.filter(item => { 
            return item.hasOwnProperty('value')
        }));
    }
    
    remove(index) {
       this.list.splice(index, 1);
       this.changeVal();
    }

    ngOnInit() {
        if (Array.isArray(this.formProperty.formData)) {
            if (typeof this.formProperty.formData[0] == 'string') {
                this.list = this.formProperty.formData.map(item=> {
                    return {
                        value: item
                    }
                })
            }  else {
                this.list = this.formProperty.formData;
            }
            this.changeVal()
            this.cd.detectChanges();
        }
    }

    
}
