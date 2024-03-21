import * as THREE from 'three'
import Renderer from './Renderer/Renderer';
import TestScene from './Scenes/TestScene';
import GeometryTesting from './Scenes/GeometryTesting';
import BaseScene from './Scenes/SceneSetup/BaseScene';

// One large "full screen" renderer for this testing.
class ThreeJSTesting
{
    renderer: Renderer;
    baseScene: BaseScene;

    previousT: number = 0;

    constructor()
    {
      this.baseScene = new TestScene();
      this.renderer = new Renderer();
    }

    async initialize()
    {
        // Create single renderer set as full screen
        this.renderer = new Renderer();        
        this.renderer.initialize();
   
        document.body.appendChild(this.renderer.domElement);            

        await this.baseScene.initialize(this.renderer);
        this.renderer.activeScene = this.baseScene;    
        this.renderer.setClearColor(0x999999, 1.0);

        // Start game loop        
        this.raf_();

    }

      raf_() {
        requestAnimationFrame((t) => {    

          let delta: number = t - this.previousT;
          this.previousT = t;

          this.baseScene.update(delta/1000);
          this.renderer.renderScene();
          this.raf_();          
        });
      }
}

let TestApp = new ThreeJSTesting();
TestApp.initialize();
