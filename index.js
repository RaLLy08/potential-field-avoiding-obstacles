const canvas = new Canvas();



const obstacles = new Obstacles(
    [
        new Obstacle(350, 400, 190, 7, 1/9000, 90),
        new Obstacle(600, 280, 100, 1.4, 0.00015, 18),
        new Obstacle(690, 400, 100, 1.4, 0.00015, 18),
        new Obstacle(300, 600, 40, 2, 0.00125),
        new Obstacle(700, 600, 40, 2, 0.00125),
        new Obstacle(600, 530, 40, 2, 0.00125),
    ]
);

const target = new Target(1000, Canvas.HEIGHT/2, 2.5, 0.00015);
const vehicle = new Vehicle(100, Canvas.HEIGHT/2, 20)

let pause = false;

const frame = () => {
    canvas.clear()

    const attractiveForceVector = target.getFieldAttraction(vehicle);
    const repulsiveForceVector = obstacles.getRepulsiveForce(vehicle);

    // attractive + repulsive
    let totalForceVector = repulsiveForceVector.sum(attractiveForceVector);
    const sigma = Math.PI - repulsiveForceVector.angle(totalForceVector);

    const clockDirectionSign = Math.sign(repulsiveForceVector.fullAngle(attractiveForceVector))
    const repulsiveNewForceVector = obstacles.getRepulsiveForceNew(vehicle, repulsiveForceVector, sigma, clockDirectionSign);

    totalForceVector = totalForceVector.sum(repulsiveNewForceVector);

    // normilize to attractive speed
    // const toAttractiveSpeedVector = totalForceVector.normalize().scaleBy(attractiveForceVector.mag());

    if (!pause) {
        vehicle.move(totalForceVector.x, totalForceVector.y);
    };

    renderToCanvas(obstacles.getAll(), attractiveForceVector, repulsiveForceVector, repulsiveNewForceVector, totalForceVector);
 
    window.requestAnimationFrame(frame)
}

frame();

function renderToCanvas(obstacles, attractiveForceVector, repulsiveForceVector, repulsiveNewForceVector, totalForceVector) {
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
    vehicleDisplay.sigma = Utils.toDegree(Math.PI - repulsiveForceVector.angle(totalForceVector));
    // angle between Attractive force and Repulsive force (gamma)
    vehicleDisplay.gamma = Utils.toDegree(attractiveForceVector.fullAngle(repulsiveForceVector));

    vehicleDisplay.x = vehicle.x;
    vehicleDisplay.y = vehicle.y;

    for (const obstacle of obstacles) {     
        canvas.drawObstacle(obstacle);
    }

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
    // obstacles.push(new Obstacle(e.offsetX, e.offsetY, 100, 2, 0.00015, 18))
}

canvas.element.onmousemove = (e) => {
    if (!pressed) return;
    target.x = e.offsetX;
    target.y = e.offsetY;
}

canvas.element.onmouseup = (e) => {
    pressed = false;
}
