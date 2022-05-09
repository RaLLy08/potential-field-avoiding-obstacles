const obstacles = [];


const canvas = new Canvas();

obstacles.push(
    new Obstacle(350, 400, 190, 7, 1/9000, 90),
    new Obstacle(600, 280, 100, 1.2, 0.00015, 18),
    new Obstacle(690, 400, 100, 1.2, 0.00015, 18),
    new Obstacle(300, 600, 40, 2, 0.00125),
    new Obstacle(700, 600, 40, 2, 0.00125),
    new Obstacle(600, 530, 40, 2, 0.00125),

    // new Obstacle(370, 200, 40, 2, 0.00125),
    // new Obstacle(400, 280, 40, 2, 0.00125),
    // new Obstacle(370, 360, 40, 2, 0.00125),
    // new Obstacle(400, 440, 40, 2, 0.00125),
    // new Obstacle(370, 520, 40, 2, 0.00125),
);

const target = new Target(1000, Canvas.HEIGHT/2, 2.5, 0.00015);
const vehicle = new Vehicle(100, Canvas.HEIGHT/2, 20)

let pause = false;

const frame = () => {
    canvas.clear()

    canvasDisplay.vectorsFlow && canvas.drawTargetVectorsFlow(target, obstacles);

    canvas.drawTarget(target);
    canvas.drawVehicle(vehicle);

    const attractiveForceVector = target.getFieldAttraction(vehicle);

    // sum of each of obstacles Repulsion Force
    let repulsiveForceVector = new Vector(0, 0);
    //
    for (const obstacle of obstacles) {     
        const obstacleRepulsedVector = obstacle.getFieldRepulsion(vehicle);
        repulsiveForceVector = repulsiveForceVector.sum(obstacleRepulsedVector);

        canvas.drawObstacle(obstacle);
    }
    let totalForceVector = repulsiveForceVector.sum(attractiveForceVector);

    let repulsiveNewForceVector = new Vector(0, 0);
    // sum of each of obstacles Repulsion New Force
    for (const obstacle of obstacles) {     
        const obstacleNewRepulsedVector = obstacle.getFieldNewRepulsion(vehicle, repulsiveForceVector, attractiveForceVector, totalForceVector);
        
        repulsiveNewForceVector = repulsiveNewForceVector.sum(obstacleNewRepulsedVector);
    }

    totalForceVector = totalForceVector.sum(repulsiveNewForceVector)

    // normilize to attractive speed
    const toAttractiveSpeedVector = totalForceVector.normalize().scaleBy(attractiveForceVector.mag());

    if (!pause) {
        vehicle.move(totalForceVector.x, totalForceVector.y);
    };


    vehicleDisplay.totalForce = totalForceVector.mag();
    vehicleDisplay.attractiveForce = attractiveForceVector.mag();
    vehicleDisplay.repulsiveForce = repulsiveForceVector.mag();
    vehicleDisplay.repulsiveNewForce = repulsiveNewForceVector.mag();

    // angle between Total force and Attractive force (theta)
    vehicleDisplay.theta = Utils.toDegree(attractiveForceVector.angle(totalForceVector));
    // angle between Total force and Repulsive force (sigma)
    vehicleDisplay.sigma = Utils.toDegree(repulsiveForceVector.angle(totalForceVector));


    if (canvasDisplay.repulsiveNewForce) {
        const { x: rnFx, y: rnFy } = repulsiveNewForceVector.scaleBy(100).sum(vehicle);
        canvas.drawVector(vehicle.x, vehicle.y, rnFx, rnFy, 2, 1.5, COLOR.REPULSIVE_FORCE_NEW);
    }

    if (canvasDisplay.attractiveForce) {
        // display attractive force direction
        const { x: aFx, y: aFy } = attractiveForceVector.scaleBy(100).sum(vehicle);
        canvas.drawVector(vehicle.x, vehicle.y, aFx, aFy, 2, 1.5, COLOR.ATTRACTIVE_FORCE);
    }
    if (canvasDisplay.repulsiveForce) {
        // display repulsive force direction
        const { x: rFx, y: rFy } = repulsiveForceVector.scaleBy(100).sum(vehicle);
        canvas.drawVector(vehicle.x, vehicle.y, rFx, rFy, 2, 1.5, COLOR.REPULSIVE_FORCE);
    }
    // display total force direction
    if (canvasDisplay.totalForce) {
        const { x: tFx, y: tFy } = totalForceVector.scaleBy(100).sum(vehicle);
        canvas.drawVector(vehicle.x, vehicle.y, tFx, tFy, 2, 1.5, COLOR.TOTAL_FORCE);
    }

    // **TODO**
    // change for of obstacles to common sum
    // reset vehicle
    // add remove forces
    // edit obstacles  
    window.requestAnimationFrame(frame)
}

frame();

canvasActions.onResetVehicle = () => {
    vehicle.x = 100;
    vehicle.y = Canvas.HEIGHT/2;
}

canvasActions.onResume = () => {
    pause = false;
    frame();
}
canvasActions.onPause = () => { 
    pause = true;
}

// skip it, only for testing
let pressed = false;

canvas.element.onmousedown = (e) => {
    pressed = true;
}

canvas.element.onmousemove = (e) => {
    if (!pressed) return;
    target.x = e.offsetX;
    target.y = e.offsetY;
}

canvas.element.onmouseup = (e) => {
    pressed = false;
}
