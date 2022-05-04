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

        const oX  = (vehicle.x - obstacle.x); 
        const oY  = (vehicle.y - obstacle.y);

        const distance = Math.hypot(oX, oY);

        const vxNorm = (oX / distance) || 0; // in the case 0/0
        const vyNorm = (oY / distance) || 0;
       
        const trueOx = (vxNorm) * (vehicle.r + obstacle.r); 
        const trueOy = (vyNorm) * (vehicle.r + obstacle.r);

        const allowError = 0.5;

        return {
            vx: trueOx - oX + allowError,
            vy: trueOy - oY + allowError
        }
    }

    static getAttraction(vehicle, target) { 
        const oX = (vehicle.x - target.x);
        const oY = (vehicle.y - target.y);

        const resultVehicle = Math.hypot(vehicle.vx, vehicle.vy);
        const tanRad = oY / oX

        const newVx = resultVehicle * Math.cos(tanRad) * Math.sign(-oX);
        const newVy = resultVehicle * Math.sin(tanRad) * Math.sign(oY);

        return {
            vx: newVx,
            vy: newVy
        }
    }
}

/**
 * basic Entity 
 */
class Entity {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
} 

/**
 * vehile with applied functions 
 */
class Vehicle extends Entity {
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
    new Entity(250, 500, 70),
    new Entity(400, 600, 30),
    new Entity(490, 500, 30)
]

const target = new Entity(800, 495, 20);
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

