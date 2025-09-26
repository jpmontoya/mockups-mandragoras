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
import { HttpClientModule } from '@angular/common/http';

interface Categories {
  name: string;
  code: string;
}

@Component({
  selector: 'app-menu-settings',
  imports: [
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
    SplitButtonModule
  ],
  templateUrl: './menu-settings.component.html',
  styleUrl: './menu-settings.component.css',
  providers: [MessageService],
  standalone: true
})
export class MenuSettingsComponent implements OnInit {
  categories: Categories[] | undefined;
  selectedCategory: Categories | undefined;

  downloadOptions: MenuItem[];

  constructor(private messageService: MessageService) {
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

  upload(event: any) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
  }
}
