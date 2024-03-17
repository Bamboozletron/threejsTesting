import * as THREE from 'three'
import Renderer from './Renderer/Renderer';
import TestScene from './Scenes/TestScene';

// One large "full screen" renderer for this testing
class ThreeJSTesting
{
    renderer: Renderer;
    baseScene: TestScene;

    previousT: number = 0;

    constructor()
    {
      this.baseScene = new TestScene();
      this.renderer = new Renderer();
    }

    initialize()
    {
        // Create single renderer set as full screen
        this.renderer = new Renderer();        
        this.renderer.initialize();

        //  this.testRenderer = new THREE.WebGLRenderer();        
        document.body.appendChild(this.renderer.domElement);            

        this.baseScene.initialize();
        this.renderer.activeScene = this.baseScene;    

        // Start game loop        
        this.raf_();


    }

      raf_() {
        requestAnimationFrame((t) => {    

          let delta: number = t - this.previousT;
          this.previousT = t;

          this.baseScene.update(delta);
          this.renderer.renderScene();
          this.raf_();          
        });
      }
}

let TestApp = new ThreeJSTesting();
TestApp.initialize();
