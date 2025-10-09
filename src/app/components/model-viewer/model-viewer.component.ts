import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { NavigationEnd, Router } from '@angular/router';
import { filter, lastValueFrom, Observable } from 'rxjs';
import { gsap } from 'gsap';
import { ColorsModelsService } from '../../services/colors-models/colors-models.service';
import { CommonModule } from '@angular/common';
import { Models3dService } from '../../services/models-3d/models-3d.service';
import { ImagesPrintingService } from '../../services/images-printing/images-printing.service';
import { PreviewService } from '../../services/preview/preview.service';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-model-viewer',
  templateUrl: './model-viewer.component.html',
  styleUrl: './model-viewer.component.css',
  imports: [
    CommonModule,
    ButtonModule
  ],
  providers: [
    { provide: Window, useValue: window }
  ]
})
export class ModelViewerComponent implements AfterViewInit {
  @ViewChild('preview1') preview1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('preview2') preview2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('preview3') preview3!: ElementRef<HTMLCanvasElement>;
  @ViewChild('preview4') preview4!: ElementRef<HTMLCanvasElement>;

  public isPlaying: boolean = false;
  public isDaytime: boolean = true;
  public isChanging: boolean = false;
  private primaryCamera: any;
  private previewCameras: any;

  public colorPickerBody: Observable<String>;
  public colorPickerRing: Observable<String>;
  public colorPickerHandle: Observable<String>;
  public colorPickerInside: Observable<String>;
  public colorPickerBase: Observable<String>;
  public colorPickerIsMagicMug: Observable<Boolean>;
  public temperatureMagicMug: Observable<Number>;

  public selectedModel: Observable<any>;
  public imagePrinting: Observable<String>;
  public lastImagePrinting: any;

  public imageSelected: string = "";
  public modelSelected: any = "";

  public loader: Observable<Boolean>;

  private bodyMaterial = new THREE.MeshStandardMaterial({
    metalness: 0,
    roughness: 0,
  });

  private ringMaterial = new THREE.MeshStandardMaterial({
    metalness: 0,
    roughness: 0,
  });

  private handleMaterial = new THREE.MeshStandardMaterial({
    metalness: 0,
    roughness: 0,
  });

  private insideMaterial = new THREE.MeshStandardMaterial({
    metalness: 0,
    roughness: 0,
  });

  private baseMaterial = new THREE.MeshStandardMaterial({
    metalness: 0,
    roughness: 0,
  });

  private toogleMeshBody: THREE.Mesh | undefined;
  private toogleMeshBase: THREE.Mesh | undefined;

  private isMagicMug: Boolean | undefined;

  private mugShaderMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0,
    roughness: 0,
    transparent: false
  });

  private mugSublimationPrintingMaterial: THREE.MeshStandardMaterial | any;

  constructor(
    private window: Window,
    private router: Router,
    private colorsModelsService: ColorsModelsService,
    private models3dService: Models3dService,
    private imagesPrintingService: ImagesPrintingService,
    private previewService: PreviewService,
    private loaderService: LoaderService
  ) {
    this.colorPickerBody = this.colorsModelsService.getColorBody;
    this.colorPickerRing = this.colorsModelsService.getColorRing;
    this.colorPickerHandle = this.colorsModelsService.getColorHandle;
    this.colorPickerInside = this.colorsModelsService.getColorInside;
    this.colorPickerBase = this.colorsModelsService.getColorBase;
    this.colorPickerIsMagicMug = this.colorsModelsService.getIsMagicMug;
    this.temperatureMagicMug = this.colorsModelsService.getTempMug;

    this.selectedModel = models3dService.getSelectedModel;
    this.imagePrinting = imagesPrintingService.getImage;

    this.loader = this.loaderService.getLoader;

    if (!this.window) {
      this.window = window;
    }
  }

  ngOnInit(): void {
    this.setModelColor();
  }

  ngAfterViewInit(): void {
    this.managmentRoom();
  }

  createScene(): any {
    // Modelo principal
    const scene = new THREE.Scene();
    const container3D = document.getElementById("container-model") as HTMLDivElement;
    this.primaryCamera = new THREE.PerspectiveCamera(20, container3D?.offsetWidth / container3D?.offsetHeight, 0.1, 1000);
    this.primaryCamera.position.set(0, 300, 450);

    //Previsualizaciones
    this.previewCameras = [
      new THREE.PerspectiveCamera(28, 1, 0.1, 1000), // Isometrico
      new THREE.PerspectiveCamera(50, 1, 0.1, 1000), // Lateral
      new THREE.PerspectiveCamera(50, 1, 0.1, 1000), // Frontal
      new THREE.PerspectiveCamera(50, 1, 0.1, 1000), // Posterior
    ];
    this.previewCameras[0].position.set(200, 150, 300);   // Isometrico
    this.previewCameras[1].position.set(200, 50, 0);   // Lateral
    this.previewCameras[2].position.set(40, 0, 200);  // Frontal -50
    this.previewCameras[3].position.set(40, 20, -210);  // Posterior
    this.previewCameras.forEach((cam: any) => cam.lookAt(0, 0, 0));

    this.previewService.setPreviewCameras = this.previewCameras;
    this.previewService.setPrimaryCamera = this.primaryCamera;

    return {
      scene
    }
  }

  createRender(): any {
    const container3D = document.getElementById("container-model") as HTMLDivElement;

    const renderer = new THREE.WebGLRenderer(
      {
        alpha: true,
        preserveDrawingBuffer: true,
        antialias: true,
        powerPreference: "high-performance"
      });
    renderer.setSize(container3D?.offsetWidth, container3D?.offsetHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('container3D')?.appendChild(renderer.domElement);

    return renderer;
  }

  createRenderPreviews(): any {
    let listRenderer: any[] = [];

    const canvases = [
      this.preview1.nativeElement,
      this.preview2.nativeElement,
      this.preview3.nativeElement,
      this.preview4.nativeElement,
    ];

    canvases.forEach((canvas, i) => {
      listRenderer.push(new THREE.WebGLRenderer(
        {
          canvas,
          alpha: true,
          preserveDrawingBuffer: true,
          antialias: true,
          powerPreference: "high-performance"
        }));
      listRenderer[i].setSize(200, 200, false);
    });

    return listRenderer;
  }

  async loadRoomModel(modelRoute: string): Promise<any> {

    const loader = new GLTFLoader();
    const room3DModel: any = await new Promise((resolve, reject) => {
      loader.load(`models/${modelRoute}`,
        function (gltf) {
          resolve(gltf.scene);
        }
      );
    });

    room3DModel.traverse((node: any, index: number) => {
      node.castShadow = true;
      node.receiveShadow = true;

      if (node.isMesh && node.name === "Body") {
        this.toogleMeshBody = node;
        node.material = this.bodyMaterial;
      } else if (node.isMesh && node.name === "Ring") {
        node.material = this.ringMaterial;
      } else if (node.isMesh && node.name === "Handle") {
        node.material = this.handleMaterial;
      } else if (node.isMesh && node.name === "Inside") {
        node.material = this.insideMaterial;
      } else if (node.isMesh && node.name === "Base") {
        this.toogleMeshBase = node;
        node.material = this.baseMaterial;
      }
    });

    let imagePrinting: any = await this.createSublimationPrinting();
    if (imagePrinting) {
      this.lastImagePrinting = imagePrinting;
      room3DModel.add(imagePrinting)
    }

    return room3DModel;
  }

  createAmbientLights(): any {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);

    return {
      ambientLight,
      directionalLight1,
      directionalLight2
    }
  }

  setModelColor() {
    this.colorPickerBody.subscribe((value: any) => {
      this.bodyMaterial.color.set(value);
    });

    this.colorPickerRing.subscribe((value: any) => {
      this.ringMaterial.color.set(value);
    });

    this.colorPickerHandle.subscribe((value: any) => {
      this.handleMaterial.color.set(value);
    });

    this.colorPickerInside.subscribe((value: any) => {
      this.insideMaterial.color.set(value);
    });

    this.colorPickerBase.subscribe((value: any) => {
      this.baseMaterial.color.set(value);
    });

    this.colorPickerIsMagicMug.subscribe((value: any) => {
      this.isMagicMug = value;
      this.setMagicMug();
    });
  }

  createGradientTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#000000'); // Negro arriba
    gradient.addColorStop(1, '#ffffff'); // Blanco abajo

    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  setMagicMug() {
    if (this.isMagicMug) {
      this.colorsModelsService.setColorBase = "#000000";
      this.colorsModelsService.setColorHandle = "#000000";
      this.colorsModelsService.setColorBody = "#ffffff";
      if (this.toogleMeshBody && this.toogleMeshBase) {
        this.toogleMeshBody.material = this.mugShaderMaterial;
        this.toogleMeshBase.material = this.mugShaderMaterial;
      }
      // Animación de negro a blanco
      const targetColor = new THREE.Color(0xffffff);
      const startColor = new THREE.Color(0x000000);

      const este = this;
      this.temperatureMagicMug.subscribe({
        next(value: any) {
          const temp: any = value / 100;
          este.mugShaderMaterial.color.lerpColors(startColor, targetColor, temp);
          este.mugShaderMaterial.needsUpdate = true;
          este.mugSublimationPrintingMaterial.opacity = temp;
        },
      })

    } else {
      if (this.toogleMeshBody && this.toogleMeshBase) {
        this.toogleMeshBody.material = this.bodyMaterial;
        this.toogleMeshBase.material = this.baseMaterial;
      }
      this.colorsModelsService.setColorBase = "#ffffff";
      this.colorsModelsService.setColorHandle = "#ffffff";

      this.mugShaderMaterial.color.set(0x000000);
      this.mugShaderMaterial.needsUpdate = true;
    }

  }

  async reloadModel(room3DModel: any, scene: any) {
    if (room3DModel) {
      scene.remove(room3DModel);
    }

    room3DModel = await this.loadRoomModel(this.modelSelected.modelRoute);

    const box = new THREE.Box3().setFromObject(room3DModel);
    const center = new THREE.Vector3(0, (box.min.y + box.max.y) / 2, 0);
    room3DModel.position.sub(center);

    scene.add(room3DModel);
    this.previewService.setScene = scene;
  }

  async createSublimationPrinting(): Promise<any> {
    const loaderImagePrinting = new THREE.TextureLoader();
    return await new Promise((resolve, reject) => {
      if (this.imageSelected === '') resolve(null);

      loaderImagePrinting.load(this.imageSelected,
        (texture) => {

          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;

          this.mugSublimationPrintingMaterial = new THREE.MeshStandardMaterial(
            {
              map: texture,
              transparent: true,
              side: THREE.DoubleSide,
              opacity: this.isMagicMug ? 0.5 : 1
            });

          const radius = 41.3;
          const height = 98.9;

          const opening = THREE.MathUtils.degToRad(77.4);
          const geometry = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true, THREE.MathUtils.degToRad(129.2), 2 * Math.PI - opening);

          const mesh = new THREE.Mesh(geometry, this.mugSublimationPrintingMaterial);
          mesh.name = "sublimation-printing";
          mesh.rotation.y = Math.PI;
          mesh.position.set(0, (height / 2) + 2.6, 0);
          resolve(mesh);
        }
      );
      this.loaderService.setLoader = false;
    });
  }

  removeSublimationPrinting(room3DModel: any, mesh: any) {
    if (mesh) {
      console.log(mesh);
      room3DModel.remove(mesh);

      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.map?.dispose();
        mesh.material.dispose();
      }
      mesh.geometry.dispose();
      mesh = null;
    }
  }

  async managmentRoom() {
    const { scene } = this.createScene();
    const renderer = this.createRender();
    const listRenderer = this.createRenderPreviews();

    let room3DModel: any;

    const { ambientLight, directionalLight1, directionalLight2 } = this.createAmbientLights();

    scene.add(ambientLight);
    this.primaryCamera.add(directionalLight1)
    this.primaryCamera.add(directionalLight2)
    directionalLight1.position.set(0, 0, 0);
    directionalLight2.position.set(1, 2000, -2000);
    scene.add(this.primaryCamera)

    const controls = new OrbitControls(this.primaryCamera, renderer.domElement);
    controls.rotateSpeed = 0.8;
    controls.enableDamping = false;
    controls.enableZoom = false;
    controls.enablePan = false;


    // const box = new THREE.Box3().setFromObject(room3DModel);
    // const center = new THREE.Vector3(0, (box.min.y + box.max.y) / 2, 0);
    // room3DModel.position.sub(center);

    // const centerHelper = new THREE.AxesHelper(20);
    // centerHelper.position.copy(center);
    // scene.add(centerHelper);


    const reRender3D = () => {
      requestAnimationFrame(reRender3D);
      renderer.render(scene, this.primaryCamera);
      this.previewCameras.forEach((camera: any, i: number) => {
        listRenderer[i].render(scene, camera);
      });
    }
    reRender3D();

    this.imagePrinting.subscribe(async (value: any) => {
      this.imageSelected = value;
      this.reloadModel(room3DModel, scene);
    });

    this.selectedModel.subscribe(async (value: any) => {
      this.modelSelected = value;
      this.reloadModel(room3DModel, scene);
    });
  }
}
