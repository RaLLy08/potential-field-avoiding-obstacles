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
    }
    #repulsiveForce(distance) {
        return this.maxRepulsiveForce * Math.exp(
            -this.distributionWidth * Math.pow(distance, 2)
        )
    }

    getFieldNewRepulsion(vehicle, r, a, t) {
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

        // otherwise
        if (distance > this.fieldRadius) {
            return new Vector(0, 0);
        }

        const forceAtPoint = this.#repulsiveForce(distance)


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