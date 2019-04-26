
   var stepX = 0.25;
   var stepY = 0.25;
   var score1 = 0;
   var score2 = 0;
   var begin = true;

   function start(){
     if (begin){
       requestAnimationFrame(start);
       if (Key.isDown(Key.SPACE)){
         init();
         begin = false;
       }
     }
   }


  function init() {

      var scene = new THREE.Scene();
      var sceneWidth = window.innerWidth;
      var sceneHeight = window.innerHeight;

      var camera = new THREE.PerspectiveCamera(56, sceneWidth / sceneHeight, 0.01, 100);
      camera.position.set(0, -45, 20);
      camera.lookAt(scene.position);

      var renderer = new THREE.WebGLRenderer({
         antialias : true
      });
      renderer.shadowMap.enabled = true;
      renderer.setSize(sceneWidth, sceneHeight);
      document.body.appendChild(renderer.domElement);

      var light_direct = getLight();
      var leftBorder = getBorder("left", 1, 51, 1.5, -11, 0, 0);
      var rightBorder = getBorder("right", 1, 51, 1.5, 11, 0, 0);
      var topBorder = getBorder("top", 23, 1, 1.5, 0, 26, 0);
      var downBorder = getBorder("down",23, 1, 1.5, 0, -26, 0);
      var playerPaddle = addPlayerMesh("playerPaddle",3,1,2,0,-22,0);
      var cpuPaddle = addPlayerMesh("cpuPaddle",3,1,2,0,22,0);
      var sphere = getSphere();
      var floor = getFloor();

      scene.add(light_direct);
      scene.add(leftBorder);
      scene.add(rightBorder);
      scene.add(topBorder);
      scene.add(downBorder);
      scene.add(sphere);
      scene.add(floor);
      scene.add(playerPaddle);
      scene.add(cpuPaddle);

      var borders = [ leftBorder, rightBorder, topBorder, downBorder, playerPaddle, cpuPaddle];

      animate(sphere, borders, renderer, scene, camera, playerPaddle,cpuPaddle);

      ///Fov control
      var control = new function() {
         this.fov = camera.fov;


         this.update = function() {
            camera.fov = control.fov;

            camera.updateProjectionMatrix();
         }
      };

      var gui = new dat.GUI();
      gui.add(control, 'fov', 0, 180).onChange(control.update);


   }


   function animate(sphere, borders, renderer, scene, camera, playerPaddle,cpuPaddle,playersPaddles) {
      checkCollision(sphere, borders,cpuPaddle,playerPaddle);
      ballMovement(sphere);
      cpuPaddleMovement(cpuPaddle, sphere);
      playerMovement(playerPaddle, sphere)

      renderer.render(scene, camera);

      requestAnimationFrame(function() {
         animate(sphere, borders, renderer, scene, camera, playerPaddle,cpuPaddle,playersPaddles);
      });
   }



   function ballMovement(sphere) {

     ///movimiento pelota
     sphere.position.x += stepX;
     sphere.position.y += stepY;

   }

   function cpuPaddleMovement(cpuPaddle, sphere){

     if (sphere.position.x <= 0) {
       cpuPaddle.position.x = sphere.position.x +1;
     }
     if (sphere.position.x > 0) {
       cpuPaddle.position.x = sphere.position.x -1;
     }

    }

    // Move the Player paddle
    function playerMovement(playerPaddle, sphere){
// Move up & Down PlayerPaddleH
      	if (Key.isDown(Key.A)){
      		playerPaddle.position.x = playerPaddle.position.x - 1;

      	}
        if (Key.isDown(Key.D)){
      		playerPaddle.position.x = playerPaddle.position.x + 1;
      	}

        if (playerPaddle.position.x < - 9){
          playerPaddle.position.x = -9;
        }

        if (playerPaddle.position.x > 9 ){
          playerPaddle.position.x = 9;
        }

    }


   function getLight() {
      var light = new THREE.DirectionalLight();
      light.position.set(4, 4, 4);
      light.castShadow = true;
      light.shadow.camera.near = 0;
      light.shadow.camera.far = 16;
      light.shadow.camera.left = -8;
      light.shadow.camera.right = 5;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = -10;
      light.shadow.mapSize.width = 4096;
      light.shadow.mapSize.height = 4096;
      return light;
   }


   function getSphere() {
      var geometry = new THREE.SphereGeometry(0.5, 20, 20);
      var material = new THREE.MeshNormalMaterial();
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = 0.5;
      mesh.castShadow = true;
      mesh.name = "sphere";

      return mesh;
   }

   function getFloor() {
      var geometry = new THREE.PlaneGeometry(21, 50);
      var mesh = new THREE.Mesh(geometry, getWoodMaterial());
      mesh.receiveShadow = true;

      return mesh;
   }

   function addPlayerMesh(name, x, y, z, posX, posY, posZ) {
     var geometry = new THREE.BoxGeometry(x, y, z);
     var mesh = new THREE.Mesh(geometry, getTextureMaterial());
      mesh.position.set(posX, posY, posZ);
      mesh.castShadow = true;
      mesh.name = name;

      return mesh;
   }


   function getBorder(name, x, y, z, posX, posY, posZ) {
      var geometry = new THREE.BoxGeometry(x, y, z);
      var mesh = new THREE.Mesh(geometry, getWoodMaterial());
      mesh.receiveShadow = true;
      mesh.position.set(posX, posY, posZ);
      mesh.name = name;

      return mesh;
   }


   function getTextureMaterial() {
      var texture = new THREE.TextureLoader().load("Texture.png");
      var material = new THREE.MeshPhysicalMaterial({
         map : texture
      });
      material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
      material.map.repeat.set(4, 4);
      material.side = THREE.DoubleSide;

      return material;
   }


   function getWoodMaterial() {
      var texture = new THREE.TextureLoader().load("wood.png");
      var material = new THREE.MeshPhysicalMaterial({
         map : texture
      });
      material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
      material.map.repeat.set(4, 4);
      material.side = THREE.DoubleSide;

      return material;
   }

   function checkCollision(sphere, borders,cpuPaddle,playerPaddle) {
            document.getElementById("scores").innerHTML = score1 + "-" + score2;
            var originPosition = sphere.position.clone();
         for (var i = 0; i < sphere.geometry.vertices.length; i++) {
            var localVertex = sphere.geometry.vertices[i].clone();
            var globalVertex = localVertex.applyMatrix4(sphere.matrix);
            var directionVector = globalVertex.sub(sphere.position);
            var ray = new THREE.Raycaster(originPosition, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(borders);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
               // Collision detected
               if (collisionResults[0].object.name == "left" || collisionResults[0].object.name == "right") {
                  stepX *= -1;
                  var wall = new Audio('pong_wall.wav');
                  wall.play();
               }
               if (collisionResults[0].object.name == "down" ) {
                 sphere.position.x = 0;
                 sphere.position.y = 0;

                 var wall = new Audio('pong_fail.wav');
                 wall.play();
                 score2 += 1;
               }
               if ( collisionResults[0].object.name == "top") {

                 sphere.position.x = 0;
                 sphere.position.y = 0;
                 var wall = new Audio('pong_faill.wav');
                 wall.play();
                 score1 += 1;
               }
               if (collisionResults[0].object.name == "playerPaddle" || collisionResults[0].object.name == "cpuPaddle") {
                  stepY *= -1;
                  // Wall hit sound
                  var wall = new Audio('pong_hit.wav');
                  wall.play();
                  if (sphere.position.x > playerPaddle.position.x + 1 || sphere.position.x < playerPaddle.position.x - 1){

                  }
                  if (sphere.position.x < playerPaddle.position.x + 1 || sphere.position.x > playerPaddle.position.x - 1){

                  }
               }
               break;
            }
         }
   }
