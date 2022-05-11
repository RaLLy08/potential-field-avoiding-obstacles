const canvas = new Canvas();



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

const target = new Target(1000, Canvas.HEIGHT/2, 2.5, 0.00015);
const vehicle = new Vehicle(100, Canvas.HEIGHT/2, 150)

let pause = false;

const frame = () => {
    canvas.clear()

    if (!pause) {
        vehicle.setAtractiveForce(target);
        vehicle.setObstacles(obstacles.getObstaclesInVehicleRadius(vehicle))

        vehicle.move();
    };

    renderVehicleToCanvas(obstacles.getAll(), vehicle.attractiveForce, vehicle.totalRepulsiveForce, vehicle.totalRepulsiveForceNew, vehicle.totalForce);
 
    window.requestAnimationFrame(frame)
}
// **TODO:
// when radius on color near objects

frame();

function renderVehicleToCanvas(obstacles, attractiveForceVector, repulsiveForceVector, repulsiveNewForceVector, totalForceVector) {
    canvasDisplay.vectorsFlow && canvas.drawTargetVectorsFlow(target, obstacles);

    canvas.drawTarget(target);
    canvas.drawVehicle(vehicle);

    vehicleDisplay.totalForce = totalForceVector.mag();
    vehicleDisplay.attractiveForce = attractiveForceVector.mag();
    vehicleDisplay.repulsiveForce = repulsiveForceVector.mag();
    vehicleDisplay.repulsiveNewForce = repulsiveNewForceVector.mag();

    // angle between Total force and Attractive force (theta)
    vehicleDisplay.theta = Utils.toDegree(attractiveForceVector.angle(totalForceVector));
    // angle between Total force and Repulsive force (sigma)
    vehicleDisplay.sigma = Utils.toDegree(Utils.normalizeAngle(repulsiveForceVector.fullAngle(totalForceVector)));
    // angle between Attractive force and Repulsive force (gamma)
    vehicleDisplay.gamma = Utils.toDegree(Utils.normalizeAngle(attractiveForceVector.fullAngle(repulsiveForceVector)));

    vehicleDisplay.x = vehicle.x;
    vehicleDisplay.y = vehicle.y;

    for (const obstacle of obstacles) {     
        canvas.drawObstacle(obstacle);
    }

    if (canvasDisplay.repulsiveNewForce) {
        canvas.drawVector(
            vehicle, 
            repulsiveNewForceVector.scaleBy(100).sum(vehicle), 
            2, 1.5, COLOR._TOTAL_REPULSIVE_FORCE_NEW
        );
    }

    if (canvasDisplay.attractiveForce) {
        // display attractive force direction
        canvas.drawVector(
            vehicle, 
            attractiveForceVector.scaleBy(100).sum(vehicle), 
            2, 1.5, COLOR.ATTRACTIVE_FORCE
        );
    }
    if (canvasDisplay.repulsiveForce) {
        // display repulsive force direction
        canvas.drawVector(
            vehicle, 
            repulsiveForceVector.scaleBy(100).sum(vehicle),
            2, 1.5, COLOR.TOTAL_REPULSIVE_FORCE
        );
    }
    // display total force direction
    if (canvasDisplay.totalForce) {
        canvas.drawVector(
            vehicle, 
            totalForceVector.scaleBy(100).sum(vehicle), 
            2, 1.5, COLOR.TOTAL_FORCE
        );
    }

    for (const obstacleRepulsiveForce of vehicle.repulsiveForces) {
        const [obstacleRepulsedForceVector, obstacleRepulsedForceNewVector] = obstacleRepulsiveForce;

        canvas.drawVector(
            vehicle, 
            obstacleRepulsedForceVector.scaleBy(100).sum(vehicle), 
            2, 0.5, COLOR.REPULSIVE_FORCE
        );

        canvas.drawVector(
            vehicle, 
            obstacleRepulsedForceNewVector.scaleBy(100).sum(vehicle), 
            2, 0.5, COLOR.REPULSIVE_FORCE_NEW
        );
    }
}


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

// skip it, only for testing
let pressed = false;

canvas.element.onmousedown = (e) => {
    pressed = true;
    // obstacles.add(new Obstacle(e.offsetX, e.offsetY, 100, 2, 0.00015, 18))
}

canvas.element.onmousemove = (e) => {
    if (!pressed) return;
    target.x = e.offsetX;
    target.y = e.offsetY;
}

canvas.element.onmouseup = (e) => {
    pressed = false;
}
