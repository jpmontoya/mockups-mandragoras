import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { gsap } from 'gsap';

@Component({
  selector: 'app-model-viewer',
  templateUrl: './model-viewer.component.html',
  styleUrl: './model-viewer.component.css',
  imports: [ButtonModule],
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

  constructor(private window: Window, private router: Router) {
    if (!this.window) {
      this.window = window;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.managmentRoom();
  }

  createScene(): any {
    // Modelo principal
    const scene = new THREE.Scene();
    this.primaryCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.primaryCamera.position.set(180, 150, -200);
    // this.primaryCamera.lookAt(40, 0, 0);

    //Previsualizaciones
    this.previewCameras = [
      new THREE.PerspectiveCamera(50, 1, 0.1, 1000), // Frontal
      new THREE.PerspectiveCamera(50, 1, 0.1, 1000), // Derecha
      new THREE.PerspectiveCamera(50, 1, 0.1, 1000), // Atrás
      new THREE.PerspectiveCamera(50, 1, 0.1, 1000), // Izquierda
    ];
    this.previewCameras[0].position.set(0, 50, 200);   // Frontal
    this.previewCameras[1].position.set(200, 50, 0);   // Derecha
    this.previewCameras[2].position.set(0, 50, -200);  // Atrás
    this.previewCameras[3].position.set(-200, 50, 0);  // Izquierda
    this.previewCameras.forEach((cam: any) => cam.lookAt(0, 50, 0));

    return {
      scene
    }
  }

  createRender(): any {
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
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
      listRenderer.push(new THREE.WebGLRenderer({ canvas, alpha: true }));
      listRenderer[i].setSize(200, 200, false);
    });

    return listRenderer;
  }

  async loadRoomModel(): Promise<any> {
    const loader = new GLTFLoader();
    const room3DModel: any = await new Promise((resolve, reject) => {
      loader.load('models/Mug_11oz.glb',
        function (gltf) {
          resolve(gltf.scene);
        }
      );
    });

    // room3DModel.position.set(80, 0, 0);

    room3DModel.traverse((node: any, index: number) => {
      node.castShadow = true;
      node.receiveShadow = true;
    });

    return room3DModel;
  }

  createAmbientLights(): any {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);

    const directionalAmbientLight = new THREE.DirectionalLight(0xffffff, 2);

    return {
      ambientLight,
      directionalAmbientLight
    }
  }

  async createImagePoster(): Promise<any> {
    let imagePoster: THREE.Mesh | undefined;
    const loaderImageWall = new THREE.TextureLoader();
    await new Promise((resolve, reject) => {
      loaderImageWall.load('models/3d models/textures/poster.jpg',
        function (texture) {
          const material = new THREE.MeshBasicMaterial({ map: texture });
          const geometry = new THREE.PlaneGeometry(10, 14);
          imagePoster = new THREE.Mesh(geometry, material);
          imagePoster.position.set(-15, 45.2, -25.4);
          resolve(true);
        }
      );
    });
    return imagePoster;
  }

  async managmentRoom() {
    const { scene } = this.createScene();
    const renderer = this.createRender();
    const listRenderer = this.createRenderPreviews();

    let room3DModel: any = await this.loadRoomModel();
    scene.add(room3DModel);

    const { ambientLight, directionalAmbientLight } = this.createAmbientLights();

    scene.add(ambientLight);
    this.primaryCamera.add(directionalAmbientLight)
    directionalAmbientLight.position.set(0, 0, 0);
    scene.add(this.primaryCamera)

    // let imagePoster: THREE.Mesh = await this.createImagePoster();

    if (room3DModel) {
      // room3DModel.add(imagePoster);
    }

    const listMesh: any = {
      // imagePoster
    };

    const controls = new OrbitControls(this.primaryCamera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.zoomSpeed = 0.5;
    controls.rotateSpeed = 0.8;

    const box = new THREE.Box3().setFromObject(room3DModel);
    const center = new THREE.Vector3(0, box.min.y, 0);
    room3DModel.position.sub(center);

    const centerHelper = new THREE.AxesHelper(20);
    centerHelper.position.copy(center);
    scene.add(centerHelper);

    const reRender3D = () => {
      requestAnimationFrame(reRender3D);
      renderer.render(scene, this.primaryCamera);
      this.previewCameras.forEach((camera: any, i: number) => {
        listRenderer[i].render(scene, camera);
      });
    }
    reRender3D();
  }
}
