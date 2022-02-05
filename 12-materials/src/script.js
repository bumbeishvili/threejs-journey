import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui'
import { GeometryUtils } from 'three'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()


// let doorColor = textureLoader.load('/textures/door/color.jpg')
// let alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
// let ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
// let heightTexture = textureLoader.load('/textures/door/height.jpg')
// let metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
// let normalTexture = textureLoader.load('/textures/door/normal.jpg')
// let roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
// let gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
// let matcapTexture = textureLoader.load('/textures/matcaps/8.png')

// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false;

const envMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/gudauri/px.png',
    '/textures/environmentMaps/gudauri/nx.png',
    '/textures/environmentMaps/gudauri/py.png',
    '/textures/environmentMaps/gudauri/ny.png',
    '/textures/environmentMaps/gudauri/pz.png',
    '/textures/environmentMaps/gudauri/nz.png'
])



let material = new THREE.MeshStandardMaterial({
    color: 'white',
    // map: doorColor
});

material.metalness = 0.7
material.roughness = 0.2
material.side = THREE.DoubleSide
material.envMap = envMapTexture

// material.gradientMap = gradientTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1
// material.displacementMap = heightTexture;= 
// material.displacementScale = 0.16;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture

//material.normalScale.set(10,10)

material.transparent = true;
// material.alphaMap = alphaTexture

// material.alphaMap = alphaTexture;
//material.flatShading = true;

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 160, 160),
    material
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 50,50),
    material
)


const donut = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.5, 0.1, 160, 160),
    material
)
donut.position.x = 1.5



sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
donut.geometry.setAttribute('uv2', new THREE.BufferAttribute(donut.geometry.attributes.uv.array, 2))

scene.add(sphere, plane, donut)





/* LIGHTS

*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    material.needsUpdate = true;
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.y = elapsedTime * 0.1;
    plane.rotation.y = elapsedTime * 0.01;
    donut.rotation.y = elapsedTime * 0.1;

    sphere.rotation.x = elapsedTime * 0.2;
    //plane.rotation.x = elapsedTime * 0.2;

    // Update controls
    controls.update()



    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()




// --------------  GUI -----------------

const axisHelper = new THREE.AxesHelper(3)
scene.add(axisHelper)
// axisHelper.visible = false;

window.THREE = THREE;
// DEBUGGER
const gui = new lil.GUI({ width: 400 });
const obj = {
    color: material.color.getHex(),
    // specular: material.specular.getHex(),
    spin: () => {
        gsap.to(mesh.rotation, {
            y: mesh.rotation.y + Math.PI * 1.5,
            x: mesh.rotation.x + Math.PI * 1.5,
            duration: 4
        })
        console.log('spinning')
    },
    logInfo: () => {
        console.log({
            ...renderer.info.memory,
            ...renderer.info.render,
            scene,
            Objects: scene.children,
        })
    }
}

gui.addColor(obj, 'color').onChange(_ => {
    material.color.set(obj.color)
}).name('material.color')

// gui.addColor(obj, 'specular').onChange(_ => {
//     material.specular.set(obj.specular)
// }).name('material.specular')

gui.add(material, 'side', { FrontSide: 0, BackSide: 1, DoubleSide: 2 }).name('material.side')


// gui.add(material, 'flatShading').name('material.flatShading')
// gui.add(material, 'shininess').name('material.shininess').min(0).max(100)
gui.add(material, 'transparent').name('material.transparent')
gui.add(material, 'opacity').name('material.opacity').min(0).max(1).step(0.01)
gui.add(material, 'wireframe').name('material.wireframe')
gui.add(material, 'roughness').name('material.roughness').min(0).max(1).step(0.01)
gui.add(material, 'metalness').name('material.metalness').min(0).max(1).step(0.01)
gui.add(material, 'aoMapIntensity').name('material.aoMapIntensity').min(0).max(2).step(0.01)
gui.add(material, 'displacementScale').name('material.displacementScale').min(0).max(1).step(0.01)



gui.add(axisHelper, 'visible').name('axisHelper.visible')
gui.add(obj, 'logInfo').name('logInfo')


