const vehicleDisplay = (function() {
    class VehicleDisplay {
        static TOTAL_FORCE_ID = 'total-force';
        static ATTRACTIVE_FORCE_ID = 'attractive-force';
        static REPULSIVE_FORCE_ID = 'repulsive-force';
        static REPULSIVE_FORCE_NEW_ID = 'repulsive-force-new';
        static TOTAL_FORCE_COLOR_ID = 'total-force-color';
        static ATTRACTIVE_FORCE_COLOR_ID = 'attractive-force-color';
        static REPULSIVE_FORCE_COLOR_ID = 'repulsive-force-color';
        static REPULSIVE_FORCE_NEW_COLOR_ID = 'repulsive-force-new-color';
        static VECTORS_FLOW_COLOR_ID = 'vectors-flow-color';
        static OBSTACLES_FIELD_RADIUS_COLOR_ID = 'obstacles-field-radius-color';
        static THETA_ID = 'theta';
        static SIGMA_ID = 'sigma';
        static GAMMA_ID = 'gamma';
        static X_ID = 'x';
        static Y_ID = 'y';

        #totalForceInput;
        #attractiveForceInput;
        #repulsiveForceInput;
        #repulsiveNewForceInput;
        #sigmaInput;
        #thetaInput;
        #gammaInput;
        #xInput;
        #yInput;
        constructor() {
            this.#totalForceInput = document.getElementById(VehicleDisplay.TOTAL_FORCE_ID);
            this.#attractiveForceInput = document.getElementById(VehicleDisplay.ATTRACTIVE_FORCE_ID);
            this.#repulsiveForceInput = document.getElementById(VehicleDisplay.REPULSIVE_FORCE_ID);
            this.#repulsiveNewForceInput = document.getElementById(VehicleDisplay.REPULSIVE_FORCE_NEW_ID);
            this.#sigmaInput = document.getElementById(VehicleDisplay.SIGMA_ID);
            this.#thetaInput = document.getElementById(VehicleDisplay.THETA_ID);
            this.#gammaInput = document.getElementById(VehicleDisplay.GAMMA_ID);
            this.#xInput = document.getElementById(VehicleDisplay.X_ID);
            this.#yInput = document.getElementById(VehicleDisplay.Y_ID);

            this.#setColors();
        }
        /**
         * @param {number} value
         */
        set totalForce(value) {
            this.#totalForceInput.value = value.toPrecision(3);
        }
        /**
         * @param {number} value
         */
        set attractiveForce(value) {
            this.#attractiveForceInput.value = value.toPrecision(3);
        }
        /**
         * @param {number} value
         */
        set repulsiveForce(value) {
            this.#repulsiveForceInput.value = value.toPrecision(3);
        }
        /**
         * @param {number} value
         */
        set repulsiveNewForce(value) {
            this.#repulsiveNewForceInput.value = value.toPrecision(3);
        }
        /**
         * F(att) and F(tot) angle
         * @param {number} value
         */
        set theta(value) {
            this.#thetaInput.value = value.toPrecision(3) + '°';
        }
        /**
         * F(rep) and F(tot) angle
         * @param {number} value
         */
        set sigma(value) {
            this.#sigmaInput.value = value.toPrecision(3)  + '°';
        }
        /**
         * F(att) and F(rep) angle
         * @param {number} value
         */
        set gamma(value) {
            this.#gammaInput.value = value.toPrecision(3)  + '°';
        }
        /**
         * @param {number} value
         */
        set x(value) { 
            this.#xInput.value = value.toPrecision(3);
        }
        /**
         * @param {number} value
         */
        set y(value) {
            this.#yInput.value = value.toPrecision(3);
        }

        #setColors() {
            document.getElementById(VehicleDisplay.TOTAL_FORCE_COLOR_ID).style.backgroundColor = COLOR.TOTAL_FORCE;
            document.getElementById(VehicleDisplay.ATTRACTIVE_FORCE_COLOR_ID).style.backgroundColor = COLOR.ATTRACTIVE_FORCE;
            document.getElementById(VehicleDisplay.REPULSIVE_FORCE_COLOR_ID).style.backgroundColor = COLOR.TOTAL_REPULSIVE_FORCE;
            document.getElementById(VehicleDisplay.REPULSIVE_FORCE_NEW_COLOR_ID).style.backgroundColor = COLOR.TOTAL_REPULSIVE_FORCE_NEW;
            document.getElementById(VehicleDisplay.VECTORS_FLOW_COLOR_ID).style.backgroundColor = COLOR.VECTORS_FLOW;
            document.getElementById(VehicleDisplay.OBSTACLES_FIELD_RADIUS_COLOR_ID).style.backgroundColor = COLOR.OBSTACLES_FIELD_RADIUS;
        }
    }

    return new VehicleDisplay()
})()

const canvasDisplay = (function() {
    class CanvasDisplay {
        static VECTORS_FLOW_CHECKBOX_ID = 'vectors-flow-field-checkbox'
        static TOTAL_FORCE_CHECKBOX_ID = 'total-force-field-checkbox'
        static ATTRACTIVE_FORCE_CHECKBOX_ID = 'attractive-force-field-checkbox'
        static REPULSIVE_FORCE_CHECKBOX_ID = 'repulsive-force-field-checkbox'
        static REPULSIVE_FORCE_NEW_CHECKBOX_ID = 'repulsive-force-new-field-checkbox'
        static OBSTACLES_FIELD_RADIUS_CHECKBOX_ID = 'obstacles-radius-field-checkbox'
        // true/false
        totalForce = 0;
        vectorsFlow = 0;
        attractiveForce = 0;
        repulsiveForce = 0;
        repulsiveNewForce = 0;
        obstaclesFieldRadius = 0;
    }
    const withLs = withLsSubscribe(new CanvasDisplay());

    const valueToElement = {
        totalForce: document.getElementById(CanvasDisplay.TOTAL_FORCE_CHECKBOX_ID),
        vectorsFlow: document.getElementById(CanvasDisplay.VECTORS_FLOW_CHECKBOX_ID),
        attractiveForce: document.getElementById(CanvasDisplay.ATTRACTIVE_FORCE_CHECKBOX_ID),
        repulsiveForce: document.getElementById(CanvasDisplay.REPULSIVE_FORCE_CHECKBOX_ID),
        repulsiveNewForce: document.getElementById(CanvasDisplay.REPULSIVE_FORCE_NEW_CHECKBOX_ID),
        obstaclesFieldRadius: document.getElementById(CanvasDisplay.OBSTACLES_FIELD_RADIUS_CHECKBOX_ID),
    }

    for (const value of Object.keys(valueToElement)) {
        initCheckbox(valueToElement[value], withLs[value]);
        onCheckboxChange(valueToElement[value], (state) => withLs[value] = state);
    }

    return withLs;
})()

const canvasActions = (function() {
    class CanvasActions {
        static RESET_VEHICLE_BUTTON_ID = 'reset-vehicle';
        static PAUSE_RESUME_BUTTON_ID = 'pause-resume';
        onResetVehicle = () => {};
        onResume = () => {}
        onPause = () => {}

        constructor() {
            this.#onButtonClick(document.getElementById(CanvasActions.RESET_VEHICLE_BUTTON_ID), () => this.onResetVehicle());
            this.#onButtonClick(document.getElementById(CanvasActions.PAUSE_RESUME_BUTTON_ID), (target) => { 
                if (target.innerText === 'Pause') {
                    this.onPause();
                    target.innerText = 'Resume';
                    return
                }
                target.innerText = 'Pause';
                this.onResume();
            })
        }

        #onButtonClick = (el, listener) => {
            el.onclick = (e) => void listener(e.target);
        }
    }

    return new CanvasActions()
})()

