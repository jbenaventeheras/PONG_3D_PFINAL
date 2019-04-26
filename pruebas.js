if (sphere.position.x > playerPaddle.position.x + 1 || sphere.position.x < playerPaddle.position.x - 1){
            stepY *= -1;
          }
if (sphere.position.x < playerPaddle.position.x + 1 || sphere.position.x > playerPaddle.position.x - 1){
  stepY *= -1;
}
