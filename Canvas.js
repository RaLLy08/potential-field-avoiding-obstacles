import { COLOR } from "./consts.js";
import Vector from './Vector.js';
import { Vehicle } from './Entity.js';

class Canvas {
  static WIDTH = 1128;
  static HEIGHT = 768;
  #ctx;

  constructor(element) {
      this.element = element;

      this.element.width = Canvas.WIDTH;
      this.element.height = Canvas.HEIGHT;

      this.#ctx = this.element.getContext("2d");
  }

  #drawPoint(x, y, r, color) {
      this.#ctx.beginPath();
      this.#ctx.arc(x, y, r, 0, 2 * Math.PI);
      this.#ctx.fillStyle = color;
      this.#ctx.fill();
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

  drawObstacle({ x, y, r, color }) {
      this.#drawPoint(x, y, r, color);
  }

  drawTarget({ x, y }) {
      this.#drawPoint(x, y, 20, "red");
  }

  drawVehicle(vehicle) {
      const { x, y, r, vx, vy } = vehicle;
      const width = 30;
      const height = 40;

      const speedVector = new Vector(vx, vy).normalize().scaleBy(height);
      this.#drawLine(
          x,
          y,
          x + speedVector.x,
          y + speedVector.y,
          width,
          COLOR.VEHICLE
      );

      // this.#drawPoint(x, y, r, '#1bb21b');
  }
  /**
   *
   * @param {Target} target
   */
  drawTargetVectorsFlow(r) {
      const xPoints = 50;
      const yPoints = 50;
      const spaceX = Canvas.WIDTH / xPoints;
      const spaceY = Canvas.HEIGHT / yPoints;
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
                  vectorAsVehicle.sum(
                      vectorAsVehicle.totalForce.scaleBy(arrowScale)
                  ),
                  1.3,
                  1,
                  COLOR.VECTORS_FLOW
              );
          }
      }
  }
}

export class CanvasRenderer extends Canvas {
  constructor(canvas, state, vehicle, target, obstacles) {
      super(canvas);
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
          this.state.obstacles && this.drawObstacle(obstacle);
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
          const [
              obstacleRepulsedForceVector,
              obstacleRepulsedForceNewVector,
          ] = obstacleRepulsiveForce;

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
}