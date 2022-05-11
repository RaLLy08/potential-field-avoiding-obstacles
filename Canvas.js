/**
 * abstart between canvas api and required rendering
 */
class Canvas {
    static WIDTH = 1128;
    static HEIGHT = 768;
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

    #drawCircle(x, y, r, color, width = 1) {
        this.#ctx.beginPath();

        this.#ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.#ctx.strokeStyle = color;
        this.#ctx.lineWidth = width;
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

    drawVector(from, to, arrowSize = 2, lineWidth = 0.5, color) {
        const angle = Math.atan2((to.y - from.y) , (to.x - from.x));
        const hyp = Math.hypot(to.x - from.x, to.y - from.y);
        if (!hyp) return 

        this.#ctx.save();
        this.#ctx.translate(from.x, from.y);
        this.#ctx.rotate(angle);
      
        // line
        this.#ctx.strokeStyle = color;
        this.#ctx.lineWidth = lineWidth;
        this.#ctx.beginPath();	
        this.#ctx.moveTo(0, 0);
        this.#ctx.lineTo(hyp - arrowSize, 0);
        this.#ctx.stroke();

        // triangle
        this.#ctx.fillStyle = 'red';
        this.#ctx.beginPath();
        this.#ctx.lineTo(hyp - arrowSize - arrowSize*1.3, arrowSize);
        this.#ctx.lineTo(hyp, 0);
        this.#ctx.lineTo(hyp - arrowSize - arrowSize*1.3, -arrowSize);
        this.#ctx.fill();
      
        this.#ctx.restore();
    }

    drawObstacle({x, y, fieldRadius, r}) {
        canvasDisplay.obstaclesFieldRadius && this.#drawCircle(x, y, fieldRadius, COLOR.OBSTACLES_FIELD_RADIUS, 1);
        this.#drawPoint(x, y, r, COLOR.OBSTACLE);
    }

    drawTarget({x, y}) {
        this.#drawPoint(x, y, 20, 'red');
    }

    drawVehicle(vehicle) {
        const { x, y, r, vx, vy } = vehicle;
        const width = 1;
        const height = 1;
        this.#drawCircle(x, y, r, COLOR.OBSTACLES_FIELD_RADIUS, 1);
        const speedVector = new Vector(vx, vy).normalize().scaleBy(height)
        this.#drawLine(x, y, x + speedVector.x, y + speedVector.y, width, COLOR.VEHICLE)
        
        // this.#drawPoint(x, y, r, '#1bb21b');
    }
    /**
     * 
     * @param {Target} target 
     */
    drawTargetVectorsFlow() {
        const xPoints = 50;
        const yPoints = 50;
        const spaceX =Canvas.WIDTH / xPoints;
        const spaceY = Canvas.HEIGHT / yPoints;
        const arrowScale = 6;

        for (let i = 0; i <= xPoints; i++) { 
            for (let j = 0; j <= yPoints; j++) { 
         
                let vectorAsVehicle = new Vector(i*spaceX, j*spaceY);
                vectorAsVehicle.r = 12
                const attractiveForceVector = target.getFieldAttraction(vectorAsVehicle).scaleBy(arrowScale);
                const repulsiveForceVector = obstacles.getRepulsiveForce(vectorAsVehicle).scaleBy(arrowScale);

                let totalForceVector = repulsiveForceVector.sum(attractiveForceVector);
                const sigma = Math.PI - repulsiveForceVector.angle(totalForceVector);

                const clockDirectionSign = Math.sign(repulsiveForceVector.fullAngle(attractiveForceVector))
                const repulsiveNewForceVector = obstacles.getRepulsiveForceNew(vectorAsVehicle, repulsiveForceVector, sigma, clockDirectionSign).scaleBy(arrowScale);

                totalForceVector = totalForceVector.sum(repulsiveNewForceVector);

                this.drawVector(vectorAsVehicle.x, vectorAsVehicle.y, vectorAsVehicle.x + totalForceVector.x, vectorAsVehicle.y + totalForceVector.y);
            }
        }
    }
}

