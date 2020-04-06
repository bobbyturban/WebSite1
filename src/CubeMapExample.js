import * as THREE from '../libs/three/build/three.module.js';

import Stats from '/libs/three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from '/libs/three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from '/libs/three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from '/libs/three/examples/jsm/loaders/GLTFLoader.js';

var container, stats;

var camera, scene, renderer;

var pointLight;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.z = 2000;

    //cubemap
    var path = '/res/textures/cube/cube/pisa/';
    var format = '.jpg'; // works
    //var format = '.png';    // works, but files are much bigger -> slower!
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    var refractionCube = new THREE.CubeTextureLoader().load(urls);
    refractionCube.mapping = THREE.CubeRefractionMapping;

    scene = new THREE.Scene();
    scene.background = reflectionCube;

    //lights
    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

    pointLight = new THREE.PointLight(0xffffff, 2);
    scene.add(pointLight);

    //materials
    var cubeMaterial3 = new THREE.MeshLambertMaterial({ color: 0xff6600, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.3 });
    var cubeMaterial2 = new THREE.MeshLambertMaterial({ color: 0xffee00, envMap: refractionCube, refractionRatio: 0.95 });
    var cubeMaterial1 = new THREE.MeshLambertMaterial({ color: 0xffffff, envMap: reflectionCube });

    var objLoader = new OBJLoader();

    objLoader.setPath('/libs/three/examples/models/obj/walt/');
    objLoader.load('WaltHead.obj', function (object) {
        var head = object.children[0];

        head.scale.multiplyScalar(15);
        head.position.y = - 500;
        head.material = cubeMaterial1;

        var head2 = head.clone();
        head2.position.x = - 900;
        head2.material = cubeMaterial2;

        var head3 = head.clone();
        head3.position.x = 900;
        head3.material = cubeMaterial3;

        //scene.add(head, head2, head3);
        scene.add(head);
    });

    var gltfLoader = new GLTFLoader();
    gltfLoader.setPath('/res/models/');

    /** @type {THREE.Mesh} */
    var ente;

    gltfLoader.load('Ente1.gltf',
        function (gltf) {
            ente = gltf.scene;

            ente.scale.multiplyScalar(15*4);
            ente.position.x = -900;
            ente.position.y = -500;
        
            scene.add(ente);
        },
        // called while loading is progressing
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error(error);
        }
    );

    /** @type {THREE.Mesh} */
    var artWork;
    gltfLoader.load('AxelsSkulptur.gltf',
        function (gltf) {
            artWork = gltf.scene;

            artWork.scale.multiplyScalar(15*3);
            artWork.position.x = 900;
            artWork.position.y = -500;
            artWork.material = cubeMaterial2;
          
            scene.add(artWork);
        },
        // called while loading is progressing
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error(error);
        }
    );

    //renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    //controls
    var controls = new OrbitControls(camera, renderer.domElement);
    //controls.enableZoom = false;
    //controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 1.5;

    //stats
    stats = new Stats();
    container.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
    stats.update();
}