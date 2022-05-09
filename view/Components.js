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
        static THETA = 'theta';
        static SIGMA = 'sigma';

        #totalForceInput;
        #attractiveForceInput;
        #repulsiveForceInput;
        #repulsiveNewForceInput;
        #sigmaInput;
        #thetaInput;
        constructor() {
            this.#totalForceInput = document.getElementById(VehicleDisplay.TOTAL_FORCE_ID);
            this.#attractiveForceInput = document.getElementById(VehicleDisplay.ATTRACTIVE_FORCE_ID);
            this.#repulsiveForceInput = document.getElementById(VehicleDisplay.REPULSIVE_FORCE_ID);
            this.#repulsiveNewForceInput = document.getElementById(VehicleDisplay.REPULSIVE_FORCE_NEW_ID);
            this.#sigmaInput = document.getElementById(VehicleDisplay.SIGMA);
            this.#thetaInput = document.getElementById(VehicleDisplay.THETA);

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
         * @param {number} value
         */
        set theta(value) {
            this.#thetaInput.value = value.toPrecision(3);
        }
        /**
         * @param {number} value
         */
        set sigma(value) {
            this.#sigmaInput.value = value.toPrecision(3);
        }

        #setColors() {
            document.getElementById(VehicleDisplay.TOTAL_FORCE_COLOR_ID).style.backgroundColor = COLOR.TOTAL_FORCE;
            document.getElementById(VehicleDisplay.ATTRACTIVE_FORCE_COLOR_ID).style.backgroundColor = COLOR.ATTRACTIVE_FORCE;
            document.getElementById(VehicleDisplay.REPULSIVE_FORCE_COLOR_ID).style.backgroundColor = COLOR.REPULSIVE_FORCE;
            document.getElementById(VehicleDisplay.REPULSIVE_FORCE_NEW_COLOR_ID).style.backgroundColor = COLOR.REPULSIVE_FORCE_NEW;
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
        totalForce = false;
        vectorsFlow = false;
        attractiveForce = false;
        repulsiveForce = false;
        repulsiveNewForce = false;
        obstaclesFieldRadius = false;
        constructor() {
            this.#onCheckboxChange(document.getElementById(CanvasDisplay.TOTAL_FORCE_CHECKBOX_ID), (value) => this.totalForce = value);
            this.#onCheckboxChange(document.getElementById(CanvasDisplay.VECTORS_FLOW_CHECKBOX_ID), (value) => this.vectorsFlow = value);
            this.#onCheckboxChange(document.getElementById(CanvasDisplay.ATTRACTIVE_FORCE_CHECKBOX_ID), (value) => this.attractiveForce = value);
            this.#onCheckboxChange(document.getElementById(CanvasDisplay.REPULSIVE_FORCE_CHECKBOX_ID), (value) => this.repulsiveForce = value);
            this.#onCheckboxChange(document.getElementById(CanvasDisplay.REPULSIVE_FORCE_NEW_CHECKBOX_ID), (value) => this.repulsiveNewForce = value);
            this.#onCheckboxChange(document.getElementById(CanvasDisplay.OBSTACLES_FIELD_RADIUS_CHECKBOX_ID), (value) => this.obstaclesFieldRadius = value);
        }

        #onCheckboxChange = (el, listener) => {
            el.onchange = (e) => void listener(+e.target.checked);
        }
    }

    return new CanvasDisplay()
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