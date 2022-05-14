import { COLOR } from "./consts.js";
import Vector from "./Vector.js";
import { Vehicle } from "./Entity.js";

class Canvas {
  #ctx;

  constructor(canvas, width, height) {
    this.canvas = canvas;

    this.canvas.width = width;
    this.canvas.height = height;

    this.#ctx = this.canvas.getContext("2d");
  }

  drawPoint(x, y, r, color) {
    this.#ctx.beginPath();
    this.#ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.#ctx.fillStyle = color;
    this.#ctx.fill();
    this.#ctx.closePath();
  }

  text(x, y, text, opts = {}) {
    this.#ctx.beginPath();
    this.#ctx.font = `${opts.size || 12}px monospace`;
    this.#ctx.textAlign = opts.textAlign;
    this.#ctx.fillStyle = opts.color;
    this.#ctx.fillText(text, x, y);
    this.#ctx.closePath();
  } 
  drawCircle(x, y, r, color, width = 1) {
    this.#ctx.beginPath();

    this.#ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.#ctx.strokeStyle = color;
    this.#ctx.lineWidth = width;
    this.#ctx.stroke();

    this.#ctx.closePath();
  }

  drawLine(fromX, fromY, toX, toY, width, color) {
    this.#ctx.beginPath();
    this.#ctx.lineWidth = width;
    this.#ctx.strokeStyle = color;
    this.#ctx.moveTo(fromX, fromY);
    this.#ctx.lineTo(toX, toY);

    this.#ctx.stroke();

    this.#ctx.closePath();
  }

  clear() {
    this.#ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawVector(from, to, arrowSize = 2, lineWidth = 0.5, color) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const hyp = Math.hypot(to.x - from.x, to.y - from.y);
    if (!hyp) return;

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
    this.#ctx.fillStyle = "red";
    this.#ctx.beginPath();
    this.#ctx.lineTo(hyp - arrowSize - arrowSize * 1.3, arrowSize);
    this.#ctx.lineTo(hyp, 0);
    this.#ctx.lineTo(hyp - arrowSize - arrowSize * 1.3, -arrowSize);
    this.#ctx.fill();

    this.#ctx.restore();
  }
}

export class CanvasRenderer extends Canvas {
  static WIDTH = 1128;
  static HEIGHT = 768;
  constructor(canvas, state, vehicle, target, obstacles) {
    super(canvas, CanvasRenderer.WIDTH, CanvasRenderer.HEIGHT);
    this.vehicle = vehicle;
    this.target = target;
    this.obstacles = obstacles;
    this.state = state;
  }
  frame() {
    this.clear();

    this.renderObstacles();
    this.renderVehicle();

    this.state.vectorsFlow && this.drawTargetVectorsFlow(this.vehicle.r);
  }

  renderObstacles() {
    const obstacles = this.obstacles.getAll();

    for (const obstacle of obstacles) {
      const isObstacleInArea = this.vehicle.obstacles.includes(obstacle);

      if (!this.state.vehicleFieldRadius || !isObstacleInArea) {
        obstacle.color = COLOR.OBSTACLE;
        continue;
      }

      obstacle.color = COLOR.VEHICLE_FIELD_RADIUS;
    }

    for (const obstacle of obstacles) {
      this.state.obstaclesFieldRadius &&
        this.drawCircle(
          obstacle.x,
          obstacle.y,
          obstacle.fieldRadius,
          COLOR.OBSTACLES_FIELD_RADIUS,
          1
        );
      this.state.obstacles && this.drawPoint(obstacle.x, obstacle.y, obstacle.r, obstacle.color);
    }
  }

  renderVehicle() {
    const {
      attractiveForce,
      totalRepulsiveForce,
      totalRepulsiveForceNew,
      totalForce,
    } = this.vehicle;

    this.drawTarget(this.target);

    if (this.state.vehicle) {
      this.drawVehicle(this.vehicle);
    }

    if (this.state.vehicleFieldRadius) {
      this.drawCircle(
        this.vehicle.x,
        this.vehicle.y,
        this.vehicle.r,
        COLOR.VEHICLE_FIELD_RADIUS,
        1
      );
    }

    if (this.state.repulsiveForceNewTotal) {
      this.drawVector(
        this.vehicle,
        totalRepulsiveForceNew.scaleBy(100).sum(this.vehicle),
        4,
        2,
        COLOR.REPULSIVE_FORCE_NEW
      );
    }
    if (this.state.attractiveForce) {
      // display attractive force direction
      this.drawVector(
        this.vehicle,
        attractiveForce.scaleBy(100).sum(this.vehicle),
        4,
        2,
        COLOR.ATTRACTIVE_FORCE
      );
    }
    if (this.state.repulsiveForceTotal) {
      // display repulsive force direction
      this.drawVector(
        this.vehicle,
        totalRepulsiveForce.scaleBy(100).sum(this.vehicle),
        4,
        2,
        COLOR.REPULSIVE_FORCE
      );
    }
    // display total force direction
    if (this.state.totalForce) {
      this.drawVector(
        this.vehicle,
        totalForce.scaleBy(100).sum(this.vehicle),
        4,
        2,
        COLOR.TOTAL_FORCE
      );
    }

    for (const obstacleRepulsiveForce of this.vehicle.repulsiveForces) {
      const [obstacleRepulsedForceVector, obstacleRepulsedForceNewVector] =
        obstacleRepulsiveForce;

      if (this.state.repulsiveForce) {
        this.drawVector(
          this.vehicle,
          obstacleRepulsedForceVector.scaleBy(100).sum(this.vehicle),
          2,
          1,
          COLOR.REPULSIVE_FORCE
        );
      }

      if (this.state.repulsiveForceNew) {
        this.drawVector(
          this.vehicle,
          obstacleRepulsedForceNewVector.scaleBy(100).sum(this.vehicle),
          2,
          1,
          COLOR.REPULSIVE_FORCE_NEW
        );
      }
    }
  }

  drawTarget({ x, y }) {
    this.drawPoint(x, y, 20, "red");
  }

  drawVehicle(vehicle) {
    const { x, y, r, vx, vy } = vehicle;
    const width = 30;
    const height = 40;

    const speedVector = new Vector(vx, vy).normalize().scaleBy(height);
    this.drawLine(
      x,
      y,
      x + speedVector.x,
      y + speedVector.y,
      width,
      COLOR.VEHICLE
    );

    // this.#drawPoint(x, y, r, '#1bb21b');
  }

  drawTargetVectorsFlow(r) {
    const xPoints = 50;
    const yPoints = 50;
    const spaceX = CanvasRenderer.WIDTH / xPoints;
    const spaceY = CanvasRenderer.HEIGHT / yPoints;
    const arrowScale = 2;

    for (let i = 0; i <= xPoints; i++) {
      for (let j = 0; j <= yPoints; j++) {
        const vectorAsVehicle = new Vehicle(i * spaceX, j * spaceY, r);

        vectorAsVehicle.setAtractiveForce(this.target);
        vectorAsVehicle.attractiveForce =
          vectorAsVehicle.attractiveForce.scaleBy(arrowScale);
        vectorAsVehicle.setObstacles(
          this.obstacles.getObstaclesInVehicleRadius(vectorAsVehicle)
        );

        vectorAsVehicle.setRepulsiveForces();
        vectorAsVehicle.setTotalRepulsiveForces();

        vectorAsVehicle.totalRepulsiveForce =
          vectorAsVehicle.totalRepulsiveForce.scaleBy(arrowScale);
        vectorAsVehicle.totalRepulsiveForceNew =
          vectorAsVehicle.totalRepulsiveForceNew.scaleBy(arrowScale);
        vectorAsVehicle.setTotalForce();

        this.drawVector(
          vectorAsVehicle,
          vectorAsVehicle.sum(vectorAsVehicle.totalForce.scaleBy(arrowScale)),
          1.3,
          1,
          COLOR.VECTORS_FLOW
        );
      }
    }
  }
}

export class CanvasGraphicRenderer extends Canvas {
  /**
   * @param {function} fx 
   * @param {{maxY, maxX, stepX, stepY}} opts 
   */
  constructor(canvas, fx, opts={}) {
    super(canvas, canvas.width, canvas.height);
    this.fx = fx;

    this.maxY = opts.maxY || this.getYMax() || 10;
    this.maxX = opts.maxX || 10;
    this.stepX = opts.stepX || this.maxX / 10;
    this.stepY = opts.stepY || this.maxY / 10;

    this.xScale = 1;
    this.yScale = 1;

    this.init();
  }

  init() {
    this.drawAxis();
    this.construct();
  }

  update() {
    this.stepX = this.maxX / 10;
    this.stepY = this.maxY / 10;
    this.clear();
    this.init();
  }

  getYMax() {
    return this.fx(0)
  }

  // getXMaxForLimit(fx, limit) {
  //   const xPixelToValue = (currXpx) => this.maxX / (this.canvas.width / (currXpx));
  //   let xForY;
  //   let xValueForY;
    
  //   for (let i = 0; i < this.canvas.width; i++) {
  //     xValueForY = xPixelToValue(i)
  //     xForY = fx(
  //       xValueForY
  //     )
  //     if (xForY < limit) break;
  //   }

  //   return xValueForY;
  // }

  drawAxis = () => {
    const startYforX = this.canvas.height - 2;
    const startXforY = 0;
    const valueOnY = (this.canvas.height) / (this.canvas.height/ this.maxY);
    const valueOnX = (this.canvas.width) / (this.canvas.width/ this.maxX);
    const shiftY = 8;
    const oxLineWidth = 0.3;
    const oyLineWidth = 0.3;
    const oxLineColor = 'black';
    const oyLineColor = 'black';
    // y axis
    for (let y = 0; y <= valueOnY/this.stepY; y++) {
      const step = (this.canvas.height/valueOnY)*y*this.stepY - shiftY;
      const position = this.canvas.height - step;
      // const maxValuesOnSideY = valueOnY/2;
      // let num = 0;
      // if (position < this.canvas.height / 2) {
      //   num = i - maxValuesOnSideY;
      // }
      // if (position > this.canvas.height / 2) {
      //   num = maxValuesOnSideY - i;
      // }
      this.drawLine(0, position, this.canvas.width, position, oyLineWidth, oyLineColor);
      // this.text(centerX, position, num);
      this.text(startXforY, position, (y*this.stepY).toFixed(1), { textAlign: "start", size: 12 });
    }
    // x axis
    for (let x = 0; x <= valueOnX/this.stepX; x++) {
      const step = (this.canvas.width/valueOnX)*x*this.stepX ;
      const position = step;

      this.drawLine(position, 0, position, this.canvas.height, oxLineWidth, oxLineColor);
      this.text(position, startYforX, (x*this.stepX).toFixed(1), {textAlign: "end", size: 12});
    }
  }

  construct = () => {
    const lineWidth = 2;
    const lineColor = 'red';
    const xPixelToValue = (currXpx) => this.maxX /(this.canvas.width / (currXpx));
    const yValueToPixel = (val) => this.canvas.height - (this.canvas.height * val) / this.maxY

    let prev;

    for (let i = this.canvas.width; i >= 0; i--) {
      const currX = i;
      const currY =  yValueToPixel(
        this.fx(
          xPixelToValue(i)
        )
      );

      if (!prev) { 
        prev = {
          x: currX,
          y: currY
        }
      }

      this.drawLine(
        prev.x,
        prev.y,
        currX, 
        currY, 
        lineWidth, 
        lineColor
      );

      prev.x = currX;
      prev.y = currY;
    }
  }
  
  scaleX = (isAdd) => {
    if (!isAdd) { 
      this.maxX += this.stepX;
    } else {
      this.maxX -= this.stepX;
    }

    this.update();
  }

  scaleY = (isAdd) => {
    if (!isAdd) { 
      this.maxY += this.stepY;
    } else {
      this.maxY -= this.stepY;
    }

    this.update();
  }
}
