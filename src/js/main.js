const webglSupported = (function () {
    try {
        var canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
})();

if (webglSupported === false) {
    document.body.classList.add('no-webgl');
} else {
    init();
}


function init() {

    // let width = document.body.clientWidth;
    let width = window.innerWidth;
    let height = window.innerHeight / 1.1;
    let aspect = width / height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

    const arng = new alea('roll a d20');

    const rot = {
        x: -0.9905349900817669,
        y: -0.22071274060020635,
        z: -0.46843882504849643
    };

    camera.position.set(0.05715397799372868, 1.7230311711040942, 1.9726643358220556);
    camera.rotation.x = rot.x;
    camera.rotation.y = rot.y;
    camera.rotation.z = rot.z;

    const backgroundColour = 0x00001b;


    const renderer = new THREE.WebGLRenderer({});
    renderer.toneMappingExposure = 3.0;
    renderer.setSize(window.innerWidth, height);
    renderer.domElement.setAttribute('class', 'renderCanvas');
    renderer.setClearColor(backgroundColour, 1);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00dd89,
    });


    const group = new THREE.Group();
    const rows = 9;
    const cols = 10;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cube = new THREE.Mesh(geometry, material);
            cube.position.y = i / 2;
            cube.position.x = j / 2 * -1;
            cube.scale.setScalar(0.6);
            cube.rotation.set(
                (arng() * (Math.PI * 2)) / 10,
                (arng() * (Math.PI * 2)) / 10,
                (arng() * (Math.PI * 2)) / 10
            );
            cube.rotationSpeed = {
                x: arng() * (Math.PI / 10),
                y: arng() * (Math.PI / 10),
                z: arng() * (Math.PI / 10),
            };
            group.add(cube);
        }
    }

    // Remove out of view boxes based on eye-balling fog
    group.children.splice(0, 40);

    scene.add(group);
    group.position.x = 2.5;
    group.position.y = -2.5;


    // const fog = new THREE.Fog(backgroundColour, 0, 10);
    const fog = new THREE.FogExp2(backgroundColour, 1.0);
    scene.fog = fog;


    function setBlockHeight() {
        group.position.z = (2.18 - aspect) / 5;
    }
    
    setBlockHeight();

    const clock = new THREE.Clock();

    // No need for Tween.js. Just use easing function
    // https://github.com/AndrewRayCode/easing-utils
    function easeOutCirc(t) {
        const t1 = t - 1;
        return Math.sqrt(1 - t1 * t1);
    }

    // Fog animation values
    scene.fog.density = 3;
    const tweenSpeed = 0.01;
    let startDen = 3;
    let endDen = 1;
    let tweenVal = 0;

    function animate() {
        // Animate fog fade in
        if (tweenVal < 1) {
            tweenVal += tweenSpeed;
            tweenVal = (tweenVal > 1) ? 1 : tweenVal;
            fog.density = startDen - (startDen - endDen) * easeOutCirc(tweenVal);
        }
        
    
        if (isInView()) {
            let time = clock.getElapsedTime();
    
            group.children.forEach((cube, i) => {
                let amplitude = time + i / 10;
                cube.position.z = Math.sin(amplitude) / 4;
            });
        
            // controls.update();
            renderer.render(scene, camera);
        } 
        
        requestAnimationFrame(animate);
    }

    function isInView() {
        return window.scrollY < window.innerHeight;
    }

    function onWindowResize() {
        // width = document.body.clientWidth;
        width = window.innerWidth;
        height = window.innerHeight / 1.1;
        aspect = width / height;
        
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        setBlockHeight();
    
        renderer.setSize( width, height );    
    }

    window.addEventListener('resize', onWindowResize, false);
    animate();
}











