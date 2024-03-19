import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import BaseScene from './SceneSetup/BaseScene'
import Renderer from '../Renderer/Renderer';

import * as ThreeHelpers from '../Util/ThreeHelpers';

export default class DiscardTesting extends BaseScene
{
    mainCamera: any;
    orbit: any;
    cube: any;

    timeElapsed: number = 0;
    customMat: any;

    constructor()
    {
        super();
    }
    
    async initialize(renderer: Renderer)
    {
        super.initialize(renderer);

        // Create basic scene
        this.mainCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100.0);
        this.mainCamera.position.set(0,1,5);

        this.orbit = new OrbitControls(this.mainCamera, renderer.domElement);
        this.orbit.update();

        const skyboxLoader = new THREE.CubeTextureLoader();
        const texture = skyboxLoader.load([
            './resources/skybox/Cold_Sunset__Cam_2_Left+X.png',
            './resources/skybox/Cold_Sunset__Cam_3_Right-X.png',
            './resources/skybox/Cold_Sunset__Cam_4_Up+Y.png',
            './resources/skybox/Cold_Sunset__Cam_5_Down-Y.png',
            './resources/skybox/Cold_Sunset__Cam_0_Front+Z.png',
            './resources/skybox/Cold_Sunset__Cam_1_Back-Z.png',
        ]);
        this.background = texture;

        await this.setupCube();
    }

    async setupCube()
    {
        this.customMat = await ThreeHelpers.createCustomMaterial('./resources/shaders/vertex-discard-test.glsl', './resources/shaders/fragment-discard-test.glsl');
        this.customMat.uniforms = 
        {
            time: {value: 0.0},
        };

        this.cube = new THREE.BoxGeometry();
        const mesh = new THREE.Mesh(this.cube, this.customMat);

        this.add(mesh); 
    }

    update(delta: number)
    {

        this.timeElapsed += delta;        
        this.customMat.uniforms.time.value = this.timeElapsed;


        this.cube.rotateY(0.2*delta);
        this.cube.rotateX(0.2*delta);
        this.cube.rotateZ(0.2*delta);
    }
}