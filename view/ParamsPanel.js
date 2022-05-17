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


const ParamsPanel = ({ vehicle, obstacles, target, canvasParamStates, canvasParamsActions, canvasParamsPlotlyActions, frameRates }) => {
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
    ).toFixed();
    // angle between Total force and Repulsive force (sigma)
    const sigma = Utils.toDegree(
        Utils.normalizeAngle(
            vehicle.totalRepulsiveForce.fullAngle(vehicle.totalForce)
        )
    ).toFixed();
    // angle between Attractive force and Repulsive force (gamma)
    const gamma = Utils.toDegree(
        Utils.normalizeAngle(
            vehicle.totalRepulsiveForce.fullAngle(vehicle.attractiveForce)
        )
    ).toFixed();

    const obstacleItems = obstacles.getAll();
    const selectedObstacle = obstacleItems[canvasParamStates.selectedObstacleIdx] || {};

    return html`
        <div class="wrapper" style=${style.paramsWrapper}>
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
                                            Title({ title: "x", text: "x", fontSize: '18px' }),
                                            InputDisplay({
                                                value: vehicle.y,
                                            }),
                                            Title({ title: "y", text: "y", fontSize: '18px' }),
                                        ]
                                ]
                            }),
                            Table({
                                tableBody: [
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
                                        Title({ title: "Angles", text: "Angles", bold: true }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: theta,
                                            degree: true,
                                        }),
                                        Title({
                                            text: "F(att) and F(tot) (Θ)",
                                        }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: sigma,
                                            degree: true,
                                        }),
                                        Title({
                                            text: "F(rep) and F(tot) (σ)",
                                        }),
                                    ],
                                    [
                                        InputDisplay({
                                            value: gamma,
                                            degree: true,
                                        }),
                                        Title({
                                            text: "F(att) and F(rep) (γ)",
                                        }),
                                    ],
                                    [
                                        Title({ title: "Forces", text: "Forces", bold: true }),
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
                                ],
                            }),
                            Table({
                                tableBody: [
                                    [
                                        Checkbox({
                                            title: "Disable Repulsive Force",
                                            text: "Disable Repulsive Force",
                                            id: "Disable Repulsive Force-plotly",
                                            onChange: (value) => {
                                                canvasParamStates.offRepulsiveForce = value;
                                            },
                                        }),
                                    ],
                                    [
                                        Checkbox({
                                            title: "Disable Repulsive New Force",
                                            text: "Disable Repulsive New Force",
                                            id: "Disable Repulsive New Force-plotly",
                                            onChange: (value) => {
                                                canvasParamStates.offRepulsiveForceNew = value;
                                            },
                                        }),
                                    ],  
                                ]
                            }),
                            Details({
                                open: false,
                                summary: "Graphics",
                                children: [
                                    Table({
                                        tableBody: [
                                            [
                                                html`<${CanvasGraphic} opts=${{quantityX: 6, maxX: 8}} width="320" height="150" yTitle=K(σ) xTitle="radian" fx=${vehicle.constructor.kSigma} id="sigma"/>`,
                                            ]
                                        ]
                                    })
                                ]
                            })
                        ],
                    }),
                    Details({
                        summary: "Obstacles",
                        open: false,
                        children: [
                            [
                                Table({
                                    tableBody: [
                                        [
                                            Select({
                                                defaultValue: canvasParamStates.selectedObstacleIdx,
                                                options: obstacleItems.map((el, i) => {
                                                    return "Obstacle: " + i
                                                }),
                                                onChange: (value) => canvasParamStates.selectedObstacleIdx = value,
                                            }),
                                            Title({ title: "Selected obstacle", text: "Selected obstacle" }),
                                        ]
                                    ]
                                }),
                                Table({
                                    tableBody: [
                                        [
                                            InputDisplay({
                                                value: selectedObstacle.x,
                                            }),
                                            Title({ title: "x", text: "x", fontSize: '18px' }),
                                            InputDisplay({
                                                value: selectedObstacle.y,
                                            }),
                                            Title({ title: "y", text: "y", fontSize: '18px' }),
                                        ]
                                    ]
                                }),
                                Table({
                                    tableBody: [
                                        [
                                            [
                                                InputDisplay({
                                                    value: selectedObstacle.fieldRadius,
                                                }),
                                                Title({
                                                    text: "Field Radius",
                                                }),
                                            ],
                                            [
                                                InputDisplay({
                                                    value: selectedObstacle.maxRepulsiveForce,
                                                }),
                                                Title({
                                                    text: "Max Repulsive Force",
                                                }),
                                            ],
                                        ],
                                    ]
                                }),

                                Table({ 
                                    tableBody: [
                                        [
                                            InputDisplay({
                                                value: selectedObstacle.distributionWidth?.toPrecision(4),
                                                maxWidth: '68px'
                                            }),
                                            Title({
                                                text: "Distribution Width",
                                            }),
                                        ]
                                    ]
                                }),
                                Details({
                                    summary: 'Graphics',
                                    children: [
                                        Table({
                                            tableBody: [
                                                [
                                                    html`<${CanvasGraphic} opts=${{quantityX: 6, maxX: selectedObstacle.fieldRadius, maxY: selectedObstacle.maxRepulsiveForce}} width="320" height="150" yTitle=exp(-b*d^2) xTitle=distance
                                                        fx=${selectedObstacle.repulsiveForce} id=${"exp" + canvasParamStates.selectedObstacleIdx}/>`,
                                                ]
                                            ]
                                        })
                                    ]
                                })
                            ],
                            [
                                Details({
                                    summary: 'Maps',
                                    children: [
                                        Table({
                                            tableBody: [
                                                [
                                                    Select({
                                                        options: [
                                                            'Default',
                                                            'Walls',
                                                            'Single Obstacle'
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
                                    ]
                                })
                            ]
                        ]
                    }),
                    Details({
                        summary: "Target",
                        open: false,
                        children: [
                            Details({
                                summary: "Graphics",
                                children: [
                                    Table({
                                        tableBody: [
                                            [
                                                html`<${CanvasGraphic} opts=${{quantityX: 6, maxX: 600, maxY: 4}} width="320" height="150" xTitle=distance yTitle="[1 - exp(-b*d^2)]" fx=${target.attractionForce} id="target"/>`,
                                            ]
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    Details({
                        summary: "Canvas",
                        children: Table({
                            tableBody: [
                                [
                                    Title({text: `FPS ${frameRates.constructor.toFps(frameRates.getFPMS()).toFixed(3)}`}),
                                ],
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
        <style>
            .wrapper {
                height: 100vh;
                overflow: auto;
            }
            .wrapper::-webkit-scrollbar {
                display: none;
            }
            .wrapper {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }

        </style>
    `;
};

export default ParamsPanel;
