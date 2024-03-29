import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { ImprovedNoise } from 'three/examples/jsm/Math/ImprovedNoise';

import BaseScene from './SceneSetup/BaseScene'
import Renderer from '../Renderer/Renderer';

export default class GeometryTesting extends BaseScene
{
    mainCamera: any;
    orbit: any;
    cube: any;

    timeElapsed: number = 0;
    customMat: any;

    resolution: number = 0;

    noise: any;
    noiseSeed: number = 0;

    geometry: any;

    constructor()
    {
        super();
    }
    
    async initialize(renderer: Renderer)
    {
        super.initialize(renderer);

        // Create basic scene
        this.mainCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100.0);
        this.mainCamera.position.set(0,5,5);

        this.orbit = new OrbitControls(this.mainCamera, renderer.domElement);
        this.orbit.update();

        this.resolution = 20;

        this.noise = new ImprovedNoise();
        this.noiseSeed = Math.random() * 100;


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

        this.setupGeometry();
    }

    setupGeometry()
    {   
        this.geometry = new THREE.PlaneGeometry(100, 100, this.resolution, this.resolution);
        const mat = new THREE.MeshPhongMaterial({
            color: 0xeeeeee, wireframe: true
        });        
        
        this.geometry.rotateX(-Math.PI/2.0);

        const position = this.geometry.attributes.position;        
        position.usage = THREE.DynamicDrawUsage;

        for ( let i = 0; i < position.count; i ++ ) {

            position.setY(i, 2.5);
        }

        const mesh = new THREE.Mesh(this.geometry, mat);        

        this.add(mesh); 
    }

    update(delta: number)
    {

        this.timeElapsed += delta;        

        const position = this.geometry.attributes.position;        
        for ( let i = 0; i < position.count; i ++ ) {

            const y = 5 * Math.sin(this.timeElapsed + i*5.0);
            position.setY( i, y );
        }
        position.needsUpdate = true;

    }
}