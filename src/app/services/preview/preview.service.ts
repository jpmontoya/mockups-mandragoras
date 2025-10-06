import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  private scene: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  private previewCameras: BehaviorSubject<any[]> = new BehaviorSubject<any>([]);

  constructor() { }

  set setScene(scene: any) {
    this.scene.next(scene)
  }

  get getScene() {
    return this.scene.asObservable();
  }

  set setPreviewCameras(previewCameras: any) {
    this.previewCameras.next(previewCameras)
  }

  get getPreviewCameras() {
    return this.previewCameras.asObservable();
  }
}
