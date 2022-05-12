import { CanvasRenderer } from './Canvas.js';
import { Obstacles, Vehicle, Target } from './Entity.js';
import html, { Component, render } from './preact/index.js';
import { CanvasComponent } from './view/Components.js';
import ParamsPanel from './view/ParamsPanel.js';
import { withLsSubscribe } from './view/helpers.js';

// mutatable params 
const canvasParamsStates = withLsSubscribe({
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
    Obstacles.MAPS[canvasParamsStates.obstaclesMap]
);
const target = new Target(1000, CanvasRenderer.HEIGHT/2, 2.5, 0.00015);
const vehicle = new Vehicle(100, CanvasRenderer.HEIGHT/2, 150)



const canvasParamsActions = {
  obstaclesMap: (value) => obstacles.set(Obstacles.MAPS[value])
}

const paramsPanel = {
  vehicle,
  canvasParamsStates,
  canvasParamsActions
}

class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const canvas = document.getElementById('canvas');
    
    this.canvasRenderer = new CanvasRenderer(canvas, canvasParamsStates, vehicle, target, obstacles);
    

    this.canvasRenderer.element.onmousedown = (e) => {
      pressed = true;
      // obstacles.add(new Obstacle(e.offsetX, e.offsetY, 100, 2, 0.00015, 18))
    }
  
    this.canvasRenderer.element.onmousemove = (e) => {
        if (!pressed) return;
        target.x = e.offsetX;
        target.y = e.offsetY;
    }
    
    this.canvasRenderer.element.onmouseup = (e) => {
        pressed = false;
    }

    this.frame();
  }

  frame = () => {
    this.canvasRenderer.frame();
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
        ${ParamsPanel(paramsPanel)}
        ${CanvasComponent({
            id: 'canvas',
            onPauseResume,
            onResetVehicle,
            isPaused: pause,
        })}
    `;
  }
}


render(html`<${App} />`, document.body);


var pause = false;
var pressed = false;

function onResetVehicle() {
    vehicle.x = 100;
    vehicle.y = CanvasRenderer.HEIGHT/2;
}

function onPauseResume() {
  if (pause) {
    pause = false;
    return;
  }
  pause = true;
}

