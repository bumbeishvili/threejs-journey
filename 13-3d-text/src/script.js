import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as lil from 'lil-gui'






/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const material = new THREE.MeshMatcapMaterial({ color: 0xffffff })
// material.wireframe = true;
const matcapTexture = new THREE.TextureLoader().load('/textures/matcaps/4.png')

const fontLoader = new FontLoader();
fontLoader.load('./fonts/Roboto_Regular.json', (font) => {
    console.log('font loaded', font);

    const textGeometry = new TextGeometry('David B. ', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 2,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 2
    })

    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //     -textGeometry.boundingBox.max.x*0.5,
    //     -textGeometry.boundingBox.max.y*0.5,
    //     -textGeometry.boundingBox.max.z*0.5
    // )

    textGeometry.center();
    material.matcap = matcapTexture;
    console.log(textGeometry.boundingBox);

    const textMesh = new THREE.Mesh(textGeometry, material)

    // textGeometry.center()
    scene.add(textMesh)

    const donutGeometry = new THREE.TorusBufferGeometry(0.2, 0.1, 16, 100);

    console.time('donuts');
    for (let i = 0; i < 300; i++) {
       
        const donutMesh = new THREE.Mesh(donutGeometry, material)
        donutMesh.position.x = (Math.random() - 0.5) * 15;
        donutMesh.position.y = (Math.random() - 0.5) * 15;
        donutMesh.position.z = (Math.random() - 0.5) * 15;

        donutMesh.rotateX(Math.random() * Math.PI * 2)
        donutMesh.rotateY(Math.random() * Math.PI * 2)
        const scaleVal = Math.random() * 1 + 0.5;
        donutMesh.scale.set(scaleVal, scaleVal, scaleVal)
        scene.add(donutMesh)
    }
    console.timeEnd('donuts');

})



/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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
camera.position.z = 2
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
renderer.setClearColor(0x160017, 1)




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
// gui.add(material, 'wireframe').name('material.wireframe')
// gui.add(material, 'roughness').name('material.roughness').min(0).max(1).step(0.01)
// gui.add(material, 'metalness').name('material.metalness').min(0).max(1).step(0.01)
// gui.add(material, 'aoMapIntensity').name('material.aoMapIntensity').min(0).max(2).step(0.01)
// gui.add(material, 'displacementScale').name('material.displacementScale').min(0).max(1).step(0.01)



gui.add(axisHelper, 'visible').name('axisHelper.visible')
gui.add(obj, 'logInfo').name('logInfo')

