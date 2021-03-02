import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private http: HttpClient) {}

  upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', '/v1/attachment/upload', formData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
