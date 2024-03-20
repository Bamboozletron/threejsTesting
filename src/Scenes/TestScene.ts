import * as THREE from 'three'
import * as ThreeHelpers from '../Util/ThreeHelpers';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import BaseScene from './SceneSetup/BaseScene'
import Renderer from '../Renderer/Renderer';

export default class TestScene extends BaseScene
{
    // Controls + time  (Could feasibly be put in BaseScene probably, but not 100% sure if they should yet)
    orbit: OrbitControls | null = null;
    timeElapsed: number = 0;

    // Objects for the scene (Will be pulled from the gltf model)
    desk: THREE.Object3D | undefined;
    beaker: THREE.Object3D | undefined;
    beakerLiquid: THREE.Object3D | undefined;
    flask: THREE.Object3D | undefined;
    flaskLiquid: THREE.Object3D | undefined;

    // Materials
    tableMat!: THREE.ShaderMaterial;

    beakerLiquidMat!: THREE.ShaderMaterial;
    beakerGlassMat!: THREE.ShaderMaterial;

    flaskLiquidMat!: THREE.ShaderMaterial;
    flaskGlassMat!: THREE.ShaderMaterial;

    // Lights
    ambientLight!: THREE.AmbientLight;
    directionalLight!: THREE.DirectionalLight;

    // Liquid levels (Conveniently the same for models I have setup)
    flaskLiquidLevels: meshMinMaxY;

    wasGlassSelected: boolean = false;

    constructor()
    {
        super();
        this.flaskLiquidLevels = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY};        
    }

    async initialize(renderer: Renderer)
    {
        super.initialize(renderer);        

        // Create basic scene.  Skybox + Orbit controls
        this.mainCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100.0);
        this.mainCamera.position.set(0,1.6,2.2);        

        this.orbit = new OrbitControls(this.mainCamera, renderer.domElement);
        this.orbit.target.set(0.0, 1.0, 0);
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

        // Ambient light
        this.ambientLight = new THREE.AmbientLight( 0x404040 );
        this.add(this.ambientLight);

        // Set it up to start as direction camera faces
        this.directionalLight = new THREE.DirectionalLight(0x808080);
        this.directionalLight.position.set(-3.0, 4.0, 4.0);        
        
        // Wait for model to be loaded before continuing
        await ThreeHelpers.LoadAndSplitGLTF('./resources/models/tableSetup.glb').then(result => {
            this.setupModel(result);
        }).catch (err => {
            console.log(err);
        });
    }

    async setupModel(meshArray: Array<THREE.Object3D>)
    {
        this.assignObjects(meshArray);

        // Luckly it's the same in the model, otherwise would have to switch uniforms per liquid
        this.flaskLiquidLevels = this.findMinMaxLiquids(<THREE.Mesh>this.flaskLiquid);        

        this.tableMat = await this.loadTableMaterial();

        this.beakerGlassMat = await this.loadGlassMat();
        this.beakerLiquidMat = await this.loadLiquidMat();

        this.flaskGlassMat = await this.loadGlassMat();
        this.flaskLiquidMat = await this.loadLiquidMat();

        (<THREE.Mesh>this.desk).material = this.tableMat;
        
        (<THREE.Mesh>this.beaker).material = this.beakerGlassMat;
        (<THREE.Mesh>this.flask).material = this.flaskGlassMat;

        (<THREE.Mesh>this.beakerLiquid).material = this.beakerLiquidMat;
        (<THREE.Mesh>this.flaskLiquid).material = this.flaskLiquidMat;        

        for(var k in meshArray)
        {
            this.add(meshArray[k]);
        }
    }

    assignObjects(meshArray: Array<THREE.Object3D>)
    {
        for(var k in meshArray)
        {
            switch (meshArray[k].name)
            {                
                case "desk":
                    this.desk = meshArray[k];
                    break;
                case "beaker":
                    this.beaker = meshArray[k];
                    break;
                case "beaker_liquid":
                    this.beakerLiquid = meshArray[k];
                    break;
                case "flash":
                    this.flask = meshArray[k];
                    break;
                case "flask_liquid":
                    this.flaskLiquid = meshArray[k];   
                    break;
            }
        }
    }

    async loadTableMaterial()
    {
        const vsh = await fetch('./resources/shaders/LabTesting/vertex-table.glsl');
        const fsh = await fetch('./resources/shaders/LabTesting/fragment-table.glsl');
        
        const tableMat = new THREE.ShaderMaterial({
            uniforms:
            {
                uBaseColor: { value: new THREE.Vector3(0.3, 0.1, 0.0)},
                uAmbient: { value: this.ambientLight.color},
                uDiffuseDir: { value: this.directionalLight.position.sub(this.directionalLight.target.position)},
                uDiffuseColor: {value: this.directionalLight.color},
            },
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
            uniforms:
            {
                uSelected: {value : false},
                uBaseColor: { value: new THREE.Vector3(0.3, 0.3, 0.3)},
                uAmbient: { value: this.ambientLight.color},
                uDiffuseDir: { value: this.directionalLight.position.sub(this.directionalLight.target.position)},
                uDiffuseColor: {value: this.directionalLight.color},
            },
            vertexShader: await vsh.text(),
            fragmentShader: await fsh.text(),
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusConstantAlphaFactor,
            transparent: true,
            side: THREE.FrontSide

        });

        return customMaterial;
    }

    async loadLiquidMat()
    {
        const vsh = await fetch('./resources/shaders/LabTesting/vertex-liquid.glsl');
        const fsh = await fetch('./resources/shaders/LabTesting/fragment-liquid.glsl');

        const customMaterial = new THREE.ShaderMaterial({
            uniforms:
            {
                uTime: {value: this.timeElapsed},
                uBaseColor: { value: new THREE.Vector3(0.7, 0.0, 1.0)},
                uAmbient: { value: this.ambientLight.color},
                uLevels: {value: new THREE.Vector2(this.flaskLiquidLevels.min, -this.flaskLiquidLevels.max)}
            },
            vertexShader: await vsh.text(),
            fragmentShader: await fsh.text(),
            side: THREE.DoubleSide,
        });

        return customMaterial;
    }

    findMinMaxLiquids(mesh: THREE.Mesh): meshMinMaxY
    {
        let minMax = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY};

        var vertices = (<THREE.Mesh>this.flaskLiquid).geometry.attributes.position.array;
        for(let i = 0; i < vertices.length; i+=3)        
        {
            let y = vertices[i+2];

            if (y < minMax.min)
            {
                minMax.min = y;
            }
            else if (y > minMax.max)
            {
                minMax.max = y;
            }
        }

        console.log(minMax);
        return minMax;
    }

    handleMouseIntersection(event: MouseEvent)
    {
        this.pointer.x = (event.clientX/window.innerWidth) * 2 - 1;
        this.pointer.y = -((event.clientY/window.innerHeight) * 2 - 1);

        this.raycaster.setFromCamera(this.pointer, this.mainCamera);
        const intersect = this.raycaster.intersectObjects(this.children);

        // Could definitely put this out into their own entities handling of mouseInteraction, kind of messy like this
        if (intersect.length > 0)
        {  
            if (intersect[0].object == this.flask || intersect[0].object == this.beaker)
            {
                if (!this.wasGlassSelected)
                {                    
                    this.wasGlassSelected = true;

                    if (intersect[0].object == this.flask)
                    {
                        this.flaskGlassMat.uniforms.uSelected.value = true;
                    }
                    else
                    {
                        this.beakerGlassMat.uniforms.uSelected.value = true;                    
                    }
                }
            }
            else
            {
                if (this.wasGlassSelected)
                {
                    this.wasGlassSelected = false;
                    this.flaskGlassMat.uniforms.uSelected.value = false;
                    this.beakerGlassMat.uniforms.uSelected.value = false;
                }
            }
        }
        else
        {
            if (this.wasGlassSelected)
            {
                this.wasGlassSelected = false;
                this.flaskGlassMat.uniforms.uSelected.value = false;
                this.beakerGlassMat.uniforms.uSelected.value = false;
            }
        }
    }
    
    update(delta: number)
    {
        super.update(delta);
        this.orbit?.update();
        this.timeElapsed += delta;        

        // Only need to check one really, but the whole load flow is a bit broken
        if (this.beakerLiquidMat && this.flaskLiquidMat)
        {
            this.beakerLiquidMat.uniforms.uTime.value = this.timeElapsed + 2.0;
            this.flaskLiquidMat.uniforms.uTime.value = this.timeElapsed;
        }

    }

    onMouseMove(event: MouseEvent)
    {
        super.onMouseMove(event);
        this.handleMouseIntersection(event);
    }


}

interface meshMinMaxY
{
    min: number;
    max: number;
}