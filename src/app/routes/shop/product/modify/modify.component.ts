import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { _HttpClient } from '@delon/theme';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { SFSchema, SFArrayWidgetSchema, SFComponent } from '@delon/form';
import { I18NService } from '@core';
import { map } from 'rxjs/operators';
 
@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.less']
})
export class ModifyComponent implements OnInit {

  @ViewChild('bashSf', { static: true }) bashSf: SFComponent;
  @ViewChild('introSf', { static: true }) introSf: SFComponent;
  @ViewChild('imagesSf', { static: true }) imagesSf: SFComponent;
  

  public record: any = {
    parameters: [],
    attributes: []
  }; 
  
  public sku = {
    specs: [],
    skus: []
  };
  
  public baseSchema: SFSchema = {
    properties: {
      id: {
        type: 'string',
        title: 'Id',
        ui: {
          hidden: true,
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
          errors: {
            required:  this.i18n.fanyi('app.form.vaild.required', {name: this.i18n.fanyi('app.product.category')})
          },
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
      name: {
        type: 'string',
        title: 'Name',  
        pattern: '^(.|\\n){1,200}\\S$',
        ui: {
          i18n: 'app.product.name',
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.product.name')}),
          errors: {
            required:  this.i18n.fanyi('app.form.vaild.required', {name: this.i18n.fanyi('app.product.name')}),
            pattern: this.i18n.fanyi('app.form.verify.string_length_range', {min: 1, max:200})
          },
        },
      }, 
      description: {
        type: 'string',
        title: 'description',
        pattern: '^(.|\\n){0,255}\\S$',
        ui: {
          i18n: 'app.product.description',
          widget: 'textarea',
          autosize: { minRows: 2,  },
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.product.description')}),
          errors: {
            pattern: this.i18n.fanyi('app.form.verify.string_length_range', {min: 0, max:255})
          },
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
              })
            ),
        },
      },
      productTags: {
        type: 'string',
        ui: {
          i18n: 'app.product.tag',
          widget: 'select',
          mode: 'multiple',
          allowClear: true,
          placeholder: this.i18n.fanyi('app.action.select', {name: this.i18n.fanyi('app.product.tag')}),
          asyncData: () =>
            this.productService.getProductTagsList({}).pipe(
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
      material: {
        type: 'string',
        title: 'Material',
        pattern: '^(.|\\n){0,32}\\S$',
        ui: {
          i18n: 'app.product.material',
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.product.material')}),
          errors: {
            pattern: this.i18n.fanyi('app.form.verify.string_length_range', {min: 0, max:32})
          },
        },
      },
      pn: {
        type: 'string',
        title: 'pn',
        pattern: '^(.|\\n){8,32}\\S$',
        ui: {
          i18n: 'app.product.pn',
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.product.pn')}),
          errors: {
            pattern: this.i18n.fanyi('app.form.verify.string_length_range', {min: 8, max:32})
          },
        }
      },
      currency: {
        type: 'string',
        title: 'currency',
        enum: this.i18n.getLangs().map(item=> { return {label: item.currency, value: item.currency }}),
        ui: {
          i18n: 'app.product.currency',
          placeholder: this.i18n.fanyi('app.action.select', {name: this.i18n.fanyi('app.product.currency')}),
          widget: 'select',
          allowClear: true,
        },
        default: this.i18n.getLangs().find(item=> item.code == this.i18n.currentLang).currency
      },
      salesPrice: {
        type: 'string',
        pattern: '^([1-9]\\d{0,7}|0)([.]?|(\\.\\d{1,2})?)$',
        ui: {
          i18n: 'app.product.sales_price',
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.product.sales_price')}),
          errors: {
            required: this.i18n.fanyi('app.form.verify.required', {name:this.i18n.fanyi('app.product.sales_price')}),
            pattern: this.i18n.fanyi('app.form.verify.amount_ceiling')
          }
        },
      },
      costPrice: {
        type: 'string',
        title: 'CostPrice',
        pattern: '^([1-9]\\d{0,7}|0)([.]?|(\\.\\d{1,2})?)$',
        ui: {
          i18n: 'app.product.cost_price',
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.product.cost_price')}),
          errors: {
            pattern: this.i18n.fanyi('app.form.verify.amount_ceiling')
          },
        },
      },
      marketPrice: {
        type: 'string',
        title: 'MarketPrice',
        pattern: '^([1-9]\\d{0,7}|0)([.]?|(\\.\\d{1,2})?)$',
        ui: {
          i18n: 'app.product.market_price',
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.product.market_price')}),
          errors: {
            pattern: this.i18n.fanyi('app.form.verify.amount_ceiling')
          },
        },
      },
      unit: {
        type: 'string',
        title: 'Unit',
        pattern: '^(.|\\n){0,10}\\S$',
        ui: {
          i18n: 'app.product.unit',
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.product.unit')}),
          errors: {
            required: this.i18n.fanyi('app.form.verify.required', {name:this.i18n.fanyi('app.product.unit')}),
            pattern: this.i18n.fanyi('app.form.verify.string_length_range', {min: 1, max:10})
          }
        },
      },
      // stock: {
      //   type: 'number',
      //   title: 'Stock',
      //   ui: {
      //     min: 0,
      //     i18n: 'app.product.stock',
      //     placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.product.stock')}),
      //   },
      // },
      invoiceFlag: {
        type: 'boolean',
        title: 'Invoice',
        ui: {
          i18n: 'app.product.invoice',
        },
      },
      topFlag: {
        type: 'boolean',
        title: 'Top',
        default: false,
        ui: {
          acl: {
            role: ['ROLE_SUPER_ADMIN']
          },
          i18n: 'app.product.top',
        },
      },
      logisticsFlag: {
        type: 'boolean',
        title: 'Logistics',
        ui: {
          i18n: 'app.product.logistics',
        },
      },
      disFlag: {
        type: 'boolean',
        title: 'Disabled',
        ui: {
          i18n: 'app.product.disabled',
        },
      },
      keyword: {
        type: 'string',
        title: 'Keyword',
        pattern: '^(.|\\n){0,50}\\S$',
        ui: {
          i18n: 'app.product.keyword',
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.product.keyword')}),
          errors: {
            pattern: this.i18n.fanyi('app.form.verify.string_length_range', {min: 0, max:50})
          }
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
      },
      remark: {
        type: 'string',
        title: 'Remark',
        pattern: '^(.|\\n){1,200}\\S$',
        ui: {
          i18n: 'app.product.remark',
          widget: 'textarea',
          autosize: { minRows: 2,  },
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.public.remark')}),
          errors: {
            pattern: this.i18n.fanyi('app.form.verify.string_length_range', {min: 0, max:200})
          }
        },
      },
    },
    required: ['unit', 'categoryId', 'name', 'stock', 'salesPrice'],
    ui: {
      spanLabel: 4,
      spanControl: 12,
      // grid: {
      //   span: 12
      // }
    },
  };


  public introduceSchema: SFSchema = {
    properties: {
      libraries: {
        title: '相关文库',
        type: 'string',
        ui: {
          i18n: 'app.product.libraries',
          showSearch: true,
          allowClear: true,
          placeholder: this.i18n.fanyi('app.action.select', {name: this.i18n.fanyi('app.product.libraries')}),
          widget: 'select',
          mode: 'multiple',
          asyncData: () =>
            this.productService.getResourceLibraryList({ disFlag: false }).pipe(
              map(res => {
                return res.map(item => {
                  return { label: item.name, value: item.id };
                });
              }),
            ),
        },
      },
      introduce: {
        type: 'string',
        title: 'introduce',
        ui: {
          i18n: 'app.product.introduce',
          widget: 'editor'
        },
      }
    },
    ui: {
      spanLabel: 4,
      spanControl: 16,
    },
  }

  public imagesSchema: SFSchema = {
    properties: {
      images: {
        type: 'string',
        title: 'images',
        ui: {
          i18n: 'app.product.image',
          widget: 'image-upload',
          fileType: 'image/png,image/jpeg,image/gif,image/bmp',
          limit: 5,
        }
      },
    },
    required: [],
    ui: {
      spanLabel: 4,
      spanControl: 16,
    },
  }
 

  /**
   * 商品属性变动
   * @param event 
   */
  handleProductAttributesChange(event){
    if(event) {
      this.record.attributes = event.map(item=> {
        item.attributeId = item.selected;
        return item
      });
    }
  } 


  /**
   * 商品参数变动 
   * @param event 
   */
  handleProductParamChange(event){
      this.record.parameters = event?event:[];
  }

  /**
   * 保存
   */
  onSubmit() {
      const payload = {
        ...this.bashSf.value,
        ...this.sku,
        images: this.imagesSf.value.images,
        introduce: this.introSf.value.introduce,
        libraries: this.introSf.value.libraries,
        attributes:  this.record.attributes?this.record.attributes.map(item=>item.attributeId):[],
        parameters: this.record.parameters
      } 
      this.productService.updateProduct(payload).subscribe(response=> {
        this.messageService.success(`Successful save`);
        this.router.navigate(['shop/product']);
      }, err=> {

      })
  }


  /**
   * 取消
   */
  onCancel() {
    this.router.navigate(['shop/product'])
  }

  /**
   * 捕获商品规格
   */
  handleSkuChange(event) {
    // this.record = {...event};
  }

  /**
   * 捕获表单值变动
   */
  handleFormValueChange(event) {
    if (event.path.includes('/categoryId') && typeof event.pathValue == 'string') { 
      this.getProductSpecList(event.pathValue);
    }
  }


  /**
   * 获取商品详情
   * @param pid 
   */
  getProductDetail(pid) {
    this.productService.getProductDetail(pid).subscribe(payload=> {
      payload.libraries = payload.libraries.map(item=> item.libraryId);
      this.record = {
        ...payload
      };
      this.cdf.detectChanges();
      this.getProductSpecList(this.record.categoryId);
      
      console.log(this.bashSf.value)
      console.log(this.bashSf.valid)
    }, err=>{

    })
  }

  /**
   * 重置规格
   * @param event 
   */
  handleSkuReset(event) {
    this.sku = { specs: [], skus: []};
    this.record.specs = null;
    this.getProductSpecList(this.bashSf.value.categoryId);
  }


  /**
   * 获取商品属性并初始化SKU
   */
  getProductSpecList(categoryId) {
    this.productService.getProductSpecsList({categoryId}).subscribe(defaultSpecList => {
       
      if(this.record && this.record.specs) {
        this.record.createSpecs = false;
        const exitSpecList = this.record.specs;
        this.sku = { ...this.sku, specs: exitSpecList, skus: this.record.skus};
        return;
      };

      this.record.createSpecs = true;
      defaultSpecList = defaultSpecList.map(item=> {
        item.values = item.values.map(i=> {
          const _i = {
            name: i.value,
            isChecked: false
          };
          return _i;
        });
        return item;
      });
      this.sku = { ...this.sku, specs: defaultSpecList}
     
    });
  }


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public http: _HttpClient,
    private i18n: I18NService,
    private messageService: NzMessageService,
    private cdf: ChangeDetectorRef
  ) { }



  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params=> {
      const productId = params.get('pid');
      if (productId) {
        this.getProductDetail(productId);
      }
    });

  }

}
