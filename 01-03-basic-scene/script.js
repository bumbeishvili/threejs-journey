const scene = new THREE.Scene();


// cube
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color:0xff0000});
const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)

// camera
const w = 800;
const h = 600;
const camera = new THREE.PerspectiveCamera(75,w/h);
camera.position.z = 3;
camera.position.x=1
camera.position.y=1
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    antialias: true,
})

renderer.setSize(w,h);
renderer.render(scene,camera);


console.log({
    scene,
    mesh,
    material,
    geometry,
    camera,
    renderer
})