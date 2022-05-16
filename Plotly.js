import "https://cdn.plot.ly/plotly-2.12.1.min.js";
import { CanvasRenderer } from "./Canvas.js";
import { COLOR } from "./consts.js";
import { Vehicle } from "./Entity.js";

export default class PlotlyRenderer {
    static SURFACES_ID = "plotly";
    static FORCE_TRACE_ID = "plotly-force-traces";

    constructor(actions, vehicle, target, obstacles) {
        this.vehicle = vehicle;
        this.target = target;
        this.obstacles = obstacles;

        actions.attractiveForce = this.onAttractiveForce;
        actions.repulsiveForce = this.onRepulsiveForce;
        actions.repulsiveForceNew = this.onRepulsiveForceNew;
        actions.totalizeSelected = this.onTotalizeSelected;
        actions.updateSurfaces = this.update;
        actions.resetVehicle = this.onResetVehicle;
        actions.forceTraces = this.onForceTraces;

        this.attractiveForce = 0;
        this.repulsiveForce = 0;
        this.repulsiveForceNew = 0;
        this.totalize = 0;
        this.forceTraces = 0;

        this.attractiveForcePlotly = {
            z: [],
            type: "surface",
            name: "Attractive",
            opacity: 0.5,
            contours: {
                z: {
                    show: true,
                    usecolormap: true,
                    highlightcolor: "#42f462",
                    project: { z: true },
                },
            },
            scene: "scene1",
        };
        this.repulsiveForcePlotly = {
            z: [],
            type: "surface",
            name: "Repulsive",
            opacity: 0.5,
            contours: {
                z: {
                    show: true,
                    usecolormap: true,
                    highlightcolor: "#42f462",
                    project: { z: true },
                },
            },
        };
        this.repulsiveForceNewPlotly = {
            z: [],
            type: "surface",
            name: "Repulsive New",
            opacity: 0.5,
            contours: {
                z: {
                    show: true,
                    usecolormap: true,
                    highlightcolor: "#42f462",
                    project: { z: true },
                },
            },
        };
        this.totalForcePlotly = {
            z: [],
            type: "surface",
            name: "Total force",
            contours: {
                z: {
                    show: true,
                    usecolormap: true,
                    highlightcolor: "#42f462",
                    project: { z: true },
                },
            },
        };

        this.layout = {
            title: "Attractive and Repulsive Forces",
        };

        this.totalForceTracePlotly = {
            y: [0],
            x: [0],
            name: "Total Force",
            mode: "lines",
            line: { color: COLOR.TOTAL_FORCE },
        };
        this.repulsiveForceTracePlotly = {
            name: "Repulsive Force",
            y: [0],
            x: [0],
            mode: "lines",
            line: { color: COLOR.REPULSIVE_FORCE },
        };
        this.obstacleFieldCrossingTracePlotly = {
            name: "Crossed Obstacle Fields Value",
            y: [0],
            x: [0],
            mode: "lines",
            line: { color: COLOR.VEHICLE_FIELD_RADIUS },
            xaxis: 'x2',
            yaxis: 'y2',
        };
  
        this.forceTraceLayout = {
            title: "Repulsive and Total Force, Obstacle Crossing Fields",
            xaxis: {
              domain: [0, 1],
              showticklabels: false
            },
            yaxis: {domain: [0.6,1]},
            xaxis2: {
              title: "Distance traveled",
              anchor: 'y2', 
              domain: [0, 1]
            },
            yaxis2: {
              anchor: 'x2', 
              domain: [0, 0.4]
            },
        }  
    };

    frame() {
        if (this.forceTraces) {
            this.forceTracesUpdate();
        }
    }
    forceTracesUpdate() {
      const totalForce = this.vehicle.totalForce.mag().toPrecision(3);
      const repulsiveForceTotal = this.vehicle.totalRepulsiveForce
          .mag()
          .toPrecision(3);

      this.totalForceTracePlotly.y.push(totalForce);
      this.repulsiveForceTracePlotly.y.push(repulsiveForceTotal);
      this.obstacleFieldCrossingTracePlotly.y.push(this.vehicle.obstacles.length);

      this.totalForceTracePlotly.x.push(this.vehicle.distance);
      this.repulsiveForceTracePlotly.x.push(this.vehicle.distance);
      this.obstacleFieldCrossingTracePlotly.x.push(this.vehicle.distance);


        Plotly.newPlot(
            PlotlyRenderer.FORCE_TRACE_ID,
            [
                this.totalForceTracePlotly,
                this.repulsiveForceTracePlotly,
                this.obstacleFieldCrossingTracePlotly
            ],
            this.forceTraceLayout
        );
    }

    onResetVehicle = () => {
        this.totalForceTracePlotly.y.length = 0;
        this.repulsiveForceTracePlotly.y.length = 0;
        this.obstacleFieldCrossingTracePlotly.y.length = 0;

        this.totalForceTracePlotly.x.length = 0;
        this.repulsiveForceTracePlotly.x.length = 0;
        this.obstacleFieldCrossingTracePlotly.x.length = 0;

        this.forceTracesUpdate();
    };

    onForceTraces = (state) => {
        const plotly = document.getElementById(PlotlyRenderer.FORCE_TRACE_ID);


        if (state) {
            plotly.style.display = "block";
            this.forceTracesUpdate();
        } else {
            plotly.style.display = "none";
        }

        plotly.scrollIntoView();
        this.forceTraces = state;
    };

    onTotalizeSelected = (state) => {
        this.totalize = state;
        this.update();
    };

    onAttractiveForce = (state) => {
        this.attractiveForce = state;
        this.update();
    };
    onRepulsiveForce = (state) => {
        this.repulsiveForce = state;
        this.update();
    };
    onRepulsiveForceNew = (state) => {
        this.repulsiveForceNew = state;
        this.update();
    };

    update = () => {
        const plotly = document.getElementById(PlotlyRenderer.SURFACES_ID);

        this.repulsiveForceNewPlotly.z.length = 0;
        this.attractiveForcePlotly.z.length = 0;
        this.repulsiveForcePlotly.z.length = 0;
        this.totalForcePlotly.z.length = 0;

        if (
            [
                this.attractiveForce,
                this.repulsiveForce,
                this.repulsiveForceNew,
            ].some((el) => el)
        ) {
            this.plotlyDrawForces();
            plotly.style.display = "block";

            return;
        } 
        
        plotly.style.display = "none";
    };

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
                this.repulsiveForceNew &&
                    this.repulsiveForceNewPlotly.z.push([]);
            }

            for (let j = 0; j <= yPoints; j++) {
                const vectorAsVehicle = new Vehicle(i * spaceX, j * spaceY);

                if (this.attractiveForce) {
                    vectorAsVehicle.setAtractiveForce(this.target);
                }

                vectorAsVehicle.setObstacles(this.obstacles.getAll());

                if (this.repulsiveForce) {
                    vectorAsVehicle.setRepulsiveForces(!this.repulsiveForceNew);
                    vectorAsVehicle.setTotalRepulsiveForces();
                }

                if (this.totalize) {
                    vectorAsVehicle.setTotalForce();
                    this.totalForcePlotly.z[i].push(
                        vectorAsVehicle.totalForce.mag() / reduceCoef
                    );
                    continue;
                }

                this.attractiveForce &&
                    this.attractiveForcePlotly.z[i].push(
                        vectorAsVehicle.attractiveForce.mag() / reduceCoef
                    );
                this.repulsiveForce &&
                    this.repulsiveForcePlotly.z[i].push(
                        vectorAsVehicle.totalRepulsiveForce.mag() / reduceCoef
                    );
                this.repulsiveForceNew &&
                    this.repulsiveForceNewPlotly.z[i].push(
                        vectorAsVehicle.totalRepulsiveForceNew.mag() /
                            reduceCoef
                    );
            }
        }

        if (this.totalize) {
            Plotly.newPlot(
                PlotlyRenderer.SURFACES_ID,
                [this.totalForcePlotly],
                this.layout
            );
            return;
        }

        Plotly.newPlot(
            PlotlyRenderer.SURFACES_ID,
            [
                this.attractiveForcePlotly,
                this.repulsiveForcePlotly,
                this.repulsiveForceNewPlotly,
            ],
            this.layout
        );
    }
}
