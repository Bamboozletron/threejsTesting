import * as THREE from 'three'
import Renderer from '../../Renderer/Renderer';

// Simple wrapping of THREE.Scene, not 100% sure what should live here yet
export default class BaseScene extends THREE.Scene
{
    mainCamera: THREE.Camera;
    
    constructor()
    {
        super();
        this.mainCamera = new THREE.PerspectiveCamera(70, 1920.0 / 1080.0, 0.1, 100); // Default camera, mostly to ensure it has one?
    }

    async initialize(renderer: Renderer)
    {
    }
    
    // Probably something someday
    update(delta: number)
    {        
    }
}