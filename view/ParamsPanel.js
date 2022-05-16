import { COLOR } from "../consts.js";
import html from "../preact/index.js";
import Utils from "../Utils.js";
import {
    CanvasGraphic,
    Checkbox,
    Details,
    InputDisplay,
    Select,
    Table,
    Title,
} from "./Components.js";


const ParamsPanel = ({ vehicle, canvasParamStates, canvasParamsActions, canvasParamsPlotlyActions }) => {
    const style = {
        paramsWrapper: {
            fontSize: "0.9rem",
            top: '0.2rem',
            position: "fixed",
            zIndex: "999",
            display: "inline-block",
            marginTop: "0.2rem",
        },
    };

    const totalForce = vehicle.totalForce.mag().toPrecision(3);
    const attractiveForce = vehicle.attractiveForce.mag().toPrecision(3);
    const repulsiveForceTotal = vehicle.totalRepulsiveForce
        .mag()
        .toPrecision(3);
    const repulsiveForceNewTotal = vehicle.totalRepulsiveForceNew
        .mag()
        .toPrecision(3);
    // angle between Total force and Attractive force (theta)
    const theta = Utils.toDegree(
        vehicle.attractiveForce.angle(vehicle.totalForce)
    ).toPrecision(3);
    // angle between Total force and Repulsive force (sigma)
    const sigma = Utils.toDegree(
        Utils.normalizeAngle(
            vehicle.totalRepulsiveForce.fullAngle(vehicle.totalForce)
        )
    ).toPrecision(3);
    // angle between Attractive force and Repulsive force (gamma)
    const gamma = Utils.toDegree(
        Utils.normalizeAngle(
            vehicle.totalRepulsiveForce.fullAngle(vehicle.attractiveForce)
        )
    ).toPrecision(3);


    return html`
        <div style=${style.paramsWrapper}>
            ${Details({
                summary: "Params",
                children: [
                    Details({
                        summary: "Vehicle",
                        children: [
                            Table({
                                tableBody: [
                                    [
                                        InputDisplay({
                                            value: vehicle.x,
                                        }),
                                        Title({ title: "X", text: "X" }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: vehicle.y,
                                        }),
                                        Title({ title: "Y", text: "Y" }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: vehicle.distance.toFixed(3),
                                        }),
                                        Title({ title: "Distance traveled", text: "Distance traveled" }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: vehicle.endTime ? Utils.toSeconds(vehicle.endTime - vehicle.startTime).toPrecision(3) : 'Not reached yet',
                                        }),
                                        Title({ title: "Target Destination Time", text: "Target Destination Time" }),
                                    ],
                                    [
                                        [],
                                        Title({ title: "Forces", text: "Forces:" }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: totalForce,
                                        }),
                                        Title({
                                            title: "Total Force/Speed",
                                            text: "F(tot) or V",
                                        }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: attractiveForce,
                                        }),
                                        Title({
                                            title: "Attractive Force",
                                            text: "F(att)",
                                        }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: repulsiveForceTotal,
                                        }),
                                        Title({
                                            title: "Repulsive Force",
                                            text: "F(rep) total",
                                        }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: repulsiveForceNewTotal,
                                        }),
                                        Title({
                                            title: "Repulsive New Force",
                                            text: "F(rep_new) total",
                                        }),
                                    ],
                                    [
                                        [],
                                        Title({ title: "Angles", text: "Angles:" }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: theta,
                                            degree: true,
                                        }),
                                        Title({
                                            text: "F(att) and F(tot) angle (Θ)",
                                        }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: sigma,
                                            degree: true,
                                        }),
                                        Title({
                                            text: "F(rep) and F(tot) angle (σ)",
                                        }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: gamma,
                                            degree: true,
                                        }),
                                        Title({
                                            text: "F(att) and F(rep) angle (γ)",
                                        }),
                                    ],
                                ],
                            }),
                            Details({
                                open: false,
                                summary: "Graphics",
                                children: [
                                    Title({text: 'K(sigma)'}),
                                    html`<${CanvasGraphic} opts=${{quantityX: 6, maxX: 8}} width="320" height="150" xTitle=σ yTitle="radian" fx=${vehicle.constructor.kSigma} id="sigma"/>`,
                                ]
                            })
                        ],
                    }),
                    Details({
                        summary: "Obstacles",
                        children: Table({
                            tableBody: [
                                [
                                    Select({
                                        options: [
                                            'Default',
                                            'Walls'
                                        ],
                                        defaultValue: canvasParamStates.obstaclesMap,
                                        onChange: (value) => {
                                            canvasParamStates.obstaclesMap = value;
                                            canvasParamsActions.obstaclesMap(value);
                                        },
                                    })
                                ]
                            ]
                        })
                    }),
                    Details({
                        summary: "Canvas",
                        children: Table({
                            tableBody: [
                                [
                                    Checkbox({
                                        title: "Vectors Flow",
                                        text: "Vectors Flow",
                                        id: "vectorsFlow",
                                        color: COLOR.VECTORS_FLOW,
                                        checked: canvasParamStates.vectorsFlow,
                                        onChange: (checked) => canvasParamStates.vectorsFlow = checked,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "Vehicle",
                                        text: "Vehicle",
                                        id: "vehicle",
                                        color: COLOR.VEHICLE,
                                        checked: canvasParamStates.vehicle,
                                        onChange: (checked) => canvasParamStates.vehicle = checked,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "Vehicle Field Radius",
                                        text: "Vehicle Field Radius",
                                        id: "vehicleFieldRadius",
                                        color: COLOR.VEHICLE_FIELD_RADIUS,
                                        checked: canvasParamStates.vehicleFieldRadius,
                                        onChange: (checked) => canvasParamStates.vehicleFieldRadius = checked,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "F(tot) or V",
                                        text: "F(tot) or V",
                                        id: "totalForce",
                                        color: COLOR.TOTAL_FORCE,
                                        checked: canvasParamStates.totalForce,
                                        onChange: (checked) => canvasParamStates.totalForce = checked,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "F(att)",
                                        text: "F(att)",
                                        id: "attractiveForce",
                                        color: COLOR.ATTRACTIVE_FORCE,
                                        checked: canvasParamStates.attractiveForce,
                                        onChange: (checked) => canvasParamStates.attractiveForce = checked,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "F(rep) total",
                                        text: "F(rep) total",
                                        id: "repulsiveForceTotal",
                                        color: COLOR.REPULSIVE_FORCE,
                                        checked: canvasParamStates.repulsiveForceTotal,
                                        onChange: (checked) => canvasParamStates.repulsiveForceTotal = checked,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "F(rep_new) total",
                                        text: "F(rep_new) total",
                                        id: "repulsiveForceNewTotal",
                                        color: COLOR.REPULSIVE_FORCE_NEW,
                                        checked: canvasParamStates.repulsiveForceNewTotal,
                                        onChange: (checked) => canvasParamStates.repulsiveForceNewTotal = checked,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "F(rep) each obstacle",
                                        text: "F(rep) each obstacle",
                                        id: "repulsiveForceEach",
                                        color: COLOR.REPULSIVE_FORCE,
                                        checked: canvasParamStates.repulsiveForce,
                                        onChange: (checked) => canvasParamStates.repulsiveForce = checked,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "F(rep_new) each obstacle",
                                        text: "F(rep_new) each obstacle",
                                        id: "repulsiveForceNewEach",
                                        color: COLOR.REPULSIVE_FORCE_NEW,
                                        checked: canvasParamStates.repulsiveForceNew,
                                        onChange: (checked) => canvasParamStates.repulsiveForceNew = checked,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "Obstacles Field (R)",
                                        text: "Obstacles Field (R)",
                                        id: "obstaclesField",
                                        color: COLOR.OBSTACLES_FIELD_RADIUS,
                                        checked: canvasParamStates.obstaclesFieldRadius,
                                        onChange: (checked) => canvasParamStates.obstaclesFieldRadius = checked,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "Obstacles",
                                        text: "Obstacles",
                                        id: "obstacles",
                                        color: COLOR.OBSTACLE,
                                        checked: canvasParamStates.obstacles,
                                        onChange: (checked) => canvasParamStates.obstacles = checked,
                                    }),
                                ],
                            ],
                        }),
                    }),
                    Details({
                        summary: "Force surfaces (Plotly.js)",
                        children: Table({
                            tableBody: [
                                [
                                    Checkbox({
                                        title: "Attractive Force",
                                        text: "Attractive Force",
                                        id: "Attractive-plotly",
                                        onChange: canvasParamsPlotlyActions.attractiveForce,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "Repulsive Force",
                                        text: "Repulsive Force",
                                        id: "Repulsive-plotly",
                                        onChange: canvasParamsPlotlyActions.repulsiveForce,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "Repulsive New Force",
                                        text: "Repulsive New Force",
                                        id: "RepulsiveNew-plotly",
                                        onChange: canvasParamsPlotlyActions.repulsiveForceNew,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "Totalize selected",
                                        text: "Totalize selected",
                                        id: "Totalize selected",
                                        onChange: canvasParamsPlotlyActions.totalizeSelected,
                                    }),
                                ],
                                [
                                    Checkbox({
                                        title: "Force Traces",
                                        text: "Force Traces",
                                        id: "Force Traces",
                                        onChange: canvasParamsPlotlyActions.forceTraces,
                                    }),
                                ]
                            ],
                        }),
                    }),
                ],
            })}
        </div>
    `;
};

export default ParamsPanel;
