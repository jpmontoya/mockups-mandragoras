import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-menu-models',
  imports: [ImageModule],
  templateUrl: './menu-models.component.html',
  styleUrl: './menu-models.component.css'
})
export class MenuModelsComponent {

  list = [
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
  ]
}
