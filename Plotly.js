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
    actions.totalizeSelected = this.onTotalizeSelected;
    actions.updateSurfaces = this.update;

    this.attractiveForce = 0;
    this.repulsiveForce = 0;
    this.repulsiveForceNew = 0;
    this.totalize = 0;

    this.attractiveForcePlotly = { z: [], type: 'surface', name: 'Attractive', opacity: 0.5, 
      contours: {
        z: {
          show:true,
          usecolormap: true,
          highlightcolor:"#42f462",
          project:{z: true}
        }}, 
        scene: "scene1"
    };
    this.repulsiveForcePlotly = { z: [], type: 'surface', name: 'Repulsive', opacity: 0.5,contours: {
      z: {
        show:true,
        usecolormap: true,
        highlightcolor:"#42f462",
        project:{z: true}
      }}};
    this.repulsiveForceNewPlotly = { z: [], type: 'surface', name: 'Repulsive New',opacity: 0.5, contours: {
      z: {
        show:true,
        usecolormap: true,
        highlightcolor:"#42f462",
        project:{z: true}
      }}};

    this.totalForcePlotly = { z: [], type: 'surface', name: 'Total force', contours: {
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

  onTotalizeSelected = (state) => {
    this.totalize = state;
    this.update();
  }

  onAttractiveForce = (state) => {
    this.attractiveForce = state;
    this.update();
  }
  onRepulsiveForce = (state) => {
    this.repulsiveForce = state;
    this.update();
  }
  onRepulsiveForceNew = (state) => {
    this.repulsiveForceNew = state;
    this.update();
  }

  update = () => {
    const plotly = document.getElementById(this.id);

    this.repulsiveForceNewPlotly.z.length = 0;
    this.attractiveForcePlotly.z.length = 0;
    this.repulsiveForcePlotly.z.length = 0;
    this.totalForcePlotly.z.length = 0;

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
   
    for (let i = 0; i <= xPoints; i++) {
      if (this.totalize) {
        this.totalForcePlotly.z.push([]);
      } else {
        this.attractiveForce && this.attractiveForcePlotly.z.push([]);
        this.repulsiveForce && this.repulsiveForcePlotly.z.push([]);
        this.repulsiveForceNew && this.repulsiveForceNewPlotly.z.push([]);
      }

      
      for (let j = 0; j <= yPoints; j++) {
        const vectorAsVehicle = new Vehicle(i * spaceX, j * spaceY);

        if (this.attractiveForce) {
          vectorAsVehicle.setAtractiveForce(this.target);
        }

        vectorAsVehicle.setObstacles(
          this.obstacles.getAll()
        );

        if (this.repulsiveForce) {
          vectorAsVehicle.setRepulsiveForces(!this.repulsiveForceNew);
          vectorAsVehicle.setTotalRepulsiveForces();
        }

        if (this.totalize) {
          vectorAsVehicle.setTotalForce();
          this.totalForcePlotly.z[i].push(vectorAsVehicle.totalForce.mag()/ reduceCoef);
          continue;
        }

        this.attractiveForce && this.attractiveForcePlotly.z[i].push(vectorAsVehicle.attractiveForce.mag()/ reduceCoef);
        this.repulsiveForce && this.repulsiveForcePlotly.z[i].push(vectorAsVehicle.totalRepulsiveForce.mag()/ reduceCoef);
        this.repulsiveForceNew && this.repulsiveForceNewPlotly.z[i].push(vectorAsVehicle.totalRepulsiveForceNew.mag()/ reduceCoef);
      }
    }

    if (this.totalize) {
      Plotly.newPlot('plotly', [this.totalForcePlotly], this.layout);
      return;
    }

    Plotly.newPlot('plotly', [this.attractiveForcePlotly, this.repulsiveForcePlotly, this.repulsiveForceNewPlotly], this.layout);
  }
}

