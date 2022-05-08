const obstacles = [];
const VIEW_OPTIONS = { 
    // VECTOR_FLOW: true,
    // fieldRadius: true,
    ATTRACTIVE_VECTOR: true,
    REPULSIVE_VECTOR: true,
    TOTAL_VECTOR: true,
}

const CONSTS = {
    ATTRACTIVE_VECTOR_COLOR: 'blue',
    REPULSIVE_VECTOR_COLOR: 'red',
    TOTAL_VECTOR_COLOR: 'black',
}

/**
 * abstart between canvas api and required rendering
 */
class Canvas {
    static WIDTH = 900;
    static HEIGHT = 900;
    #ctx;

    constructor() {
        this.element = document.getElementById('canvas');

        this.element.width = Canvas.WIDTH;
        this.element.height = Canvas.HEIGHT;

        this.#ctx = this.element.getContext('2d');
    }

    #drawPoint(x, y, r, color) {
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.#ctx.fillStyle = color;
        this.#ctx.fill();
        this.#ctx.closePath();
    }

    #drawCircle(x, y, r, color) {
        this.#ctx.beginPath();

        this.#ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.#ctx.strokeStyle = color;
        this.#ctx.lineWidth = 1;
        this.#ctx.stroke();
    
        this.#ctx.closePath();
    }

    #drawLine(fromX, fromY, toX, toY, width, color) {
        this.#ctx.beginPath(); 
        this.#ctx.lineWidth = width;
        this.#ctx.strokeStyle = color; 
        this.#ctx.moveTo(fromX, fromY); 
        this.#ctx.lineTo(toX, toY); 
        
        this.#ctx.stroke(); 
        
        this.#ctx.closePath();
    }
    
    clear() {
        this.#ctx.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
    }

    drawVector(fromX, fromY, toX, toY, pointWidth = 0.5, color = '#0096FF') {
        this.#drawLine(fromX, fromY, toX, toY, pointWidth, color); 
        this.#drawPoint(toX, toY, 1, 'red')
    }

    drawObstacle({x, y, fieldRadius}) {
        this.#drawCircle(x, y, fieldRadius, 'black');
        this.#drawPoint(x, y, 4, 'black');
    }

    drawTarget({x, y}) {
        this.#drawPoint(x, y, 20, 'red');
    }

    drawVehicle(vehicle) {
        const { x, y, r, vx, vy } = vehicle;
        const width = 30;
        const height = 40;

        const speedVector = new Vector(vx, vy).normalize().scaleBy(height)
        this.#drawLine(x, y, x + speedVector.x, y + speedVector.y, width, '#1bb21b')
        
        // this.#drawPoint(x, y, r, '#1bb21b');
    }
    /**
     * 
     * @param {Target} target 
     */
    drawTargetVectorsFlow(target) {
        const xPoints = 50;
        const yPoints = 50;
        const spaceX = (Canvas.HEIGHT / xPoints);
        const spaceY = (Canvas.WIDTH / yPoints);
        const arrowScale = 6;

        for (let i = 0; i <= xPoints; i++) { 
            for (let j = 0; j <= yPoints; j++) { 
                const fromX = i*spaceX;
                const fromY = j*spaceY;
                let toX = fromX;
                let toY = fromY;
         
                const vectorAsVehicle = new Vector(i*spaceX, j*spaceY);

                const { x: vxA, y: vyA } = target.getFieldAttraction(vectorAsVehicle);
           
                toX += vxA * arrowScale;
                toY += vyA * arrowScale;
   
                for (const obstacle of obstacles) {
                    const { x: vxR, y: vyR } = obstacle.getFieldRepulsion(vectorAsVehicle);

                    toX += (vxR* arrowScale);
                    toY += (vxR* arrowScale);
                }

                this.drawVector(fromX, fromY, toX, toY);
            }
        }
    }
}

/**
 * helper functions
 */
class Utils {
    static toDegree(rads) {
        return (rads / Math.PI) * 180;
    }
}

/**
 * basic vector
 * @param {number} x
 * @param {number} y
 * @param {{color: string}} params parameters which belongs to constructor assigned vector
 */
class Vector {
    constructor(x, y, params = {}) {
        this.x = x;
        this.y = y;
        this.params = params;
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    mag() {
        return Math.hypot(this.x, this.y);
    }
    angle(other) {
        const dotOther = this.dot(other);
        const magMult = this.mag() * other.mag();

        // if (magMult === 0) return 1;

        return Math.acos(dotOther / magMult);
    }
    sum(other) {
        return new Vector(other.x + this.x, other.y + this.y, this.params);
    }
    sub(other) {
        return new Vector(this.x - other.x, this.y - other.y, this.params);
    }
    scaleBy(koef) {
        return new Vector(this.x * koef, this.y * koef, this.params);
    }
    normalize() {
        return this.scaleBy(1 / this.mag())
    }
    negate() {
        return this.scaleBy(-1);
    }
    bindParams(params) {
        this.params = params;
        return this;
    }
} 
/**
 * define target with own attraction field
 */
class Target extends Vector {
    constructor(x, y, maxAttractionForce, distributionWidth) {
        super(x, y);
        this.distributionWidth = distributionWidth;
        this.maxAttractionForce = maxAttractionForce;
    }
    #attractionForce(distance) {
        return this.maxAttractionForce * (1 - Math.exp(
            -this.distributionWidth * Math.pow(distance, 2)
        ))
    }

    getFieldAttraction(vehicle) { 
        const difference = vehicle.sub(this);
        const distance = difference.mag(); 
    
        const forceAtPoint = this.#attractionForce(distance);
        
        /** the same as:
        const oXOyTan = Math.abs((oX / oY) || 1);
        const vx = forceAtPoint * Math.sin(Math.atan(oXOyTan)) * -1;
        const vy = forceAtPoint * Math.cos(Math.atan(oXOyTan)) * -1;
        */

        // vector towards the robot from the detected 𝑘  obstacle
        return difference.normalize().scaleBy(forceAtPoint).negate();
    }
} 
/**
 * define obstacle with own repulsion field
 */
class Obstacle extends Vector {
    constructor(x, y, fieldRadius, maxRepulsiveForce, distributionWidth) {
        super(x, y);
        this.fieldRadius = fieldRadius;
        this.maxRepulsiveForce = maxRepulsiveForce || 0;
        this.distributionWidth = distributionWidth;
    }
    #repulsiveForce(distance) {
        return this.maxRepulsiveForce * Math.exp(
            -this.distributionWidth * Math.pow(distance, 2)
        )
    }

    getFieldNewRepulsion(r, a, t) {
        const difference = vehicle.sub(this);

        const distance = difference.mag(); 
        const newRepulsionVector = new Vector(0, 0)

        if (distance > this.fieldRadius) {
            return newRepulsionVector;
        }
        
        // indirect proportion of angle between Total Force and Attractive Force
        const k = Math.abs(Math.cos(t.angle(a)));

        if (Utils.toDegree(r.angle(a)) > 120) {

            // direction of New Repulsion force from full angle between RF and TF
            const clockDirectionSign = Math.sign(Math.atan2(r.x * t.y - r.y* t.x, r.x*t.x + r.y*t.y));

            const rXrYTan = Math.abs(r.x / r.y);

            // normilize vector by Repilsive force magniture, reduce by angle between TF. and AF.
            const vx = k * r.mag() * (Math.sin(Math.atan(rXrYTan) - (Math.PI/2)*Math.sign(Math.atan(r.x / r.y))*clockDirectionSign  )) * Math.sign(r.x);
            const vy = k * r.mag() * (Math.cos(Math.atan(rXrYTan) - (Math.PI/2)*Math.sign(Math.atan(r.x / r.y))*clockDirectionSign  )) * Math.sign(r.y);
          
            newRepulsionVector.x = vx;
            newRepulsionVector.y = vy;
        } 
 
        return newRepulsionVector;
    }

    getFieldRepulsion(vehicle) {
        const difference = vehicle.sub(this);

        const distance = difference.mag(); 
        // const k = (this.maxRepulsiveForce / this.distributionWidth);
        // let forceAtPoint = this.maxRepulsiveForce -  k * (distance);

        const forceAtPoint = this.#repulsiveForce(distance)

        // otherwise
        if (distance > this.fieldRadius) {
            return new Vector(0, 0);
        }
        // normalize by force
        const repulsedVector = difference.normalize().scaleBy(forceAtPoint);

        return repulsedVector;
        /** the same as:
        const oXOyTan = Math.abs((oX / oY) || 1);
        const vx = forceAtPoint * Math.sin(Math.atan(oXOyTan)) * Math.sign(oX);
        const vy = forceAtPoint * Math.cos(Math.atan(oXOyTan)) * Math.sign(oY);
        */
    }
} 
/**
 * vehile with applied functions 
 */
class Vehicle extends Vector {
    constructor(x, y, r, vx, vy) {
        super(x, y);
        this.r = r;
        this.vx = vx || 0;
        this.vy = vy || 0;
    }

    move(vx, vy) {
        this.vx = vx;
        this.vy = vy;
        this.x += this.vx;
        this.y += this.vy;
    }

    getSpeed() {
        return Math.hypot(this.vx, this.vy);
    }
    /**
     * angle between vx, vy in radians 
    */
    getAngle() {
        return Math.atan2(this.vy, this.vx);
    }
}

const canvas = new Canvas();

obstacles.push(
    // new Obstacle(450, 500, 500, 100, 1/50000),
    new Obstacle(250, 500, 80, 1.2, 0.00045),
    // new Obstacle(250, 500, 70, 1.4, 0.00005),
    new Obstacle(400, 600, 40, 2, 0.00125),
    new Obstacle(490, 500, 40, 2, 0.00125)
);

const target = new Target(800, 495, 2.5, 0.00015);
const vehicle = new Vehicle(100, 499, 20)

const frame = () => {
    canvas.clear()

    VIEW_OPTIONS.VECTOR_FLOW && canvas.drawTargetVectorsFlow(target);

    canvas.drawTarget(target);
    canvas.drawVehicle(vehicle);

    const attractiveForceVector = target.getFieldAttraction(vehicle, { color: CONSTS.ATTRACTIVE_VECTOR_COLOR});

    // sum of each of obstacles Repulsion Force
    let repulsiveForceVector = new Vector(0, 0, { color: CONSTS.REPULSIVE_VECTOR_COLOR});
    //
    for (const obstacle of obstacles) {     
        const obstacleRepulsedVector = obstacle.getFieldRepulsion(vehicle, attractiveForceVector);
        repulsiveForceVector = repulsiveForceVector.sum(obstacleRepulsedVector);

        canvas.drawObstacle(obstacle);
    }
    const totalForceVector = repulsiveForceVector.sum(attractiveForceVector)
        .bindParams({ color: CONSTS.TOTAL_VECTOR_COLOR });


    let repulsiveNewForceVector = new Vector(0, 0, { color: 'pink'});
      // sum of each of obstacles Repulsion New Force
    for (const obstacle of obstacles) {     
        const obstacleNewRepulsedVector = obstacle.getFieldNewRepulsion(repulsiveForceVector, attractiveForceVector, totalForceVector);
        
        repulsiveNewForceVector = repulsiveNewForceVector.sum(obstacleNewRepulsedVector);
    }

    const { x: rnFx, y: rnFy } = repulsiveNewForceVector.scaleBy(100).sum(vehicle);
    canvas.drawVector(vehicle.x, vehicle.y, rnFx, rnFy, 1.5, repulsiveNewForceVector.params.color);


    totalForceVector.x += repulsiveNewForceVector.x;
    totalForceVector.y += repulsiveNewForceVector.y;
    
    // angle between Total force and Attractive force (tetha)
    // console.log(Utils.toDegree(attractiveForceVector.angle(totalForceVector)), 'Attractive');
    // angle between Total force and Repulsive force (sigma)
    // console.log(Utils.toDegree(repulsiveForceVector.angle(totalForceVector)), 'Repulsive');

    // normilize to attractive speed
    const toAttractiveSpeedVector = totalForceVector.normalize().scaleBy(attractiveForceVector.mag());

    vehicle.move(totalForceVector.x, totalForceVector.y);

    if (VIEW_OPTIONS.ATTRACTIVE_VECTOR) {
        // display attractive force direction
        const { x: aFx, y: aFy } = attractiveForceVector.scaleBy(100).sum(vehicle);
        canvas.drawVector(vehicle.x, vehicle.y, aFx, aFy, 1.5, attractiveForceVector.params.color);
    }
    if (VIEW_OPTIONS.REPULSIVE_VECTOR) {
        // display repulsive force direction
        const { x: rFx, y: rFy } = repulsiveForceVector.scaleBy(100).sum(vehicle);
        canvas.drawVector(vehicle.x, vehicle.y, rFx, rFy, 1.5, repulsiveForceVector.params.color);
    }
    // display total force direction
    if (VIEW_OPTIONS.TOTAL_VECTOR) {
        const { x: tFx, y: tFy } = totalForceVector.scaleBy(100).sum(vehicle);
        canvas.drawVector(vehicle.x, vehicle.y, tFx, tFy, 1.5, totalForceVector.params.color);
    }

    // **TODO**
    // change canvas to vectors drawing
    // change for of obstacles to common sum
    // deepht field vectors
    // reset vehicle

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