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
  public selectedModel: Observable<any>;
  public imagePrinting: Observable<String>;

  public imageSelected: string = "";
  public modelSelected: any = "";

  private bodyMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    metalness: 0,
    roughness: 0,
  });

  constructor(
    private window: Window,
    private router: Router,
    private colorsModelsService: ColorsModelsService,
    private models3dService: Models3dService,
    private imagesPrintingService: ImagesPrintingService
  ) {
    this.colorPickerBody = this.colorsModelsService.getColorBody;
    this.selectedModel = models3dService.getSelectedModel;
    this.imagePrinting = imagesPrintingService.getImage;

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
    this.previewCameras[2].position.set(-50, 0, 200);  // Frontal
    this.previewCameras[3].position.set(-50, 20, -210);  // Posterior
    this.previewCameras.forEach((cam: any) => cam.lookAt(0, 0, 0));

    return {
      scene
    }
  }

  createRender(): any {
    const container3D = document.getElementById("container-model") as HTMLDivElement;

    const renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true });
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
      listRenderer.push(new THREE.WebGLRenderer({ canvas, alpha: true, preserveDrawingBuffer: true }));
      listRenderer[i].setSize(200, 200, false);
    });

    return listRenderer;
  }

  async loadRoomModel(modelRoute: string): Promise<any> {

    let imagePrinting: any = await this.createSublimationPrinting();

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
        node.material = this.bodyMaterial;
      }
    });

    room3DModel.add(imagePrinting)

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
    })
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
  }

  async createSublimationPrinting(): Promise<any> {
    const loaderImagePrinting = new THREE.TextureLoader();
    return await new Promise((resolve, reject) => {
      loaderImagePrinting.load(this.imageSelected,
        function (texture) {

          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;

          const material = new THREE.MeshStandardMaterial(
            {
              map: texture,
              metalness: 0.1,
              roughness: 0.5,
              transparent: true,
              side: THREE.DoubleSide
            });

          const radius = 41.3;
          const height = 98.9;

          const opening = THREE.MathUtils.degToRad(77.4);
          const geometry = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true, THREE.MathUtils.degToRad(129.2), 2 * Math.PI - opening);

          const mesh = new THREE.Mesh(geometry, material);

          mesh.rotation.y = Math.PI;

          mesh.position.set(0, (height / 2) + 2.5, 0);
          resolve(mesh);
        }
      );
    });
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
    })

    this.selectedModel.subscribe(async (value: any) => {
      this.modelSelected = value;
      this.reloadModel(room3DModel, scene);
    });
  }
}
