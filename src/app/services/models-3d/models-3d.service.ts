import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

interface model3D {
  modelRoute: string,
  previweRoute: string
}

@Injectable({
  providedIn: 'root'
})
export class Models3dService {
  private selectedModel: BehaviorSubject<model3D> = new BehaviorSubject<model3D>(
    {
      modelRoute: "Mug_11oz.glb",
      previweRoute: "preview-mug.png"
    }
  );

  constructor() { }

  set setSelectedModel(model: model3D) {
    this.selectedModel.next(model)
  }

  get getSelectedModel() {
    return this.selectedModel.asObservable();
  }
}
