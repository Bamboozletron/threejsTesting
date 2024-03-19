import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import BaseScene from './SceneSetup/BaseScene'
import Renderer from '../Renderer/Renderer';

export default class TestScene extends BaseScene
{
    orbit: any;

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

        const light = new THREE.AmbientLight( 0x800040 ); // soft white light
        this.add( light );


        this.setupModel();
    }

    setupModel()
    {
        // const tableMat = await this.loadTableMaterial();
        // const glassMat = await this.loadGlassMat();
        // const glassBackFaceMat = await this.loadGlassBackfaceMat();
        
        const phong = new THREE.MeshPhongMaterial({
            color: 0xFF0000,    // red (can also use a CSS color string here)
            flatShading: true,
          });
        
        const thisScene = this;
        const loader = new GLTFLoader();
        loader.load('./resources/models/tableSetup.glb', function (gltf)
        {            
            var model = gltf.scene;

            let meshArray: THREE.Object3D[] = [];

            model.children.forEach((o) => 
            {    
                if ((<THREE.Mesh>o).isMesh)
                {
                    //console.log(o.name);
                    // if (o.name === "desk")
                    // {
                    //     (<THREE.Mesh>o).material = tableMat;
                    //     thisScene.add(o);
                    // }
                    // else
                    // {                        
                    //     (<THREE.Mesh>o).material = glassMat;
                    //     thisScene.add(o);
                    // }
                    meshArray.push(o);
                }
            })

            for(var k in meshArray)
            {
                (<THREE.Mesh>meshArray[k]).material = phong;
                thisScene.add(meshArray[k]);
            }

            // thisScene.add(model);

        }, undefined, function(error)
        {
            console.log("Blegh");
            console.log(error);
        });        
    }


    async loadTableMaterial()
    {
        const vsh = await fetch('./resources/shaders/LabTesting/vertex-table.glsl');
        const fsh = await fetch('./resources/shaders/LabTesting/fragment-table.glsl');
        
        const tableMat = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: await vsh.text(),
            fragmentShader: await fsh.text(),
        });
        
        return tableMat;
    }

    async loadGlassBackfaceMat()
    {
        const customMat = await this.loadGlassMat();
        customMat.side = THREE.BackSide;
        return customMat;
    }

    async loadGlassMat()
    {
        const vsh = await fetch('./resources/shaders/LabTesting/vertex-glass.glsl');
        const fsh = await fetch('./resources/shaders/LabTesting/fragment-glass.glsl');

        const customMaterial = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: await vsh.text(),
            fragmentShader: await fsh.text(),
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusConstantAlphaFactor,
            transparent: true,
            side: THREE.DoubleSide

        });

        return customMaterial;
    }
    
    update(delta: number)
    {
        super.update(delta);
        this.orbit.update();
        
    }
}