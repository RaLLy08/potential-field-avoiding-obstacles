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

    drawVector(fromX, fromY, toX, toY, pointWidth = 1, lineWidth = 0.5, color = COLOR.VECTOR) {
        this.#drawLine(fromX, fromY, toX, toY, lineWidth, color); 
        this.#drawPoint(toX, toY, pointWidth, 'red')
    }

    drawObstacle({x, y, fieldRadius, obstacleRadius}) {
        this.#drawCircle(x, y, fieldRadius, COLOR.OBSTACLE_FIELD_RADIUS, 0.3);
        this.#drawPoint(x, y, obstacleRadius, COLOR.OBSTACLE);
    }

    drawTarget({x, y}) {
        this.#drawPoint(x, y, 20, 'red');
    }

    drawVehicle(vehicle) {
        const { x, y, r, vx, vy } = vehicle;
        const width = 30;
        const height = 40;

        const speedVector = new Vector(vx, vy).normalize().scaleBy(height)
        this.#drawLine(x, y, x + speedVector.x, y + speedVector.y, width, COLOR.VEHICLE)
        
        // this.#drawPoint(x, y, r, '#1bb21b');
    }
    /**
     * 
     * @param {Target} target 
     */
    drawTargetVectorsFlow(target, obstacles) {
        const xPoints = 50;
        const yPoints = 50;
        const spaceX =Canvas.WIDTH / xPoints;
        const spaceY = Canvas.HEIGHT / yPoints;
        const arrowScale = 6;

        for (let i = 0; i <= xPoints; i++) { 
            for (let j = 0; j <= yPoints; j++) { 
         
                let vectorAsVehicle = new Vector(i*spaceX, j*spaceY);

                let totalForceVector = new Vector(0, 0)

                const attractiveForceVector = target.getFieldAttraction(vectorAsVehicle).scaleBy(arrowScale);
   
                totalForceVector = attractiveForceVector.sum(totalForceVector);

                let repulsiveForceVector = new Vector(0, 0);

                for (const obstacle of obstacles) {
                    const obstacleRepulsedVector = obstacle.getFieldRepulsion(vectorAsVehicle).scaleBy(arrowScale);

                    repulsiveForceVector = repulsiveForceVector.sum(obstacleRepulsedVector);
                }

                totalForceVector = totalForceVector.sum(repulsiveForceVector);

                let repulsiveNewForceVector = new Vector(0, 0);

                for (const obstacle of obstacles) {     
                    const obstacleNewRepulsedVector = obstacle
                        .getFieldNewRepulsion(vectorAsVehicle, repulsiveForceVector, attractiveForceVector, totalForceVector)
                        .scaleBy(arrowScale);
        
                    repulsiveNewForceVector = repulsiveNewForceVector.sum(obstacleNewRepulsedVector);
                }

                totalForceVector = totalForceVector.sum(repulsiveNewForceVector);

                this.drawVector(vectorAsVehicle.x, vectorAsVehicle.y, vectorAsVehicle.x + totalForceVector.x, vectorAsVehicle.y + totalForceVector.y);
            }
        }
    }
}

