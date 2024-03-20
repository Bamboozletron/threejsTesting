import * as THREE from 'three'
import Renderer from '../../Renderer/Renderer';

// Simple wrapping of THREE.Scene, not 100% sure what should live here yet
export default class BaseScene extends THREE.Scene
{
    mainCamera: THREE.Camera;

    // Mouse movement / raycaster       
    pointer: THREE.Vector2;
    raycaster: THREE.Raycaster;
    
    constructor()
    {
        super();
        this.mainCamera = new THREE.PerspectiveCamera(70, 1920.0 / 1080.0, 0.1, 100); // Default camera, mostly to ensure it has one?
        this.pointer = new THREE.Vector2(0.0, 0.0);
        this.raycaster = new THREE.Raycaster();
    }

    async initialize(renderer: Renderer)
    {
        
        window.addEventListener('mousemove', (event) =>
        {
            this.onMouseMove(event);
        }, false);   
    }
    
    // Probably something someday
    update(delta: number)
    {        
    }

    onMouseMove(event: MouseEvent)
    {
    }
}