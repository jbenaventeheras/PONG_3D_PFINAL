if (sphere.position.x >= playerPaddle.position.x + 1 || sphere.position.x <= playerPaddle.position.x - 1){
      stepX = 0.50;
          }
if (sphere.position.x <= playerPaddle.position.x + 1 || sphere.position.x >= playerPaddle.position.x - 1){
  stepX = 0.25;
}
