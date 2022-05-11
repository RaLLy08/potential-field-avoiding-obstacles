const obstacles = new Obstacles(
    [
        new Obstacle(350, 400, 190, 7, 1/9000, 90),
        new Obstacle(500, 290, 80, 0.8, 0.00015, 18),
        new Obstacle(790, 490, 80, 0.8, 0.00015, 18),
        new Obstacle(300, 600, 40, 0.5, 0.000125),
        new Obstacle(700, 600, 40, 0.5, 0.000125),
        new Obstacle(600, 530, 40, 0.5, 0.000125),
        // new Obstacle(400, 200, 100, 2, 0.00015, 18),
        // new Obstacle(400, 240, 120, 2, 0.000125, 18),
        // new Obstacle(400, 280, 100, 2, 0.000125, 18),
        // new Obstacle(400, 300, 100, 2, 0.000125, 18),
        // new Obstacle(400, 320, 100, 2, 0.000125, 18),
        // new Obstacle(400, 340, 100, 2, 0.000125, 18),
        // new Obstacle(400, 360, 100, 2, 0.000125, 18),
        // new Obstacle(400, 380, 100, 2, 0.000125, 18),
        // new Obstacle(400, 400, 100, 2, 0.000125, 18),
        // new Obstacle(400, 420, 100, 2, 0.000125, 18),
        // new Obstacle(400, 440, 100, 2, 0.000125, 18),
        // new Obstacle(400, 460, 100, 2, 0.000125, 18),
        // new Obstacle(400, 480, 100, 2, 0.000125, 18),
        // new Obstacle(400, 500, 100, 2, 0.000125, 18),
        // new Obstacle(400, 530, 100, 2, 0.000125, 18),
        // new Obstacle(400, 550, 100, 2, 0.000125, 18),
    ]
);

const target = new Target(1000, CanvasRenderer.HEIGHT/2, 2.5, 0.00015);
const vehicle = new Vehicle(100, CanvasRenderer.HEIGHT/2, 150)


const canvasRenderer = new CanvasRenderer(vehicle, target, obstacles);


let pause = false;

const frame = () => {
    canvasRenderer.frame();

    if (!pause) {
        vehicle.setAtractiveForce(target);
        vehicle.setObstacles(obstacles.getObstaclesInVehicleRadius(vehicle))

        vehicle.move();
    };
 
    window.requestAnimationFrame(frame)
}
// **TODO:
// when radius on color near objects

frame();


canvasActions.onResetVehicle = () => {
    vehicle.x = 100;
    vehicle.y = Canvas.HEIGHT/2;
}

canvasActions.onResume = () => {
    pause = false;
}
canvasActions.onPause = () => { 
    pause = true;
}





// // skip it, only for testing
let pressed = false;

canvasRenderer.element.onmousedown = (e) => {
    pressed = true;
    // obstacles.add(new Obstacle(e.offsetX, e.offsetY, 100, 2, 0.00015, 18))
}

canvasRenderer.element.onmousemove = (e) => {
    if (!pressed) return;
    target.x = e.offsetX;
    target.y = e.offsetY;
}

canvasRenderer.element.onmouseup = (e) => {
    pressed = false;
}
