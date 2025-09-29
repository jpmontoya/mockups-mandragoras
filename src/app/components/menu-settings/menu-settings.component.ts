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
import { PrimeNG } from 'primeng/config';
import { ImagesPrintingService } from '../../services/images-printing/images-printing.service';
import html2canvas from 'html2canvas';

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
  public isDragOver: boolean = false;
  uploadedImageUrl: string | null = null;

  downloadOptions: MenuItem[];

  constructor(
    private messageService: MessageService,
    private colorsModelsService: ColorsModelsService,
    private imagesPrintingService: ImagesPrintingService,
    private config: PrimeNG
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

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const sizes: any = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: number) {
    removeFileCallback(event, index);
  }

  onFileSelect(event: any) {
    const file: File = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagesPrintingService.setImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  downloadPreview() {
    const canvas1 = document.getElementById('preview1') as HTMLCanvasElement;
    const canvas2 = document.getElementById('preview2') as HTMLCanvasElement;
    const canvas3 = document.getElementById('preview3') as HTMLCanvasElement;
    const canvas4 = document.getElementById('preview4') as HTMLCanvasElement;

    // Crear canvas final
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d')!;

    const width = canvas1.width + canvas2.width;  // total ancho del grid
    const height = canvas1.height + canvas3.height; // total alto del grid

    finalCanvas.width = width;
    finalCanvas.height = height;

    // Dibujar los canvas en el grid
    ctx.drawImage(canvas1, 0, 0); // top-left
    ctx.drawImage(canvas2, canvas1.width, 0); // top-right
    ctx.drawImage(canvas3, 0, canvas1.height); // bottom-left
    ctx.drawImage(canvas4, canvas3.width, canvas1.height); // bottom-right

    // Agregar textos
    ctx.fillStyle = 'black';
    ctx.font = '16px sans-serif';
    ctx.fillText('Isometrica', 10, canvas1.height - 10);
    ctx.fillText('Lateral', canvas1.width + 10, canvas2.height - 10);
    ctx.fillText('Frontal', 10, canvas1.height + canvas3.height - 10);
    ctx.fillText('Posterior', canvas3.width + 10, canvas4.height + canvas3.height - 10);

    // Descargar imagen
    const link = document.createElement('a');
    link.href = finalCanvas.toDataURL('image/png');
    link.download = 'preview.png';
    link.click();
  }
}
