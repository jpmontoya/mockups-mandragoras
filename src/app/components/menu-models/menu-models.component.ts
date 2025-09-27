import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { Observable } from 'rxjs/internal/Observable';
import { Models3dService } from '../../services/models-3d/models-3d.service';
import { CommonModule } from '@angular/common';

interface model3D {
  modelRoute: string,
  previweRoute: string
}

@Component({
  selector: 'app-menu-models',
  imports: [
    CommonModule,
    ImageModule
  ],
  templateUrl: './menu-models.component.html',
  styleUrl: './menu-models.component.css'
})
export class MenuModelsComponent {

  public selectedModel: Observable<model3D>;

  constructor(private models3dService: Models3dService) {
    this.selectedModel = models3dService.getSelectedModel;
  }

  listModels = [
    {
      modelRoute: "Mug_11oz.glb",
      previweRoute: "preview-mug.png"
    },
    {
      modelRoute: "SodaCan_15oz.glb",
      previweRoute: "preview-lata.png"
    }
  ]

  changeModel(model: any) {
    this.models3dService.setSelectedModel = model;
  }
}
