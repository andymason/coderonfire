/**
 * 3D Gameboy
 * 
 * Author: Andrew Mason
 * URL: https://coderonfire.com/blog/3d-gameboy/
 * 
 */

var ROTATION_SPEED = 0.006;
var VERTICAL_SPEED = 0.04;
var shadowPlane;
var gameboy;
var shadowTexture;
var count = 0;
var scene;

// House keeping
var isEmbedded = /embed/.test( location.search );
if (isEmbedded) {
    document.body.classList.add('embedded');
}

// Disable spinning on embedded touch
var hasTouch = 'ontouchstart' in window;
var disableTouch = (isEmbedded && hasTouch);

// Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xffffff );
renderer.setSize( document.body.offsetWidth, document.body.offsetHeight );
document.body.appendChild( renderer.domElement );

var canvas = renderer.domElement;
document.body.appendChild(canvas);

// Camera
var camera; 
camera = new THREE.PerspectiveCamera( 75, document.body.offsetWidth / document.body.offsetHeight, 0.1, 1000 );
camera.position.z = 5.2;

// Orbit controls
if (!disableTouch) {
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.02;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.rotateSpeed = 0.04;
}

// Create shadow texture
shadowTexture = new THREE.TextureLoader().load('images/shadow_tex.jpg');

// Scene load (model + text) JSON loader
var loader = new THREE.ObjectLoader();
loader.load('data/gameboy_data.json',onSceneLoad );

/**
 * Setup scene with loaded JSON data
 * @param {object} loadedScene - THREE scene object
 */
function onSceneLoad(loadedScene) {
    gameboy = loadedScene.getObjectByName('gameboy');
    
    // Sharp textures on acute angles
    var maxAnisotropy = renderer.getMaxAnisotropy()
    if (maxAnisotropy > 8) {
        gameboy.material.map.anisotropy = maxAnisotropy / 2;
        gameboy.material.map.needsUpdate = true;  
    } 
    
    // Assign scene
    scene = loadedScene;
    
    // Need to wait for replaced scene before adding shadow
    addShadow(); 
    
    window.addEventListener('resize', onWindowResize, false);
    
    // Kick off the animation
    render();
    
    // Force resize
    onWindowResize();
}

/**
 * Add a shadow plane to the scene
 * NB: Could have done this in the scene JSON but faster to fiddle in dev tools.
 */
function addShadow() {
    var geometry = new THREE.PlaneGeometry( 3.5, 3.5, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0xcccccc, alphaMap: shadowTexture, transparent: true } );
    shadowPlane = new THREE.Mesh( geometry, material );
    shadowPlane.rotation.x = Math.PI/2 * -1;
    shadowPlane.position.y = -2.8;
    scene.add( shadowPlane );
}


/**
 * Resize the canvas and update camera
 */
function onWindowResize() {
    camera.aspect = document.body.offsetWidth / document.body.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( document.body.offsetWidth, document.body.offsetHeight );
}


// Spin on touch
var TOP_SPEED = 0.2;
var currentSpeed = ROTATION_SPEED;
function spin() {
    currentSpeed = TOP_SPEED;
}

// renderer.domElement.addEventListener('click', spin, false);


/**
 * Render the scene
 */
function render() {
    // Tap spin
    if (currentSpeed > ROTATION_SPEED) {
        currentSpeed -= 0.003;
    }
    
    // Orbit controls has damping so needs updating
    if (controls) {
        controls.update();
    } 
    
    // Spin me right round baby
    gameboy.rotation.y += currentSpeed;
    shadowPlane.material.opacity = 1 - ( Math.sin( count ) / 2);
    shadowPlane.rotation.z += currentSpeed;
    
    // Bounce
    count += VERTICAL_SPEED;
    gameboy.position.y = Math.sin( count ) / 5;
    
    // Blast it to the screen
    renderer.render( scene, camera );
    
    // Play it again Sam
	requestAnimationFrame( render );
}
