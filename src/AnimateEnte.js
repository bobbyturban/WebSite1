const name = "AnimateEnte";

function animate() {


    var loadingManager = new THREE.LoadingManager();
    var loader = new THREE.GLTFLoader(loadingManager);
    //var loader = new THREE.ObjectLoader(loadingManager);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.add(camera);
    // Our key light is at a 3/4 angle from our subject.
    var directionalLight = new THREE.DirectionalLight(0xffffff, .75);
    directionalLight.position.set(-1, 1, 0);
    scene.add(directionalLight);

    // Our fill light normalizes the colors, making white 100% white.
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.opacity = 1;
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);

    //scene.add(cube);

    //loader.load('Modells/Ente.gltf', function (gltf) {
    //loader.load('Modells/AxelsSkulptur.gltf', function (gltf) {

    //loader.load('AxelsSkulptur.gltf', function (gltf) {
    //loader.setPath('Modells/');cd..

    /** @type {THREE.Mesh} */
    var ente;

    loader.load("./models/Ente1.gltf",
        //loader.load('https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
        function (gltf) {
            ente = gltf.scene;
            scene.add(gltf.scene);
            //scene.add(gltf);
        },
        // called while loading is progressing
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        function (error) {
            console.error(error);
        });

    camera.position.z = 50;

    function animate() {
        requestAnimationFrame(animate);
        ente.rotation.y += 0.01;
        //ente.scale.multiplyScalar(Math.random());
        if (Math.random() < 0.67) {
            ente.scale.multiplyScalar(1.01);
        } else {
            ente.scale.multiplyScalar(0.99);
        }

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }

    animate();
}
export { animate };