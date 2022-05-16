import { CanvasRenderer } from './Canvas.js';
import { Obstacles, Vehicle, Target } from './Entity.js';
import html, { Component, render } from './preact/index.js';
import ParamsPanel from './view/ParamsPanel.js';
import { withLsSubscribe } from './view/helpers.js';
import { CanvasComponent } from './view/Components.js';
import PlotlyRenderer from './Plotly.js';

// mutatable params 
const canvasParamStates = withLsSubscribe({
  vectorFlow: 0,
  totalForce:0,
  vectorsFlow:0,
  attractiveForce:0,
  repulsiveForceTotal:0,
  repulsiveForceNewTotal:0,
  repulsiveForce:0,
  repulsiveForceNew:0,
  obstaclesFieldRadius:0,
  vehicle: 1,
  vehicleFieldRadius:0,
  obstacles: 1,
  obstaclesMap: 0,
});


const obstacles = new Obstacles(
    Obstacles.MAPS[canvasParamStates.obstaclesMap]
);
const target = new Target(1000, CanvasRenderer.HEIGHT/2, 2.5, 0.00015);
const vehicle = new Vehicle(100, CanvasRenderer.HEIGHT/2, 150)

const canvasParamsPlotlyActions = {
  attractiveForce: () => {},
  repulsiveForce: () => {},
  repulsiveForceNew: () => {},
  totalizeSelected: () => {},
  forceTraces: () => {},
  updateSurfaces: () => {},
  resetVehicle: () => {},
}

const canvasParamsActions = {
  obstaclesMap: (value) => {
    obstacles.set(Obstacles.MAPS[value]);
    canvasParamsPlotlyActions.updateSurfaces();
  }
}


const paramsPanelProps = {
  vehicle,
  canvasParamStates,
  canvasParamsActions,
  canvasParamsPlotlyActions
}


class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const canvas = document.getElementById('canvas');
    this.canvasRenderer = new CanvasRenderer(canvas, canvasParamStates, vehicle, target, obstacles);
    this.plotlyRenderer = new PlotlyRenderer(canvasParamsPlotlyActions, vehicle, target, obstacles);

    canvas.onmousedown = (e) => {
      pressed = true;
    }
  
    canvas.onmousemove = (e) => {
        if (!pressed) return;
        target.x = e.offsetX;
        target.y = e.offsetY;
    }
    
    canvas.onmouseup = (e) => {
        pressed = false;
    }

    this.frame();
  }

  frame = () => {
    this.canvasRenderer.frame();
    !pause && this.plotlyRenderer.frame();
    this.forceUpdate();

    if (!pause) {
        vehicle.setAtractiveForce(target);
        vehicle.setObstacles(obstacles.getObstaclesInVehicleRadius(vehicle))
        vehicle.move();
    };

    window.requestAnimationFrame(this.frame)
  }

  render() {
    return html`
        ${ParamsPanel(paramsPanelProps)}
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;"
        >
          ${CanvasComponent({
            id: 'canvas',
            onPauseResume,
            onResetVehicle,
            isPaused: pause,
          })}
        </div>
        <div id='plotly-force-traces' style="display:none;"></div>
    `;
  }
}


render(html`<${App} />`, document.getElementById('root'));


var pause = false;
var pressed = false;

function onResetVehicle() {
    vehicle.x = 100;
    vehicle.y = CanvasRenderer.HEIGHT/2;
    canvasParamsPlotlyActions.resetVehicle();
}

function onPauseResume() {
  if (pause) {
    pause = false;
    return;
  }
  pause = true;
}

