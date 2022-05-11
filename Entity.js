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
    constructor(x, y, fieldRadius, maxRepulsiveForce, distributionWidth, obstacleRadius) {
        super(x, y);
        this.fieldRadius = fieldRadius;
        this.obstacleRadius = obstacleRadius || 4;
        this.maxRepulsiveForce = maxRepulsiveForce || 0;
        this.distributionWidth = distributionWidth;
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

class Obstacles {
    constructor(obstacles) { 
        this.obstacles = obstacles || []
    }
    // replace to vehicle// replace to vehicle// replace to vehicle
    // sum of each of obstacles Repulsion Force
    getRepulsiveForces(vehicle, attractiveForceVector) {
        const repulsiveForcesVectors = [];
        
        for (const obstacle of this.obstacles) {   
            const difference = vehicle.sub(obstacle);

            const distance = difference.mag(); 
            // otherwise
            if (distance > vehicle.r + obstacle.fieldRadius) continue; 
            
            const repulsiveForceVector = obstacle.getFieldRepulsion(vehicle);

            const totalForceVector = attractiveForceVector.sum(repulsiveForceVector);

            const newRepulsionDirection = Math.sign(repulsiveForceVector.fullAngle(totalForceVector))

            const repulsiveForceNewVector = this.getRepulsiveForceNew(repulsiveForceVector, totalForceVector, newRepulsionDirection);
        
            repulsiveForcesVectors.push([
                repulsiveForceVector,
                repulsiveForceNewVector
            ])
        }

        return repulsiveForcesVectors;
    }


    kSigma(sigma) {
        const kMax = 2;
        const tau = 0.5;

        return kMax / (1 + Math.exp(sigma / tau));
    }

    getRepulsiveForceNew(r, t, newRepulsionDirection) {
        const newRepulsionVector = new Vector(0, 0)

        const sigma = Math.PI - r.angle(t);
        const kMax = 2;
        const tau = 1;

        const kSigma = kMax / (1 + Math.exp(sigma / tau));

        // indirect proportion of angle between Total Force and Attractive Force
        // const k = Math.abs(Math.cos(t.angle(a)));
        const rXrYTan = Math.abs(r.x / r.y);
        // normilize vector by Repilsive force magniture, reduce by angle between TF. and AF.  // robot turning direction towards the goal
        const vx = kSigma * r.mag() * (Math.sin(Math.atan(rXrYTan) - (Math.PI/2)*Math.sign(Math.atan(r.x / r.y)) * newRepulsionDirection  )) * Math.sign(r.x);
        const vy = kSigma * r.mag() * (Math.cos(Math.atan(rXrYTan) - (Math.PI/2)*Math.sign(Math.atan(r.x / r.y)) * newRepulsionDirection  )) * Math.sign(r.y);
       
        newRepulsionVector.x = vx;
        newRepulsionVector.y = vy;
 
        return newRepulsionVector;
    }


    // sum of each of obstacles Repulsion New Force
    // getRepulsiveForceNew(vehicle, repulsiveForceVector, totalForceVector, attractiveForceVector) {
    //     let repulsiveNewForceVector = new Vector(0, 0);
    //     // vehicle.newRepulsionDirection = Math.sign(repulsiveForceVector.fullAngle(totalForceVector))
    //     if (!vehicle.newRepulsionDirection) {
    //         vehicle.newRepulsionDirection = Math.sign(repulsiveForceVector.fullAngle(totalForceVector))
    //     }
    
    //     if (repulsiveForceVector.mag() === 0 && vehicle.newRepulsionDirection) {
    //         vehicle.newRepulsionDirection = 0;
    //     }
    //     // const kSigma = this.kSigma(sigma);

    //     for (const obstacle of this.obstacles) {     
    //         const obstacleNewRepulsedVector = obstacle
    //             .getFieldNewRepulsion(vehicle, repulsiveForceVector, totalForceVector, attractiveForceVector, vehicle.newRepulsionDirection);
            
    //         repulsiveNewForceVector = repulsiveNewForceVector.sum(obstacleNewRepulsedVector);
    //     }

    //     return repulsiveNewForceVector
    // }
    add(obstacle) {
        this.obstacles.push(obstacle);
    }

    getAll() {
        return this.obstacles;
    }
}