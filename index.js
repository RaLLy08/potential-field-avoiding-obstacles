import { CanvasRenderer } from './Canvas.js';
import { Obstacles, vehicle, target } from './Entity.js';
import html, { Component, render } from './preact/index.js';
import ParamsPanel from './view/ParamsPanel.js';
import { withLsSubscribe } from './view/helpers.js';
import { CanvasComponent } from './view/Components.js';
import PlotlyRenderer from './Plotly.js';
import FrameRates from './FrameRates.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './consts.js';

// mutatable params 
const canvasParamStates = withLsSubscribe({
  vectorFlow: 0,
  totalForce:0,
  vectorsFlow:0,
  attractiveForce:0,
  repulsiveForce:0,
  repulsiveForceTotal: 0,
  repulsiveForceNew:0,
  repulsiveForceEach:0,
  repulsiveForceNewEach:0,
  repulsiveForceTotalEach:0,
  obstaclesFieldRadius:0,
  vehicle: 1,
  vehicleFieldRadius:0,
  obstacles: 1,
  obstaclesMap: 0,
  selectedObstacleIdx: 0,
});

Object.assign(canvasParamStates, {
  offRepulsiveForce: 0,
  offRepulsiveForceNew: 0,
})

const obstacles = new Obstacles(
    Obstacles.MAPS[canvasParamStates.obstaclesMap]
);

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

const frameRates = new FrameRates();


const paramsPanelProps = {
  vehicle,
  obstacles,
  target,
  canvasParamStates,
  canvasParamsActions,
  canvasParamsPlotlyActions,
  frameRates,
}


class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const canvas = document.getElementById('canvas');
    this.canvasRenderer = new CanvasRenderer(canvas, canvasParamStates, vehicle, target, obstacles);
    this.plotlyRenderer = new PlotlyRenderer(canvasParamsPlotlyActions, vehicle, target, obstacles);

    frameRates.setCallFn(this.frame);
    frameRates.start();

    
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
  }

  frame = () => {
    this.canvasRenderer.frame();
    const lostSpeed = (1000 / frameRates.getFPMS()) / 60;

    if (!pause) {
        this.plotlyRenderer.frame();
        vehicle.setAtractiveForce(target);
        vehicle.setObstacles(obstacles.getObstaclesInVehicleRadius(vehicle))
        vehicle.move(lostSpeed, canvasParamStates.offRepulsiveForce, canvasParamStates.offRepulsiveForceNew);
        vehicle.checkReachedTarget(target);
    };

    this.forceUpdate();
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
            height: CANVAS_HEIGHT,
            width: CANVAS_WIDTH,
          })}
        </div>
        <div id='plotly-force-traces' style="display:none; width: 80%; margin-left: auto; margin-right: auto;"></div>
    `;
  }
}


render(html`<${App} />`, document.getElementById('root'));


var pause = false;
var pressed = false;

function onResetVehicle() {
    vehicle.init();
    vehicle.x = 100;
    vehicle.y = CANVAS_HEIGHT / 2;
    canvasParamsPlotlyActions.resetVehicle();
}

function onPauseResume() {
  if (pause) {
    pause = false;
    return;
  }
  pause = true;
}

