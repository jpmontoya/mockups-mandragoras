import { Component } from '@angular/core';
import { MenuModelsComponent } from '../menu-models/menu-models.component';
import { MenuSettingsComponent } from '../menu-settings/menu-settings.component';
import { ModelViewerComponent } from '../model-viewer/model-viewer.component';

@Component({
  selector: 'app-home',
  imports: [ModelViewerComponent, MenuModelsComponent, MenuSettingsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {

}
