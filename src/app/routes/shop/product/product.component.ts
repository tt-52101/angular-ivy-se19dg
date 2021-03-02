import { ACLService } from '@delon/acl';
import { SettingsService, ALAIN_I18N_TOKEN, DrawerHelper } from '@delon/theme';
import { ProductService } from './product.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { I18NService } from '@core';
import { STReq, STRes, STComponent, STColumn, STColumnBadge } from '@delon/abc/st';
import { SFComponent, SFSchema } from '@delon/form';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { map } from 'rxjs/operators';

const DISABLED_BADGE: STColumnBadge = {
  true: { text: '下架', color: 'error' },
  false: { text: '上架', color: 'success' },
};

const TOP_FLAG_BADGE: STColumnBadge = {
  true: { text: '是', color: 'success' },
  false: { text: '否', color: 'error' },
};



import { environment } from '@env/environment';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {

  @ViewChild('sf') sf: SFComponent;

  @ViewChild('st')
  st: STComponent;
  public queryApi = '/v1/product/page';
  public pageIndex = 1;
  public pageSize = 10;
  public columns: STColumn[] = [ 
    { 
      title: 'IMAGE', 
      type: 'widget', 
      width: 120, 
      widget: { 
        type: 'img', params: ({ record }) => ({ 
          img: record.image?record.image: 'https://www.camelsc.com/images/logo-white-full.png' 
        }) 
      },
    },
    { 
      title: {
        text: 'No',
        i18n:  'app.product.no'
      },
      index: 'no' 
    },
    { 
      title: {
        text: 'Name',
        i18n:  'app.product.name'
      },
      index: 'name' 
    },
    { 
      title: {
        text: 'Category name',
        i18n:  'app.product.category'
      },
      index: 'categoryName' 
    },
    {
      title: {
        text: 'Store name',
        i18n: 'app.product.store'
      },
      index: 'store.name',
      acl: {
        role: ['ROLE_SUPER_ADMIN']
      }
    },
    { 
      title: {
        text: 'Sales price',
        i18n:  'app.product.sales_price'
      },
      type: 'currency',
      index: 'salesPrice',
      format: (record)=> {
        return new CurrencyPipe(this.i18n.currentLang).transform(record.salesPrice, record.currency)
      }
    },
    {
      title: {
        text: 'Top',
        i18n: 'app.product.top_flag'
      },
      type: 'yn',
      index: 'topFlag'
    },
    { 
      title: {
        text: 'disFlag',
        i18n:  'app.product.disabled'
      },
      type: 'badge',
      index: 'disFlag',
      badge: DISABLED_BADGE,
    },
    {
      title: {
        text: 'Create date',
        i18n:  'app.public.create_date'
      },
      index: 'createDate',
      type: 'date',
      sort: {
        default: 'descend',
        reName: {
          ascend: 'ASC',
          descend: 'DESC',
        },
      },
    },
    {
      title: {
        text: 'Last modified date',
        i18n:  'app.public.last_modified_date'
      },
      index: 'lastModifiedDate',
      type: 'date',
      sort: {
        reName: {
          ascend: 'ASC',
          descend: 'DESC',
        },
      },
    },
    {
      title: {
        text: 'Opreation',
        i18n:  'app.action.opreation'
      },
      fixed: 'right',
      width: '200px',
      buttons: [
        {
          text: 'check',
          i18n: 'app.action.check',
          type: 'link',
          click: (record)=> {
            window.open(`${environment.PRODUCT_DETAIL_URL}/${record.id}`)
          }
        },
        {
          text: 'Edit',
          i18n: 'app.action.edit',
          type: 'link',
          click: (record)=> this.handleModify(record)
        },
        {
          text: 'Delete',
          i18n: 'app.action.delete',
          type: 'del',
          pop: {
            okType: 'danger',
            icon: 'star',
          },
          click: (record, _modal, comp)=> this.productService.delete(record.id).subscribe(payload=> {
            this.message.success(`Successful delete`);
            comp.removeRow(record);
          }),
        },
      ],
    },
  ];

  public stReq: STReq = {
    method: 'POST',
    reName: { pi: 'page', ps: 'size' },
    body: {},
    allInBody: true,
  };

  public stRes: STRes = {
    reName: {
      total: 'total',
      list: 'records',
    },
  };


  public schema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        ui: {
          i18n: 'app.product.name',
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.product.name')}),
        },
      },
      brandId: {
        type: 'string',
        ui: {
          i18n: 'app.product.brand',
          widget: 'select',
          allowClear: true,
          placeholder: this.i18n.fanyi('app.action.select', {name: this.i18n.fanyi('app.product.brand')}),
          asyncData: () =>
            this.productService.getProductBrandList({}).pipe(
              map(payload => {
                return payload.map(item=> {
                  return {
                    label: item.name,
                    value: item.id
                  }
                });
              }),
            ),
        },
      },
      categoryId: {
        title: '所属类目',
        type: 'string',
        ui: {
          i18n: 'app.product.category',
          widget: 'tree-select',
          showSearch: true,
          allowClear: true,
          placeholder: this.i18n.fanyi('app.action.select', {name: this.i18n.fanyi('app.product.category')}),
          asyncData: () =>
            this.productService
            .getProductCategoryList({parentId: 0}).pipe(
              map(payload => {
                const recursionFormat = item => {
                  item.title = item.name;
                  item.key = item.id;
                  item.isLeaf = item.children && item.children.length ? false : true;
                  if (item.children && item.children.length !== 0) {
                    item.children = item.children.map(citem => recursionFormat(citem));
                  }
                  return item;
                };
                return payload.map(item=> recursionFormat(item));
              }),
            ),
        },
      },
      locale: {
        type: 'string',
        title: 'Locale',
        enum: this.i18n.getLangs().map(item=> { return {label: item.text, value: item.code}}),
        ui: {
          hidden: true,
          i18n: 'app.public.locale',
          widget: 'select',
          allowClear: true,
          placeholder:  this.i18n.fanyi('app.action.select', {name: this.i18n.fanyi('app.public.locale')}),
        },
        default: this.i18n.currentLang
      },
    },
    ui: {
      grid: {
        xxl: {
          span: 8,
        },
        xl: {
          span: 12,
        },
        lg: {
          span: 12,
        },
        md: {
          span: 24,
        },
        sm: {
          span: 24,
        },
      },
      spanLabelFixed: 110,
    },
  };



  handleModify(record?) {
    if (record && record.locale !== this.i18n.currentLang) {
      this.modal.confirm({
        nzTitle: this.i18n.fanyi('app.i18n.change_tips', {locale: this.i18n.fanyi(`app.i18n.${record.locale}`)}),
        nzOnOk: () => {
          this.i18n.use(record.locale);
          this.settings.setLayout('lang', record.locale);
          setTimeout(() => this.doc.location.reload());
          this.handleModify(record);
        },
        nzOnCancel: ()=> {
          return;
        }
      });
      return;
    }

    if (record && record.id) {
      this.router.navigate(['edit', record.id], {
        relativeTo: this.activatedRoute
      });
      return;
    }
    this.router.navigate(['create'], {
      relativeTo: this.activatedRoute
    });
    
  }


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private i18n: I18NService,
    private message: NzMessageService,
    private productService: ProductService,
    private modal: NzModalService,
    private settings: SettingsService,
    @Inject(DOCUMENT) private doc: any,
    private aclService: ACLService
  ) {}


  /**
   * 重置搜索
   */
  handleReset(event) {
    this.sf.reset();
    this.st.req.body = { };
    this.st.reset();
  }

  /**
   * 搜索
   */
  handleSearch(form) {
    this.st.req.body = {
      ...form,
    };
    this.st.reload();
  }


  _onReuseInit = ()=>{
    this.st.reload();
  }

  ngOnInit() {
    this.queryApi = this.aclService.data.roles.includes('ROLE_SUPER_ADMIN') ? '/v1/admin/product/page': '/v1/store/product/page'
    
  }


}
