import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuItem, MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { HttpClientModule } from '@angular/common/http';
import { ColorsModelsService } from '../../services/colors-models/colors-models.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

interface Categories {
  name: string;
  code: string;
}

@Component({
  selector: 'app-menu-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    MessageModule,
    FloatLabelModule,
    SelectModule,
    FileUpload,
    ToastModule,
    ButtonModule,
    ProgressBarModule,
    SplitButtonModule,
    ColorPickerModule
  ],
  templateUrl: './menu-settings.component.html',
  styleUrl: './menu-settings.component.css',
  providers: [MessageService],
  standalone: true
})
export class MenuSettingsComponent implements OnInit {
  categories: Categories[] | undefined;
  selectedCategory: Categories | undefined;

  public colorPickerBody: Observable<String>;

  downloadOptions: MenuItem[];

  constructor(
    private messageService: MessageService,
    private colorsModelsService: ColorsModelsService
  ) {
    this.colorPickerBody = this.colorsModelsService.getColorBody;

    this.categories = [
      { name: 'Mugs', code: 'mugs' },
      { name: 'Termos', code: 'RM' },
      { name: 'Camisetas', code: 'tshirts' },
      { name: 'Busos', code: 'coat' },
    ];

    this.downloadOptions = [
      {
        label: 'Update',
        command: () => {
        }
      },
      {
        label: 'Delete',
        command: () => {
        }
      }
    ]
  }

  ngOnInit() {
  }

  changeColorBody(color: any) {
    this.colorsModelsService.setColorBody = color.value;
  }

  upload(event: any) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
  }
}
