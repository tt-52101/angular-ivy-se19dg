import { Component, OnInit, ChangeDetectorRef, Inject, Injector } from '@angular/core';
import { ControlWidget, SFComponent, SFItemComponent } from '@delon/form';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CropperComponent } from './cropper/cropper.component';
import { ImageUploadService } from './image-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}



@Component({
  selector: 'sf-image-upload',
  templateUrl: './image-upload.widget.html',
  styleUrls: ['./image-upload.widget.less'],
})
// tslint:disable-next-line:component-class-suffix
export class ImageUploadWidget extends ControlWidget implements OnInit {
  
  static readonly KEY = 'image-upload';
  public percent: number = 0;
  public config: any = {
    limit: 1
  };
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;


  constructor(
    cd: ChangeDetectorRef,
    sfComp: SFItemComponent,
    injector: Injector
  ) {
    super(cd, injector, sfComp);
  }

  ngOnInit(): void {
    this.config = Object.assign(this.config, this.ui);

    if (this.formProperty.formData && !Array.isArray(this.formProperty.formData)) {
      this.fileList.push({
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: <string>this.formProperty.formData
      });
    } else if (this.formProperty.formData && Array.isArray(this.formProperty.formData)) {
      this.fileList = this.formProperty.formData.map(item=> {
        return {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: item
        }
      })
    } 
    this.cd.detectChanges();
  }



  handleUploadChange(e: NzUploadChangeParam) {
    if (e.type === "success") {
      const list = e.fileList.map(item=> item.response.url);
      this.setValue(this.config.limit > 1 ? list: list.join());
    }
  }


  /**
   * base64 转二进制流
   */ 
  convertBase64UrlToBlob(urlData) {
    const bytes = window.atob(urlData.split(',')[1]); // 去掉url的头，并转换为byte
    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }

  /**
   * 图片预览
   * @param file 
   */
  handlePreview = async (file: NzUploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };
}
