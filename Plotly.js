import 'https://cdn.plot.ly/plotly-2.12.1.min.js';
import { CanvasRenderer } from './Canvas.js';
import { Vehicle } from './Entity.js';

export default class PlotlyRenderer {
  constructor(id, actions, vehicle, target, obstacles) {
    this.id = id;
    this.vehicle = vehicle;
    this.target = target;
    this.obstacles = obstacles;

    actions.attractiveForce = this.onAttractiveForce;
    actions.repulsiveForce = this.onRepulsiveForce;
    actions.repulsiveForceNew = this.onRepulsiveForceNew;

    this.attractiveForce = 0;
    this.repulsiveForce = 0;
    this.repulsiveForceNew = 0;

    this.attractiveForcePlotly = {z: [], type: 'surface', name: 'Attractive', opacity: 0.5, 
      contours: {
        z: {
          show:true,
          usecolormap: true,
          highlightcolor:"#42f462",
          project:{z: true}
        }}
    };
    this.repulsiveForcePlotly = {z: [], type: 'surface', name: 'Repulsive', opacity: 0.5,contours: {
      z: {
        show:true,
        usecolormap: true,
        highlightcolor:"#42f462",
        project:{z: true}
      }}};
    this.repulsiveForceNewPlotly = {z: [], type: 'surface', name: 'Repulsive New',opacity: 0.5, contours: {
      z: {
        show:true,
        usecolormap: true,
        highlightcolor:"#42f462",
        project:{z: true}
      }}};
    this.layout = {
      title: 'Attractive and Repulsive Forces',

    }
  }

  onAttractiveForce = (state) => {
    this.attractiveForce = state;

    if (!state) {
      this.attractiveForcePlotly.z.length = 0;
    }

    this.update();
  }
  onRepulsiveForce = (state) => {
    this.repulsiveForce = state;
    if (!state) {
      this.repulsiveForcePlotly.z.length = 0;
    }

    this.update();
  }
  onRepulsiveForceNew = (state) => {
    this.repulsiveForceNew = state;
    
    if (!state) {
      this.repulsiveForceNewPlotly.z.length = 0;
    }

    this.update();
  }

  update() {
    const plotly = document.getElementById(this.id);

    if ([this.attractiveForce, this.repulsiveForce, this.repulsiveForceNew].some((el) => el)) {
      plotly.style.display = 'block';
    } else {
      plotly.style.display = 'none';
    }

    this.plotlyDrawForces();
  }

  plotlyDrawForces() {
    const reduceCoef = 2;

    const xPoints = CanvasRenderer.WIDTH / reduceCoef;
    const yPoints = CanvasRenderer.HEIGHT / reduceCoef;
    const spaceX = CanvasRenderer.WIDTH / xPoints;
    const spaceY = CanvasRenderer.HEIGHT / yPoints;

    const isAttr = this.attractiveForce && !this.attractiveForcePlotly.z.length;
    const isRep = this.repulsiveForce && !this.repulsiveForcePlotly.z.length;
    const isRepNew = this.repulsiveForceNew && !this.repulsiveForceNewPlotly.z.length;

    for (let i = 0; i <= xPoints; i++) {
      isAttr && this.attractiveForcePlotly.z.push([]);
      isRep && this.repulsiveForcePlotly.z.push([]);
      isRepNew && this.repulsiveForceNewPlotly.z.push([]);
      
      for (let j = 0; j <= yPoints; j++) {
        const vectorAsVehicle = new Vehicle(i * spaceX, j * spaceY, vehicle.r);
        vectorAsVehicle.setAtractiveForce(this.target);

        vectorAsVehicle.setObstacles(
          this.obstacles.getObstaclesInVehicleRadius(vectorAsVehicle)
        );

        vectorAsVehicle.setRepulsiveForces();
        vectorAsVehicle.setTotalRepulsiveForces();
        vectorAsVehicle.setTotalForce();


        isAttr && this.attractiveForcePlotly.z[i].push(vectorAsVehicle.attractiveForce.mag()/ reduceCoef);
        isRep && this.repulsiveForcePlotly.z[i].push(vectorAsVehicle.totalRepulsiveForce.mag()/ reduceCoef);
        isRepNew && this.repulsiveForceNewPlotly.z[i].push(vectorAsVehicle.totalRepulsiveForceNew.mag()/ reduceCoef);
      }
    }



    Plotly.newPlot('plotly', [this.attractiveForcePlotly, this.repulsiveForcePlotly, this.repulsiveForceNewPlotly], this.layout);
  }
}

