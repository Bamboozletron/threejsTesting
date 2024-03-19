import * as THREE from 'three'

export async function createCustomMaterial(vshPath: string, fshPath: string):  Promise<THREE.ShaderMaterial>
{
    const vsh = await fetch(vshPath);
    const fsh = await fetch(fshPath);

    const customMaterial = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: await vsh.text(),
        fragmentShader: await fsh.text(),
    });

    return customMaterial;
}

    


