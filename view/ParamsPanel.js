import { COLOR } from "../consts.js";
import html from "../preact/index.js";
import Utils from "../Utils.js";
import {
    CanvasGraphic,
    CheckboxWithColor,
    Details,
    InputDisplay,
    Select,
    Table,
    Title,
} from "./Components.js";

const ParamsPanel = ({ vehicle, canvasParamsStates, canvasParamsActions }) => {
    const style = {
        paramsWrapper: {
            fontSize: "0.9rem",
            position: "relative",
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
                                    html`<${CanvasGraphic} width="360" height="150" xTitle=σ yTitle="radian" fx=${vehicle.constructor.kSigma} id="sigma"/>`
                                ]
                            })
                        ],
                    }),
                    Details({
                        summary: "Canvas",
                        children: Table({
                            tableBody: [
                                [
                                    CheckboxWithColor({
                                        title: "Vectors Flow",
                                        text: "Vectors Flow",
                                        id: "vectorsFlow",
                                        color: COLOR.VECTORS_FLOW,
                                        checked: canvasParamsStates.vectorsFlow,
                                        onChange: (checked) => canvasParamsStates.vectorsFlow = checked,
                                    }),
                                ],
                                [
                                    CheckboxWithColor({
                                        title: "Vehicle",
                                        text: "Vehicle",
                                        id: "vehicle",
                                        color: COLOR.VEHICLE,
                                        checked: canvasParamsStates.vehicle,
                                        onChange: (checked) => canvasParamsStates.vehicle = checked,
                                    }),
                                ],
                                [
                                    CheckboxWithColor({
                                        title: "Vehicle Field Radius",
                                        text: "Vehicle Field Radius",
                                        id: "vehicleFieldRadius",
                                        color: COLOR.VEHICLE_FIELD_RADIUS,
                                        checked: canvasParamsStates.vehicleFieldRadius,
                                        onChange: (checked) => canvasParamsStates.vehicleFieldRadius = checked,
                                    }),
                                ],
                                [
                                    CheckboxWithColor({
                                        title: "F(tot) or V",
                                        text: "F(tot) or V",
                                        id: "totalForce",
                                        color: COLOR.TOTAL_FORCE,
                                        checked: canvasParamsStates.totalForce,
                                        onChange: (checked) => canvasParamsStates.totalForce = checked,
                                    }),
                                ],
                                [
                                    CheckboxWithColor({
                                        title: "F(att)",
                                        text: "F(att)",
                                        id: "attractiveForce",
                                        color: COLOR.ATTRACTIVE_FORCE,
                                        checked: canvasParamsStates.attractiveForce,
                                        onChange: (checked) => canvasParamsStates.attractiveForce = checked,
                                    }),
                                ],
                                [
                                    CheckboxWithColor({
                                        title: "F(rep) total",
                                        text: "F(rep) total",
                                        id: "repulsiveForceTotal",
                                        color: COLOR.REPULSIVE_FORCE,
                                        checked: canvasParamsStates.repulsiveForceTotal,
                                        onChange: (checked) => canvasParamsStates.repulsiveForceTotal = checked,
                                    }),
                                ],
                                [
                                    CheckboxWithColor({
                                        title: "F(rep_new) total",
                                        text: "F(rep_new) total",
                                        id: "repulsiveForceNewTotal",
                                        color: COLOR.REPULSIVE_FORCE_NEW,
                                        checked: canvasParamsStates.repulsiveForceNewTotal,
                                        onChange: (checked) => canvasParamsStates.repulsiveForceNewTotal = checked,
                                    }),
                                ],
                                [
                                    CheckboxWithColor({
                                        title: "F(rep) each obstacle",
                                        text: "F(rep) each obstacle",
                                        id: "repulsiveForceEach",
                                        color: COLOR.REPULSIVE_FORCE,
                                        checked: canvasParamsStates.repulsiveForce,
                                        onChange: (checked) => canvasParamsStates.repulsiveForce = checked,
                                    }),
                                ],
                                [
                                    CheckboxWithColor({
                                        title: "F(rep_new) each obstacle",
                                        text: "F(rep_new) each obstacle",
                                        id: "repulsiveForceNewEach",
                                        color: COLOR.REPULSIVE_FORCE_NEW,
                                        checked: canvasParamsStates.repulsiveForceNew,
                                        onChange: (checked) => canvasParamsStates.repulsiveForceNew = checked,
                                    }),
                                ],
                                [
                                    CheckboxWithColor({
                                        title: "Obstacles Field (R)",
                                        text: "Obstacles Field (R)",
                                        id: "obstaclesField",
                                        color: COLOR.OBSTACLES_FIELD_RADIUS,
                                        checked: canvasParamsStates.obstaclesFieldRadius,
                                        onChange: (checked) => canvasParamsStates.obstaclesFieldRadius = checked,
                                    }),
                                ],
                                [
                                    CheckboxWithColor({
                                        title: "Obstacles",
                                        text: "Obstacles",
                                        id: "obstacles",
                                        color: COLOR.OBSTACLE,
                                        checked: canvasParamsStates.obstacles,
                                        onChange: (checked) => canvasParamsStates.obstacles = checked,
                                    }),
                                ],
                            ],
                        }),
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
                                        defaultValue: canvasParamsStates.obstaclesMap,
                                        onChange: (value) => {
                                            canvasParamsStates.obstaclesMap = value;
                                            canvasParamsActions.obstaclesMap(value);
                                        },
                                    })
                                ]
                            ]
                        })
                    })
                ],
            })}
        </div>
    `;
};

export default ParamsPanel;
