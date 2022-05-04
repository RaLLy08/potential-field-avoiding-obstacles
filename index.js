const obstacles = []
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

        this.hashVectors = new Map();
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

    drawObstacle({x, y, r}) {
        this.#drawCircle(x, y, r, 'black');
        this.#drawPoint(x, y, 4, 'black');
    }

    drawTarget({x, y, r}) {
        this.#drawPoint(x, y, r, 'red');
    }

    drawVehicle({x, y, r}) {
        this.#drawPoint(x, y, r, '#1bb21b');
    }
    /**
     * 
     * @param {Target} target 
     */
    drawTargetVectorsFlow(target) {
        const xPoints = 80;
        const yPoints = 80;
        const pointWidth = 0.5;
        const spaceX = (Canvas.HEIGHT / xPoints);
        const spaceY = (Canvas.WIDTH / yPoints);
        const color = '#0096FF'
        const maxLineX = 10;
        const maxLineY = 10;
        // draw separatly two fields
        for (let i = 0; i <= xPoints; i++) { 
            // if (i !== 25) continue

            for (let j = 0; j <= yPoints; j++) { 
                // if (j !== 28) continue

                const fromX = i*spaceX;
                const fromY = j*spaceY;
                let toX = fromX;
                let toY = fromY;

                const vectorAsVehicle = { x: i*spaceX, y: j*spaceY, vx: maxLineX, vy: maxLineY, r: pointWidth }

                const { vx: vxA, vy: vyA } = target.getFieldAttraction(vectorAsVehicle);
      
                toX += vxA;
                toY += vyA;

                for (const obstacle of obstacles) {
                    const { vx: vxR, vy: vyR } = obstacle.getFieldRepulsion(vectorAsVehicle);

                    toX += vxR;
                    toY += vyR;
                }

                this.#drawLine(fromX, fromY, toX, toY, pointWidth, color); 
                this.#drawPoint(toX, toY, 1, 'red')
            }
        }
    }
}

/**
 * represents utils functions for several support opertaions
 */
class Utils {
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

/**
 * represents functions for math opertaions
 */
class Calculation {
    static getDistance(obj1, obj2) {
        return Math.hypot(obj2.x - obj1.x, obj2.y - obj1.y) - obj1.r - obj2.r;
    }

    static detectIntersection(obj1, obj2) {
        return Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2) <= Math.pow(obj1.r + obj2.r, 2)
    }
}

/**
 * basic entity 
 */
class Entity {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
} 
/**
 * define target with own attraction field
 */
class Target extends Entity {
    constructor(x, y, r) {
        super(x, y, r);
    }

    getFieldAttraction(vehicle) { 
        const oX = vehicle.x - this.x;
        const oY = vehicle.y - this.y;

        const resultVehicle = Math.hypot(vehicle.vx, vehicle.vy);
        const tanRad = Math.abs(oY / oX)

        const newVx = resultVehicle * Math.cos(Math.atan(tanRad)) * Math.sign(-oX);
        const newVy = resultVehicle * Math.sin(Math.atan(tanRad)) * Math.sign(-oY);
    
        return {
            vx: newVx,
            vy: newVy
        }
    }
} 
/**
 * define obstacle with own repulsion field
 */
class Obstacle extends Entity {
    constructor(x, y, r) {
        super(x, y, r);
    }

    getFieldRepulsion(vehicle) {
 
        const oX  = (vehicle.x - this.x); 
        const oY  = (vehicle.y - this.y);

        const obstacleRadius = 80;
        const fieldWidth = this.r;

        const distance = Math.hypot(oX, oY);

        let forceAtPoint = 80 / distance;


        // otherwise
        if (distance > fieldWidth + vehicle.r) {
            forceAtPoint = 0
        }

        const oXOyTan = Math.abs((oX / oY) || 1);

        const newVy = forceAtPoint * Math.sin(Math.atan(oXOyTan)) * Math.sign(oX);
        const newVx = forceAtPoint * Math.cos(Math.atan(oXOyTan)) * Math.sign(oY);

        // const vxNorm = (oX / distance) || 0; // in the case 0/0
        // const vyNorm = (oY / distance) || 0;
       
        // const trueOx = (vxNorm) * (vehicle.r + this.r); 
        // const trueOy = (vyNorm) * (vehicle.r + this.r);


        return {
            vx: newVy,
            vy: newVx
        }
    }
} 
/**
 * vehile with applied functions 
 */
class Vehicle extends Entity {
    constructor(x, y, r, vx, vy) {
        super(x, y, r);
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

    getAngle() {
        return Math.atan2(this.vy, this.vx);
    }
}

const canvas = new Canvas();

obstacles.push(
    new Obstacle(450, 500, 390),
    // new Obstacle(250, 500, 70),
    // new Obstacle(400, 600, 30),
    // new Obstacle(490, 500, 30)
);

const target = {getFieldAttraction: () => ({vx: 0, vy: 0})}
// const target = new Target(800, 495, 20);
const vehicle = new Vehicle(100, 510, 20, 0)

const frame = () => {
    canvas.clear()

    canvas.drawTargetVectorsFlow(target);
    canvas.drawTarget(target);
    canvas.drawVehicle(vehicle);

    const { vx: vxA, vy: vyA } = target.getFieldAttraction(vehicle);

    for (const obstacle of obstacles) {     
        const { vx: vxR, vy: vyR } = obstacle.getFieldRepulsion(vehicle);

        vehicle.move(vxR, vyR);

        canvas.drawObstacle(obstacle);
    }

    vehicle.move(vxA, vyA);

    window.requestAnimationFrame(frame)
}


frame();

canvas.element.onmousemove = (e) => {
    target.x = e.offsetX;
    target.y = e.offsetY;
}