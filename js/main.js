$(function() { 

        let scene, camera, renderer;
        let axis, grid, color;
        let fov, aspect, near, far;

        fov = 65;
        aspect = window.innerWidth / window.innerHeight;
        near = 0.1;
        far = 100;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true; // Enable shadows 
        renderer.shadowMapSoft = true; // What does this sdo?

        axis = new THREE.AxisHelper(50);
        scene.add(axis);

        grid = new THREE.GridHelper(50, 25); // Helper function to visualize things in space
        color = new THREE.Color("rgb(0,0,0");
        grid.setColors(color, 0x000000);

        scene.add(grid);

        let cubeGeometry = new THREE.BoxGeometry(5,5,5);
        // let cubeMaterial = new THREE.MeshBasicMaterial({color: 0xdddddd,wireframe: true});
        let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff33000});
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);


        let planeGeometry = new THREE.PlaneGeometry(30,30,30);
        let planeMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = -.5 * Math.PI; // shift out rotation as euler value --> rotate one quarter of a rotation, which should be 90 degrees
        plane.receiveShadow = true; // Allow plane to receive shadow
        scene.add(plane)

        // Cube Deatils
        cube.position.x = 2.5;
        cube.position.y = 4;
        cube.position.z = 2.5;
        cube.castShadow = true; // enable shadow on cube
        // scene.add(cube);
        

        // Spotlight Details
        let spotlight = new THREE.SpotLight('#8b0000');
        spotlight.castShadow = true; // Spotlight needs to cast a shadow, plane needs to receive a shadow, and cube needs to cast a shadow
        spotlight.position.set(30, 30, 50);
        // spotlight.power = 1 * Math.PI;
        spotlight.shadow.radius = 4;
        scene.add(spotlight);
        // We gotta turn the stuff on

        // Orbit Controls
        // controls = new THREE.OrbitControls(camera, renderer.domElement);
        // controls.target.set(0,5,0);
        // controls.update();



        let greekStatue;
        let loader = new THREE.GLTFLoader();
        loader.load("greekstatue3.glb", 
        function(gltf) {
            console.log('GLTF about to be loaded');
            console.log(gltf);
            greekStatue = gltf.scene;
            greekStatue.position.set(0,0,0)
            greekStatue.castShadow = true;
            let scale = 0.2;
            greekStatue.scale.set(scale,scale,scale);
            greekStatue.rotation.x = 0;
            greekStatue.rotation.y = Math.PI/1.8;
            // greekStatue.rotation.z = Math.PI/2;
            // greekStatue.rotateX(Math.PI / 2)

            // greekStatue.children[2].computeFaceNormals();

            greekStatue.name = 'Greek Statue'


            let statueMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
            // let greekStatue2 = new THREE.Mesh(greekStatue, statueMaterial);
            scene.add(greekStatue);
        })

        console.log('Scene now supposed to have greek statue');
        console.log(scene)
        console.log('Greek statue should be', greekStatue);

        camera.position.x = 10;
        camera.position.y = 10;
        camera.position.z = 15;
        
        camera.lookAt(0,4,0);


        let pointlightIntensity = 5;
        // Adding point light in the project
        let pointLight = new THREE.PointLight("#ffffff", pointlightIntensity, 20);
        pointLight.position.set(50,20,20);
        pointLight.castShadow = true;
        scene.add(pointLight)
        // Add DAT GUI

        let guiControls = new function() {
            // When we call the gui controls, it'll affect these three variables
            this.rotationX = 0.01;
            this.rotationY = 0.01;
            this.rotationZ = 0.01; 
            this.greekStatuePositionX = 0;
            this.greekStatuePositionY = 0;
            this.greekStatuePositionZ = 0;

            this.greekStatueRotationX = 0;
            this.greekStatueRotationY = 0;
            this.greekStatueRotationZ = 0;

            this.cameraPositionX = 10;
            this.cameraPositionY = 10;
            this.cameraPositionZ = 10;

            this.lightPositionX = 100;
            this.lightPositionY = 10;
            this.lightPositionZ = 10;

        }

        let datGUI = new dat.GUI(); // CReates a variable for the Dat GUI
        datGUI.add(guiControls, 'rotationX', 0, 1);
        datGUI.add(guiControls, 'rotationY', 0, 1);
        datGUI.add(guiControls, 'rotationZ', 0, 1);

        datGUI.add(guiControls, 'greekStatuePositionX', -1, 1);
        datGUI.add(guiControls, 'greekStatuePositionY', -1, 1);
        datGUI.add(guiControls, 'greekStatuePositionZ', -1, 1);

        datGUI.add(guiControls, 'greekStatueRotationX', -100, 100);
        datGUI.add(guiControls, 'greekStatueRotationY', -100, 100);
        datGUI.add(guiControls, 'greekStatueRotationZ', -100, 100);

        datGUI.add(guiControls, 'cameraPositionX', -100, 100);
        datGUI.add(guiControls, 'cameraPositionY', -100, 100);
        datGUI.add(guiControls, 'cameraPositionZ', -100, 100);

        datGUI.add(guiControls, 'lightPositionX', -1000, 1000);
        datGUI.add(guiControls, 'lightPositionY', -1000, 1000);
        datGUI.add(guiControls, 'lightPositionZ', -1000, 1000);
        
        let counter = 0;

        function render() {

            // Ensure light position also keeps moving
            pointLight.position.x -= 0.05;

            cube.rotation.x += guiControls.rotationX; // Adds small increment to rotation of the cube
            cube.rotation.y += guiControls.rotationY;
            cube.rotation.z += guiControls.rotationZ;

            camera.position.x  = guiControls.cameraPositionX;
            camera.position.y = guiControls.cameraPositionY;
            camera.position.z = guiControls.cameraPositionZ;

            // pointLight.position.x = guiControls.lightPositionX;
            pointLight.position.y = guiControls.lightPositionY;
            pointLight.position.z = guiControls.lightPositionZ;

            // Make point light more and more bright
            pointLight.intensity += 0.01;
            
            if (greekStatue != undefined) {
                greekStatue.position.x = guiControls.greekStatuePositionX;
                greekStatue.position.y = guiControls.greekStatuePositionY;
                greekStatue.position.z = guiControls.greekStatuePositionZ;

                // greekStatue.rotation.x = guiControls.greekStatueRotationX;
                // greekStatue.rotation.y = guiControls.greekStatueRotationY;
                // greekStatue.rotation.z = guiControls.greekStatueRotationZ;

                // var newMaterial = new THREE.MeshPhongMaterial( {
                //     color: 0x7789E7,
                //     wireframe: true
                // } );

                var newMaterial = new THREE.MeshPhongMaterial( {
                    color: 0xfffffff,
                    // wireframe: true
                } );


                // console.log('Greek statue', greekStatue);
                // let geo = new THREE.EdgesGeometry( greekStatue.children[2] ); // or WireframeGeometry
                // let mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
                // let wireframe = new THREE.LineSegments( geo, mat );
                // greekStatue.children[2].add(wireframe)
                greekStatue.traverse((o) => {
                    counter += 1;
                    // console.log('Counter is', counter);
                    if (o.isMesh)  {
                        o.material = newMaterial;
                    }

                });

            }


            requestAnimationFrame(render);
            
            renderer.render(scene, camera);
        }
        render();

        renderer.render(scene, camera);
        $("#webGL-container").append(renderer.domElement);
})