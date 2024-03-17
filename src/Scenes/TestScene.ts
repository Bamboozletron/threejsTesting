import * as THREE from 'three'
import BaseScene from './SceneSetup/BaseScene'

export default class TestScene extends BaseScene
{

    mainCamera: any;

    constructor()
    {
        super();
    }

    initialize()
    {

        console.log("Blegh");

        // Create basic scene
        this.mainCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100.0);
        this.mainCamera.position.set(0,1,5);

        // Test Cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
        const mesh = new THREE.Mesh(geometry, material);        

        this.add(mesh);

        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0.0, 3.0, 5.0);
        this.add(directionalLight);

    }

    update(delta: number)
    {
        super.update(delta);
    }
}