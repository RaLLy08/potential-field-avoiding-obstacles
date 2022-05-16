import Vector from "./Vector.js";
import { COLOR } from "./consts.js";

/**
 * define target with own attraction field
 */
export class Target extends Vector {
    constructor(x, y, maxAttractionForce, distributionWidth) {
        super(x, y);
        this.distributionWidth = distributionWidth;
        this.maxAttractionForce = maxAttractionForce;
    }
    attractionForce(distance) {
        return this.maxAttractionForce * (1 - Math.exp(
            -this.distributionWidth * Math.pow(distance, 2)
        ))
    }

    getFieldAttraction(vehicle) { 
        const difference = vehicle.sub(this);
        const distance = difference.mag(); 
    
        const forceAtPoint = this.attractionForce(distance);
        
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
export class Obstacle extends Vector {
    constructor(x, y, fieldRadius, maxRepulsiveForce, distributionWidth, obstacleRadius) {
        super(x, y);
        this.fieldRadius = fieldRadius;
        this.r = obstacleRadius || 4;
        this.maxRepulsiveForce = maxRepulsiveForce || 0;
        this.distributionWidth = distributionWidth;
        this.color = COLOR.OBSTACLE;
        // this show us direction when the vehicle is inside the fields
    }
    repulsiveForce(distance) {
        return this.maxRepulsiveForce * Math.exp(
            -this.distributionWidth * Math.pow(distance, 2)
        )
    }

    getFieldRepulsion(vehicle) {
        const difference = vehicle.sub(this);

        const distance = difference.mag(); 
        // const k = (this.maxRepulsiveForce / this.distributionWidth);
        // let forceAtPoint = this.maxRepulsiveForce -  k * (distance);
        

        const forceAtPoint = this.repulsiveForce(distance)
        // normalize by force

        return difference.normalize().scaleBy(forceAtPoint);
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
export class Vehicle extends Vector {
    constructor(x, y, r) {
        super(x, y);
        this.r = r;
        this.vx = 0;
        this.vy = 0;

        this.init();
    }
    init() {
        this.attractiveForce = new Vector(0, 0);
        this.repulsiveForces = [];

        this.totalRepulsiveForce = new Vector(0, 0);
        this.totalRepulsiveForceNew = new Vector(0, 0);

        this.totalForce = new Vector(0, 0);

        this.obstacles = [];
        this.distance = 0;
        this.startTime = performance.now();
        this.endTime = null;
    }

    static kSigma(sigma, kMax=2, tau=1) {
        return kMax / (1 + Math.exp(sigma / tau));
    }

    static getRepulsiveForceNew(r, t, newRepulsionDirection) {
        const newRepulsionVector = new Vector(0, 0)
        // indirect proportion of angle between Total Force and Attractive Force
        const sigma = Math.PI - r.angle(t);
        const kSigma = Vehicle.kSigma(sigma);  

        let rXrYTan = r.x / r.y;
        if (Number.isNaN(rXrYTan)) rXrYTan = 0;

        // normilize vector by Repilsive force magniture, reduce by angle between TF. and AF.  // robot turning direction towards the goal
        const clockShift = (Math.PI/2) * Math.sign(Math.atan(rXrYTan));

        const vxDirection = Math.sin(Math.atan(Math.abs(rXrYTan)) - clockShift * newRepulsionDirection ) * Math.sign(r.x);
        const vyDirection = Math.cos(Math.atan(Math.abs(rXrYTan)) - clockShift * newRepulsionDirection ) * Math.sign(r.y);

        const vx = kSigma * r.mag() * vxDirection;
        const vy = kSigma * r.mag() * vyDirection;

        newRepulsionVector.x = vx;
        newRepulsionVector.y = vy;

        return newRepulsionVector;
    }

    checkReachedTarget(target) {
        const difference = this.sub(target);

        if (this.endTime) return;

        const distance = difference.mag(); 

        if (distance < this.r) this.endTime = performance.now();
    }

    move(lfps) {
        this.setRepulsiveForces();
        this.setTotalRepulsiveForces();
        this.setTotalForce();

        this.vx = this.totalForce.x;
        this.vy = this.totalForce.y;
    
        this.x += this.vx / lfps;
        this.y += this.vy / lfps;

        this.setDistance();
    }

    setDistance() {
        const dv = this.getSpeed();

        this.distance += dv;
    }

    setObstacles(obstacles) {
        this.obstacles = obstacles;
    }

    setAtractiveForce(target) {
        this.attractiveForce = target.getFieldAttraction(this);
    }

    /**
     * sets Total Force from (attractiveForce, totalRepulsiveForce, totalRepulsiveForceNew) vectors
     */
    setTotalForce() {
        this.totalForce = this.attractiveForce.sum(this.totalRepulsiveForce).sum(this.totalRepulsiveForceNew);
    }
    /**
     * sets totals for (totalRepulsiveForce, totalRepulsiveForceNew) vectors from repulsiveForces
     */
    setTotalRepulsiveForces() {
        // cleaning
        this.totalRepulsiveForce = new Vector(0, 0);
        this.totalRepulsiveForceNew = new Vector(0, 0);

        for (const obstacleRepulsiveForce of this.repulsiveForces) {
            const [obstacleRepulsedForceVector, obstacleRepulsedForceNewVector] = obstacleRepulsiveForce;
            
            this.totalRepulsiveForce = this.totalRepulsiveForce.sum(obstacleRepulsedForceVector);
            if (!obstacleRepulsedForceNewVector) continue;
            this.totalRepulsiveForceNew = this.totalRepulsiveForceNew.sum(obstacleRepulsedForceNewVector);
        }
    }
    /**
     * sets (repulsiveForces) from (obstaclesInRadius)
     */
    setRepulsiveForces(exludeRepNew) {
        this.repulsiveForces.length = 0;

        for (const obstacle of this.obstacles) {
            const result = [];

            const repulsiveForceVector = obstacle.getFieldRepulsion(this);

            result.push(repulsiveForceVector);


            if (!exludeRepNew) {
                const totalForceVector = this.attractiveForce.sum(
                    repulsiveForceVector
                );
                const newRepulsionDirection = Math.sign(repulsiveForceVector.fullAngle(totalForceVector));
                const repulsiveForceNewVector = Vehicle.getRepulsiveForceNew(repulsiveForceVector, totalForceVector, newRepulsionDirection);
    
                result.push(repulsiveForceNewVector);
            }

            this.repulsiveForces.push(result);
        }
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

export class Obstacles {
    constructor(obstacles) { 
        this.obstacles = obstacles || []
    }

    /**
     * sets (obstaclesInRadius) under the conditions
     */
    getObstaclesInVehicleRadius(vehicle) {
        const vehicleObstacles = [];

        for (const obstacle of this.obstacles) {   
            const difference = vehicle.sub(obstacle);

            const distance = difference.mag(); 
            // otherwise
            if (distance > vehicle.r + obstacle.r) continue; 

            vehicleObstacles.push(obstacle);
        }

        return vehicleObstacles;
    }

    set(obstacles) {
        this.obstacles = obstacles;
    }

    add(obstacle) {
        this.obstacles.push(obstacle);
    }

    getAll() {
        return this.obstacles;
    }

    static MAPS = [
        [
            new Obstacle(350, 390, 190, 12, 1/9000, 90),
            new Obstacle(500, 290, 80, 3, 0.00015, 18),
            new Obstacle(790, 490, 80, 3, 0.00015, 18),
            new Obstacle(500, 690, 80, 3, 0.00015, 18),
            new Obstacle(790, 190, 80, 3, 0.00015, 18),
            new Obstacle(590, 190, 110, 3, 0.00015, 24),
            new Obstacle(300, 600, 40, 3, 0.000125),
            new Obstacle(700, 600, 40, 3, 0.000125),
            new Obstacle(600, 530, 40, 3, 0.000125),
        ],
        [
            new Obstacle(400, 200, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 240, 120, 2.5, 0.000125, 18),
            new Obstacle(400, 280, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 300, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 320, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 340, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 360, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 380, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 400, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 420, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 440, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 460, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 480, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 500, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 530, 100, 2.5, 0.000125, 18),
            new Obstacle(400, 550, 100, 2.5, 0.000125, 18),
    
            new Obstacle(560, 200, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 240, 120, 2.5, 0.000125, 18),
            new Obstacle(560, 280, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 300, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 320, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 340, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 360, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 380, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 400, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 420, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 440, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 460, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 480, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 500, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 530, 100, 2.5, 0.000125, 18),
            new Obstacle(560, 550, 100, 2.5, 0.000125, 18),
        ],
        [
            new Obstacle(540, 390, 400, 25, 1/25000, 190),
        ],
        []
    ]
}