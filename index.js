const obstacles = new Obstacles(
    Obstacles.DEFAULT
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
    vehicle.y = CanvasRenderer.HEIGHT/2;
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
