   var stepX = 0.15;
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
      var camara_type = document.querySelector('input[name="camara"]:checked').value;

      var camera = new THREE.PerspectiveCamera(56, sceneWidth / sceneHeight, 0.01, 100);
      console.log(camara_type);
      if (camara_type == "player"){
      camera.position.set(0, -50, 15);
    }else if (camara_type == "cenital"){
      camera.position.set(0, 0, 60);
    }
    camera.lookAt(scene.position);


      var renderer = new THREE.WebGLRenderer({
         antialias : true
      });
      renderer.shadowMap.enabled = true;
      renderer.setSize(sceneWidth, sceneHeight);
      document.body.appendChild(renderer.domElement);

      var light_direct_1 = getLight_1();
      var light_direct_2 = getLight_2();
      var ambient_light = addAmbientLight();
      var leftBorder = getBorder("left", 1, 51, 2, -11, 0, 0);
      var rightBorder = getBorder("right", 1, 51, 1.5, 11, 0, 0);
      var topBorder = getBorder("top", 23, 1, 0, 0, 26, 0);
      var downBorder = getBorder("down",23, 1, 0, 0, -26, 0);
      var playerPaddle = addPlayerMesh("playerPaddle",3,1,2,0,-24,0);
      var cpuPaddle = addPlayerMesh("cpuPaddle",3,1,2,0,24,0);
      var sphere = getSphere();
      var floor = getFloor();

      scene.add(ambient_light);
      scene.add(light_direct_1);
      //scene.add(light_direct_2);
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
      checkCollision(sphere, borders, cpuPaddle,playerPaddle);
      ballMovement(sphere);
      cpuPaddleMovement(cpuPaddle, sphere);
      playerMovement(playerPaddle, sphere);

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
    	// Move up & Down PlayerPaddle
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

       function addAmbientLight() {
          var light = new THREE.AmbientLight(0xFFFFFF);
          return light;
       }


   function getLight_1() {
      var light = new THREE.DirectionalLight( 0xffffff, 0.25 );
      light.position.set(0, 27, 25);
      light.castShadow = true;
      light.shadow.camera.near = 20;
      light.shadow.camera.far = 16;
      light.shadow.camera.left = -8;
      light.shadow.camera.right = 5;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = -10;
      light.shadow.mapSize.width = 4096;
      light.shadow.mapSize.height = 4096;
      return light;
   }

   function getLight_2() {
      var light = new THREE.DirectionalLight();
      light.position.set(10, 10, 20);
      light.castShadow = true;
      light.shadow.camera.near = 20;
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
      var mesh = new THREE.Mesh(geometry, getFloorMaterial());
      mesh.receiveShadow = true;

      return mesh;
   }

   function addPlayerMesh(name, x, y, z, posX, posY, posZ) {
     var geometry = new THREE.BoxGeometry(x, y, z);
     var mesh = new THREE.Mesh(geometry, getPaddleMaterial());
      mesh.position.set(posX, posY, posZ);
      mesh.castShadow = true;
      mesh.name = name;

      return mesh;
   }


   function getBorder(name, x, y, z, posX, posY, posZ) {
      var geometry = new THREE.BoxGeometry(x, y, z);
      if (name== "left" || name == "right"){
        var mesh = new THREE.Mesh(geometry, getbordermaterial());

      }else{
      var material = new THREE.MeshBasicMaterial( { color: 0x00000 });
      var mesh = new THREE.Mesh(geometry, material );
      };
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.position.set(posX, posY, posZ);
      mesh.name = name;

      return mesh;
   }


   function getPaddleMaterial() {
      var texture = new THREE.TextureLoader().load("paddle_color.png");
      var material = new THREE.MeshPhysicalMaterial({
         map : texture
      });
      material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
      material.map.repeat.set(4, 4);
      material.side = THREE.DoubleSide;

      return material;
   }


   function getFloorMaterial() {
      var texture = new THREE.TextureLoader().load("paddle_color_2.png");
      var material = new THREE.MeshPhysicalMaterial({
         map : texture
      });
      material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
      material.map.repeat.set(4, 4);
      material.side = THREE.DoubleSide;

      return material;
   }

   function getbordermaterial() {
      var texture = new THREE.TextureLoader().load("border.png");
      var material = new THREE.MeshPhysicalMaterial({
         map : texture
      });
      material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
      material.map.repeat.set(4, 4);
      material.side = THREE.DoubleSide;

      return material;
   }

   function angleVaration(sphere, cpuPaddle,playerPaddle) {

     if (sphere.position.x >= playerPaddle.position.x + 1 || sphere.position.x <= playerPaddle.position.x - 1){
           stepX = 0.50;
               }
     if (sphere.position.x <= playerPaddle.position.x + 1 || sphere.position.x >= playerPaddle.position.x - 1){
       stepX = 0.25;
     }
     if (sphere.position.x >= cpuPaddle.position.x + 1 || sphere.position.x <= cpuPaddle.position.x - 1){
           stepX = 0.50;
               }
     if (sphere.position.x <= cpuPaddle.position.x + 1 || sphere.position.x >= cpuPaddle.position.x - 1){
       stepX = 0.25;
     }

   }

   var posicion1;
   var posicion2;
   var distancia;
   function speedVaration(sphere,cpuPaddle,playerPaddle,colisiontype) {
     console.log (colisiontype);

      if (colisiontype == "cpuPaddle"){
       posicion1 = playerPaddle.position.x ;

      }
      if (colisiontype == "playerPaddle"){
       posicion2 =playerPaddle.position.x
       if (Math.abs(posicion1) > Math.abs(posicion2)) {
       var  distancia = posicion1 - posicion2
       }
       if (Math.abs(posicion2) > Math.abs(posicion1)) {
         distancia = posicion2 - posicion1
       }
     }

    if(distancia > 10 || distancia < -10){
      stepX = stepX + 0.05;
      console.log( "hola1");
      stepY = stepY + 0.05;
    }else if(distancia > 5 || distancia < 5){
      stepX = stepX + 0.03;
      console.log( "hola2");
      stepY = stepY + 0.03;

    }else{
    stepX *= 1;
    stepY *= 1;
    console.log ("hola2");

          }
  }


    var countCollision=0;
    function checkCollision(sphere, borders,cpuPaddle,playerPaddle) {
       document.getElementById("scores").innerHTML = score1 + "-" + score2;
       var originPosition = sphere.position.clone();
       countCollision++;
       for (var i = 0; i < sphere.geometry.vertices.length; i++) {
          var localVertex = sphere.geometry.vertices[i].clone();
          var globalVertex = localVertex.applyMatrix4(sphere.matrix);
          var directionVector = globalVertex.sub(sphere.position);
          var ray = new THREE.Raycaster(originPosition, directionVector.clone().normalize());
          var collisionResults = ray.intersectObjects(borders);
          if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
             // Collision detected
             if (collisionResults[0].object.name == "left" || collisionResults[0].object.name == "right") {
               var wall = new Audio('pong_wall.wav');
               wall.play();
                stepX *= -1;
             }
             if (collisionResults[0].object.name == "down" ) {
               var wall = new Audio('pong_fail.wav');
               wall.play();
               sphere.position.x = 0;
               sphere.position.y = 0;
               score2 += 1;
               stepX = 0.15;
               stepY = 0.25;
             }
             if ( collisionResults[0].object.name == "top") {
               var wall = new Audio('pong_fail.wav');
               wall.play();
               sphere.position.x = 0;
               sphere.position.y = 0;
               score1 += 1;
               stepX = 0.15;
               stepY = 0.25;
            }
             if (countCollision > 20 && (collisionResults[0].object.name == "playerPaddle" || collisionResults[0].object.name == "cpuPaddle")) {
                stepY *= -1;
                countCollision=0;
                var wall = new Audio('pong_hit.wav');
                wall.play();
                angleVaration(sphere, cpuPaddle,playerPaddle);
                speedVaration(sphere,cpuPaddle,playerPaddle,collisionResults[0].object.name);

             }
             break;
          }
       }
 }
