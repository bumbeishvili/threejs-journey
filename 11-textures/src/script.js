import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui'


const loadingManager = new THREE.LoadingManager();


const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load("/textures/minecraft .png")
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const heightTexture = textureLoader.load("/textures/door/height.jpg")
const normalTexture = textureLoader.load("/textures/door/normal.jpg")
const ambientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg")


const texture = colorTexture;
// texture.repeat.x = 2;
// texture.repeat.y = 2;
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;
// texture.offset.x = 0.5
// texture.offset.y = 0.5
// texture.rotation = Math.PI / 180 * 45;
// texture.center.x = 0.5
// texture.center.y = 0.5


//texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;




/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxBufferGeometry(1, 1, 1)

console.log(geometry.attributes)

const material = new THREE.MeshBasicMaterial({ map: texture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)



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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()




// DEBUGGER
const gui = new lil.GUI({ width: 300 });
const obj = {
    rectColor: material.color.getHex(),
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
        })
    }
}

gui.addColor(obj, 'rectColor').onChange(color => {
    material.color.set(obj.rectColor)
})


gui.add(material, 'wireframe').name('material.wireframe')

gui.add(obj, 'logInfo').name('logInfo')

