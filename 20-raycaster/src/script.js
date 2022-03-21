import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2
object1.userData = "Object 1"

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object2.userData = "Object 2"

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2
object3.userData = "Object 3"

scene.add(object1, object2, object3)


/* 
*   Reycaster
*/

const rayCaster = new THREE.Raycaster()



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
camera.position.z = 5
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

const rayOrigin = new THREE.Vector3(-3, 0, 0)
const rayTarget = new THREE.Vector3(10, 0, 0)
rayTarget.normalize()

const arrowHelper = new THREE.ArrowHelper(rayTarget, rayOrigin, 7, 0xffff00);
scene.add(arrowHelper)

const mouse = new THREE.Vector2();

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX / sizes.width * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;
})

let currentIntersect = null;
window.addEventListener('click', e => {
    if (currentIntersect) {
        console.log('click', currentIntersect.userData)
    }
});




const tick = () => {

    rayCaster.setFromCamera(mouse, camera)


    const intersects = rayCaster.intersectObjects([object1, object2, object3])
    if (intersects.length) {
        if (currentIntersect == null) {
            console.log('mouse enter', intersects[0].object)
            currentIntersect = intersects[0].object
            currentIntersect.material.color.set(0xffFF00)
        }

    } else {
        if (currentIntersect != null) {
            console.log('mouse leave', currentIntersect)
            currentIntersect.material.color.set(0xff0000)
            currentIntersect = null

        }
    }


    const elapsedTime = clock.getElapsedTime()



    object1.position.y = Math.sin(elapsedTime * 1.3);
    object2.position.y = Math.sin(elapsedTime * 1.5);
    object3.position.y = Math.sin(elapsedTime * 1.7);



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()