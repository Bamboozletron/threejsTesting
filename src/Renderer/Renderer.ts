import * as THREE from 'three'
import BaseScene from '../Scenes/SceneSetup/BaseScene'

// Questionable and small wrapper of THREE.WebGLRenderer.
// Was thinking of a possible situation where you want multiple renderers in an app on multiple canvas elements
export default class Renderer extends THREE.WebGLRenderer
{
    activeScene: BaseScene;

    constructor()
    {
        super();
        this.activeScene = new BaseScene();
    }

    initialize()
    {        
        window.addEventListener('resize', () =>
        {
            this.onWindowResize();
        }, false);

        this.onWindowResize();
    }

    renderScene()
    {
        this.render(this.activeScene as THREE.Object3D, this.activeScene.mainCamera as THREE.Camera);        
    }

    onWindowResize()
    {
        this.setSize(window.innerWidth, window.innerHeight);    

        if (this.activeScene.mainCamera instanceof THREE.PerspectiveCamera)
        {
            let perspectiveCamera: THREE.PerspectiveCamera = this.activeScene.mainCamera;
            perspectiveCamera.aspect = window.innerWidth / window.innerHeight;        
            perspectiveCamera.updateProjectionMatrix();
        }
    }
}