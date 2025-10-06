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
import { FieldsetModule } from 'primeng/fieldset';
import * as THREE from 'three';
import { PreviewService } from '../../services/preview/preview.service';
import { LoaderService } from '../../services/loader/loader.service';

interface Categories {
  name: string;
  code: string;
  disabled: boolean;
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
    ColorPickerModule,
    FieldsetModule
  ],
  templateUrl: './menu-settings.component.html',
  styleUrl: './menu-settings.component.css',
  providers: [MessageService],
  standalone: true
})
export class MenuSettingsComponent implements OnInit {
  categories: Categories[] | undefined;
  selectedCategory: Categories | undefined = { name: 'Mugs', code: 'mugs', disabled: false };

  public colorPickerBody: Observable<String>;
  public colorPickerRing: Observable<String>;
  public colorPickerHandle: Observable<String>;
  public colorPickerInside: Observable<String>;
  public colorPickerBase: Observable<String>;

  public isDragOver: boolean = false;
  uploadedImageUrl: string | null = null;

  downloadOptions: MenuItem[];

  public loader: Observable<Boolean>;

  constructor(
    private messageService: MessageService,
    private colorsModelsService: ColorsModelsService,
    private imagesPrintingService: ImagesPrintingService,
    private config: PrimeNG,
    private previewService: PreviewService,
    private loaderService: LoaderService
  ) {
    this.colorPickerBody = this.colorsModelsService.getColorBody;
    this.colorPickerRing = this.colorsModelsService.getColorRing;
    this.colorPickerHandle = this.colorsModelsService.getColorHandle;
    this.colorPickerInside = this.colorsModelsService.getColorInside;
    this.colorPickerBase = this.colorsModelsService.getColorBase;

    this.loader = this.loaderService.getLoader;

    this.categories = [
      { name: 'Mugs', code: 'mugs', disabled: false },
      { name: 'Termos', code: 'RM', disabled: true },
      { name: 'Camisetas', code: 'tshirts', disabled: true },
      { name: 'Busos', code: 'coat', disabled: true },
    ];

    this.downloadOptions = [
      {
        label: 'Frontal',
        disabled: true,
        command: () => {
        }
      },
      {
        label: 'Posterior',
        disabled: true,
        command: () => {
        }
      },
      {
        label: 'Isométrica',
        disabled: true,
        command: () => {
        }
      },
      {
        label: 'Lateral',
        disabled: true,
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

  changeColorRing(color: any) {
    this.colorsModelsService.setColorRing = color.value;
  }

  changeColorHandle(color: any) {
    this.colorsModelsService.setColorHandle = color.value;
  }

  changeColorInside(color: any) {
    this.colorsModelsService.setColorInside = color.value;
  }

  changeColorBase(color: any) {
    this.colorsModelsService.setColorBase = color.value;
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
    window.location.reload();
  }

  onFileSelect(event: any) {
    this.loaderService.setLoader = true;
    const file: File = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagesPrintingService.setImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async downloadPreview() {
    try {
      const [scene, previewCameras] = await Promise.all([
        new Promise<any>((resolve) => this.previewService.getScene.subscribe(resolve)),
        new Promise<any[]>((resolve) => this.previewService.getPreviewCameras.subscribe(resolve))
      ]);

      if (!scene || !Array.isArray(previewCameras) || previewCameras.length === 0) {
        console.error('Scene or cameras not available');
        return;
      }

      // Crear renderer
      const renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: false
      });

      const size = 400;
      const quality = 2; // Reducir calidad si hay problemas de performance
      renderer.setSize(size * quality, size * quality);
      renderer.setPixelRatio(quality);

      renderer.setClearColor(0x656c77, 1);
      renderer.clear();

      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = size * 2 * quality;
      finalCanvas.height = size * 2 * quality;
      const ctx = finalCanvas.getContext('2d')!;

      ctx.fillStyle = '#656c77';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      const renderView = (camera: any, index: any) => {
        return new Promise(resolve => {
          // Forzar actualización
          camera.updateMatrixWorld();
          scene.updateMatrixWorld();

          // Renderizar
          renderer.render(scene, camera);

          // Esperar al siguiente frame
          requestAnimationFrame(() => {
            const x = (index % 2) * size * quality;
            const y = Math.floor(index / 2) * size * quality;

            ctx.drawImage(
              renderer.domElement,
              x, y,
              size * quality,
              size * quality
            );
            resolve(true);
          });
        });
      };

      // Renderizar todas las vistas secuencialmente
      for (let i = 0; i < 4; i++) {
        if (previewCameras[i]) {
          await renderView(previewCameras[i], i);
        }
      }

      this.drawTexts(ctx, size, quality);

      renderer.dispose();

      const link = document.createElement('a');
      link.href = finalCanvas.toDataURL('image/png');
      link.download = `preview-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading preview:', error);
    }
  }

  private drawTexts(ctx: CanvasRenderingContext2D, size: number, quality: number) {
    const textStyle = {
      font: `bold ${20 * quality}px 'Arial', sans-serif`,
      color: '#101828',
      background: 'rgba(0, 0, 0, 0.6)',
      padding: 10 * quality,
      borderRadius: 5 * quality
    };

    const lineStyle = {
      color: '#565c66',
      width: 4 * quality,
      opacity: 1
    };

    const views = [
      { name: 'Isométrica', x: 0, y: 0 },
      { name: 'Lateral', x: size * quality, y: 0 },
      { name: 'Frontal', x: 0, y: size * quality },
      { name: 'Posterior', x: size * quality, y: size * quality }
    ];

    views.forEach(view => {
      // Medir texto para fondo
      ctx.font = textStyle.font;
      const textMetrics = ctx.measureText(view.name);
      const textWidth = textMetrics.width + (textStyle.padding * 2);
      const textHeight = 30 * quality; // Altura aproximada

      // Posición del rectángulo (esquina inferior izquierda de cada vista)
      const rectX = view.x + (20 * quality);
      const rectY = view.y + (size * quality) - (20 * quality) - textHeight;

      // Fondo semitransparente para mejor legibilidad
      ctx.fillStyle = textStyle.background;

      // ↓↓↓ CENTRAR EL TEXTO DENTRO DEL RECTÁNGULO ↓↓↓
      ctx.textAlign = 'center'; // Centrar horizontalmente
      ctx.textBaseline = 'middle'; // Centrar verticalmente

      // Calcular centro del rectángulo
      const textCenterX = rectX + (textWidth / 2);
      const textCenterY = rectY + (textHeight / 2);

      // Texto centrado
      ctx.fillStyle = textStyle.color;
      ctx.font = textStyle.font;
      ctx.fillText(view.name, textCenterX, textCenterY);

      // Restaurar alineación por si acaso (opcional)
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    });

    ctx.strokeStyle = lineStyle.color;
    ctx.lineWidth = lineStyle.width;
    ctx.globalAlpha = lineStyle.opacity;

    // Línea vertical central
    ctx.beginPath();
    ctx.moveTo(size * quality, 0);
    ctx.lineTo(size * quality, size * quality * 2);
    ctx.stroke();

    // Línea horizontal central
    ctx.beginPath();
    ctx.moveTo(0, size * quality);
    ctx.lineTo(size * quality * 2, size * quality);
    ctx.stroke();

    // Restaurar opacidad
    ctx.globalAlpha = 1;
  }
}
