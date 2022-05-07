const obstacles = [];
const VIEW_OPTIONS = { 
    // vectorFlow: true,
    // fieldRadius: true,
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
        this.#ctx.strokeStyle = 'black';
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

    drawVehicle({x, y, r}) {
        this.#drawPoint(x, y, r, '#1bb21b');
        // const a = (2*r)/Math.sqrt(2);
        // this.#ctx.strokeRect(x - a/2,y - a/2,a,a);
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
                    const { vx: vxR, vy: vyR } = obstacle.getFieldRepulsion(vectorAsVehicle);

                    toX += vxR;
                    toY += vyR;
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
 * basic entity 
 */
class Vector {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    mag() {
        return Math.hypot(this.x, this.y);
    }
    negate() {
        return this.scaleBy(-1);
    }
    angle(other) {
        return Math.acos(this.dot(other) / (this.mag() * other.mag()));
    }
    sum(other) {
        return new Vector(other.x + this.x, other.y + this.y);
    }
    sub(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }
    scaleBy(koef) {
        return new Vector(this.x * koef, this.y * koef);
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
        const attrectedVector = vehicle.sub(this);
        const distance = attrectedVector.mag(); 
    
        const forceAtPoint = this.#attractionForce(distance);
        
        /** the same as:
        const oXOyTan = Math.abs((oX / oY) || 1);
        const vx = forceAtPoint * Math.sin(Math.atan(oXOyTan)) * -1;
        const vy = forceAtPoint * Math.cos(Math.atan(oXOyTan)) * -1;
        */
        return attrectedVector.scaleBy(forceAtPoint / distance).negate();
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

    #newRepulsiveForce() {

    }

    getFieldRepulsion(vehicle) {
        const oX  = (vehicle.x - this.x); 
        const oY  = (vehicle.y - this.y);

        const distance = Math.hypot(oX, oY); 
        // const k = (this.maxRepulsiveForce / this.distributionWidth);
        // let forceAtPoint = this.maxRepulsiveForce -  k * (distance);

        const forceAtPoint = this.#repulsiveForce(distance)

        // otherwise
        if (distance > this.fieldRadius) {
            return {
                vx: 0,
                vy: 0
            }
        }
 
        const vx = forceAtPoint * (oX / distance);
        const vy = forceAtPoint * (oY / distance);
        /** the same as:
        const oXOyTan = Math.abs((oX / oY) || 1);
        const vx = forceAtPoint * Math.sin(Math.atan(oXOyTan)) * Math.sign(oX);
        const vy = forceAtPoint * Math.cos(Math.atan(oXOyTan)) * Math.sign(oY);
        */

        return {
            vx,
            vy
        }
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
    new Obstacle(250, 500, 70, 7, 0.0005),
    new Obstacle(400, 600, 40, 8, 0.00125),
    new Obstacle(490, 500, 40, 8, 0.00125)
);

const target = new Target(800, 495, 2.5, 0.0005);
const vehicle = new Vehicle(100, 510, 20)

const frame = () => {
    canvas.clear()

    VIEW_OPTIONS.vectorFlow && canvas.drawTargetVectorsFlow(target);

    canvas.drawTarget(target);
    canvas.drawVehicle(vehicle);

    const { x: vxAttractive, y: vyAttractive } = target.getFieldAttraction(vehicle);

    // sum of each of obstacles repulsion force
    let vxRepulsive = 0;
    let vyRepulsive = 0;
    //
    for (const obstacle of obstacles) {     
        const { vx: vxR, vy: vyR } = obstacle.getFieldRepulsion(vehicle);

        vxRepulsive += vxR;
        vyRepulsive += vyR;

        canvas.drawObstacle(obstacle);
    }
 
    const vxTotal = vxRepulsive + vxAttractive;
    const vyTotal = vyRepulsive + vyAttractive;

    const attractiveForceVector = new Vector(vxAttractive, vyAttractive);
    const totalForceVector = new Vector(vxTotal, vyTotal);
    const repulsiveForceVector = new Vector(vxRepulsive, vyRepulsive);

    // angle between Total force and Attractive force (tetha)
    // console.log(Utils.toDegree(attractiveForceVector.angle(totalForceVector)), 'Attractive');
    // angle between Total force and Repulsive force (sigma)
    // console.log(Utils.toDegree(repulsiveForceVector.angle(totalForceVector)), 'Repulsive');

    vehicle.move(vxTotal, vyTotal);


    // display total force direction
    const { x: tFx, y: tFy } = totalForceVector.scaleBy(100).sum(vehicle);
    
    canvas.drawVector(vehicle.x, vehicle.y, tFx, tFy, 1, 'blue');
    //

    // display attractive force direction
    const { x: aFx, y: aFy } = attractiveForceVector.scaleBy(100).sum(vehicle);
    canvas.drawVector(vehicle.x, vehicle.y, aFx, aFy, 1, 'green');

    // display repulsive force direction
    const { x: rFx, y: rFy } = repulsiveForceVector.scaleBy(100).sum(vehicle);
    canvas.drawVector(vehicle.x, vehicle.y, rFx, rFy, 1, 'red');

    window.requestAnimationFrame(frame)
}

frame();

// skip it, only for viewing
let pressed = false;

canvas.element.onmousemove = (e) => {
    if (!pressed) return;
    target.x = e.offsetX;
    target.y = e.offsetY;
}

canvas.element.onmousedown = (e) => {
    pressed = true;
    const mouseAsVehicle = { x: e.offsetX, y: e.offsetY, vx: 0, vy: 0, r: 1 }

    for (const obstacle of obstacles) {
        const { vx: vxR, vy: vyR } = obstacle.getFieldRepulsion(mouseAsVehicle);
        
        console.log( Math.hypot(vxR, vyR), Math.hypot(obstacle.x - mouseAsVehicle.x, obstacle.y - mouseAsVehicle.y));
    }
}

canvas.element.onmouseup = (e) => {
    pressed = false;
}

window.onkeydown = () => {
    alert()
}