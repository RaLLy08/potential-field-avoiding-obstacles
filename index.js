/**
 * abstart between canvas api and required rendering
 */
class Canvas {
    static WIDTH = 900;
    static HEIGHT = 900;

    constructor() {
        const canvas = document.getElementById('canvas');

        canvas.width = Canvas.WIDTH;
        canvas.height = Canvas.HEIGHT;

        this.ctx = canvas.getContext('2d');
    }

    #drawPoint(x, y, r, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    }
    
    clear() {
        this.ctx.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
    }

    drawObstacle({x, y, r}) {
        this.#drawPoint(x, y, r, 'black');
    }

    drawTarget({x, y, r}) {
        this.#drawPoint(x, y, r, 'red');
    }

    drawVehicle({x, y, r}) {
        this.#drawPoint(x, y, r, '#1bb21b');
    }
}

/**
 * represents utils functions for several support opertaions
 */
class Utils {
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomPoint(min, max) {
        return {
            x: Utils.getRandomInt(min, max),
            y: Utils.getRandomInt(min, max)
        };
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
    static getFieldRepulsion(vehicle, obstacle) {
        // out of field
        if (!Calculation.detectIntersection(vehicle, obstacle)) {
            return {
                vx: 0,
                vy: 0
            }
        }

        const oX  = Math.abs(vehicle.x - obstacle.x); 
        const oY  = Math.abs(vehicle.y - obstacle.y);

        const distance = Math.hypot(oX, oY);

        const vxNorm = (oX / distance) || 0; // in the case 0/0
        const vyNorm = (oY / distance) || 0;
       
        const trueOx = (vxNorm) * (vehicle.r + obstacle.r); 
        const trueOy = (vyNorm) * (vehicle.r + obstacle.r);

        let oXSign = 0;
        let oYSign = 0;

        if (vehicle.x > obstacle.x) oXSign = 1;
        if (vehicle.y < obstacle.y) oYSign = -1;
        if (vehicle.x < obstacle.x) oXSign = -1;
        if (vehicle.y > obstacle.y) oYSign = 1;

        const allowError = 0.5;

        return {
            vx: trueOx*oXSign + oX*(-oXSign) + allowError*(-oXSign),
            vy: trueOy*oYSign + oY*(-oYSign) + allowError*(oYSign)
        }
    }

    static getAttraction(vehicle, target) { 
        const oX = Math.abs(vehicle.x - target.x);
        const oY = Math.abs(vehicle.y - target.y);

        const resultVehicle = Math.hypot(vehicle.vx, vehicle.vy);
        const tanRad = oY/oX
        
        let oXSign = 0;
        let oYSign = 0;

        if (vehicle.x > target.x) oXSign = 1;
        if (vehicle.y < target.y) oYSign = -1;
        if (vehicle.x < target.x) oXSign = -1;
        if (vehicle.y > target.y) oYSign = 1;

        const newVx = resultVehicle * Math.cos(tanRad) * -oXSign;
        const newVy = resultVehicle * Math.sin(tanRad) * -oYSign;

        return {
            vx: newVx,
            vy: newVy
        }
    }
}

/**
 * basic object 
 */
class Object {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
} 

/**
 * vehile with applied functions 
 */
class Vehicle extends Object {
    constructor(x, y, r) {
        super(x, y, r);
        this.vx = 1;
        this.vy = 0;
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
const obstacles = [
    new Object(250, 500, 70),
    new Object(400, 600, 30),
    new Object(490, 500, 30)
]

const target = new Object(800, 495, 20);
const vehicle = new Vehicle(50, 510, 20)

setInterval(() => {
    canvas.clear()

    canvas.drawTarget(target);
    canvas.drawVehicle(vehicle);

    const { vx: vxA, vy: vyA } = Calculation.getAttraction(vehicle, target);

    for (const obstacle of obstacles) {     
        const { vx: vxR, vy: vyR } = Calculation.getFieldRepulsion(vehicle, obstacle);

        vehicle.move(vxR, vyR);

        canvas.drawObstacle(obstacle);
    }

    vehicle.move(vxA, vyA);

}, 10);

