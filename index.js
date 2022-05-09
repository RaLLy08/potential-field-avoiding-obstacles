const obstacles = [];
const VIEW_OPTIONS = { 
    VECTOR_FLOW: true,
    // fieldRadius: true,
    ATTRACTIVE_VECTOR: true,
    REPULSIVE_VECTOR: true,
    TOTAL_VECTOR: true,
    REPULSIVE_NEW_VECTOR: true,
}


const canvas = new Canvas();

obstacles.push(
    // new Obstacle(450, 500, 500, 100, 1/50000),
    new Obstacle(250, 500, 100, 1.2, 0.00015, 18),
    new Obstacle(400, 600, 40, 2, 0.00125),
    new Obstacle(490, 500, 40, 2, 0.00125)
);

const target = new Target(800, 495, 2.5, 0.00015);
const vehicle = new Vehicle(100, 499, 20)

const frame = () => {
    canvas.clear()

    VIEW_OPTIONS.VECTOR_FLOW && canvas.drawTargetVectorsFlow(target, obstacles);

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
    displayParams.setTotalForceSpeed(totalForceVector.mag());
    displayParams.setAttractiveForce(attractiveForceVector.mag());
    displayParams.setRepulsiveForce(repulsiveForceVector.mag());
    displayParams.setRepulsiveNewForce(repulsiveNewForceVector.mag());

    
    // angle between Total force and Attractive force (tetha)
    // console.log(Utils.toDegree(attractiveForceVector.angle(totalForceVector)), 'Attractive');
    // angle between Total force and Repulsive force (sigma)
    // console.log(Utils.toDegree(repulsiveForceVector.angle(totalForceVector)), 'Repulsive');

    // normilize to attractive speed
    // const toAttractiveSpeedVector = totalForceVector.normalize().scaleBy(attractiveForceVector.mag());

    vehicle.move(totalForceVector.x, totalForceVector.y);


    if (VIEW_OPTIONS.REPULSIVE_NEW_VECTOR) {
        const { x: rnFx, y: rnFy } = repulsiveNewForceVector.scaleBy(100).sum(vehicle);
        canvas.drawVector(vehicle.x, vehicle.y, rnFx, rnFy, 1.5, COLOR.REPULSIVE_NEW_FORCE);
    }

    if (VIEW_OPTIONS.ATTRACTIVE_VECTOR) {
        // display attractive force direction
        const { x: aFx, y: aFy } = attractiveForceVector.scaleBy(100).sum(vehicle);
        canvas.drawVector(vehicle.x, vehicle.y, aFx, aFy, 1.5, COLOR.ATTRACTIVE_FORCE);
    }
    if (VIEW_OPTIONS.REPULSIVE_VECTOR) {
        // display repulsive force direction
        const { x: rFx, y: rFy } = repulsiveForceVector.scaleBy(100).sum(vehicle);
        canvas.drawVector(vehicle.x, vehicle.y, rFx, rFy, 1.5, COLOR.REPULSIVE_FORCE);
    }
    // display total force direction
    if (VIEW_OPTIONS.TOTAL_VECTOR) {
        const { x: tFx, y: tFy } = totalForceVector.scaleBy(100).sum(vehicle);
        canvas.drawVector(vehicle.x, vehicle.y, tFx, tFy, 1.5, COLOR.TOTAL_FORCE);
    }

    // **TODO**
    // change canvas to vectors drawing
    // change for of obstacles to common sum
    // deepht field vectors
    // reset vehicle
    // scale to consts
    // add remove forces
    // edit obstacles  
    window.requestAnimationFrame(frame)
}

frame();

// skip it, only for testing
let pressed = false;

canvas.element.onmousemove = (e) => {
    if (!pressed) return;
    target.x = e.offsetX;
    target.y = e.offsetY;
}

canvas.element.onmousedown = (e) => {
    pressed = true;
    const mouseAsVehicle = new Vehicle(e.offsetX, e.offsetY, 1, 0, 0);

    for (const obstacle of obstacles) {
        const { x: vxR, y: vyR } = obstacle.getFieldRepulsion(mouseAsVehicle);
        
        if (!Math.hypot(vxR, vyR)) return

        console.log( Math.hypot(vxR, vyR).toPrecision(4), Math.hypot(obstacle.x - mouseAsVehicle.x, obstacle.y - mouseAsVehicle.y));
    }
}

canvas.element.onmouseup = (e) => {
    pressed = false;
}

window.onkeydown = (e) => {
    if (e.code === 'KeyS') {
        alert()
    }
}