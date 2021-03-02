import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.css'],
})
export class CropperComponent implements OnInit {
  public _file: any;
  public _aspectRatio: any;
  public imageChangedEvent: any = '';
  public croppedImage: any = '';

  @Input()
  set file($event) {
    this._file = $event;
  }

  @Input()
  set aspectRatio(value) {
    const fn = Function;
    this._aspectRatio = new fn('return ' + value)();
  }

  constructor(cd: ChangeDetectorRef, private ref: NzModalRef) {}

  ngOnInit() {}

  onSubmit() {
    this.ref.destroy({
      type: 'onOk',
      file: this.croppedImage,
      subject: this.ref,
    });
  }

  onCancel() {
    this.ref.destroy(false);
  }

  imageCropped(event) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
}
