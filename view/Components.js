const vehicleDisplay = (function() {
    class VehicleDisplay {
        static TOTAL_FORCE_ID = 'total-force';
        static ATTRACTIVE_FORCE_ID = 'attractive-force';
        static REPULSIVE_FORCE_TOTAL_ID = 'repulsive-force-total';
        static REPULSIVE_FORCE_NEW_TOTAL_ID = 'repulsive-force-new-total';
        static THETA_ID = 'theta';
        static SIGMA_ID = 'sigma';
        static GAMMA_ID = 'gamma';
        static X_ID = 'x';
        static Y_ID = 'y';

        #totalForceInput;
        #attractiveForceInput;
        #repulsiveForceTotalInput;
        #repulsiveForceNewTotalInput;
        #sigmaInput;
        #thetaInput;
        #gammaInput;
        #xInput;
        #yInput;
        constructor() {
            this.#totalForceInput = document.getElementById(VehicleDisplay.TOTAL_FORCE_ID);
            this.#attractiveForceInput = document.getElementById(VehicleDisplay.ATTRACTIVE_FORCE_ID);
            this.#repulsiveForceTotalInput = document.getElementById(VehicleDisplay.REPULSIVE_FORCE_TOTAL_ID);
            this.#repulsiveForceNewTotalInput = document.getElementById(VehicleDisplay.REPULSIVE_FORCE_NEW_TOTAL_ID);
            this.#sigmaInput = document.getElementById(VehicleDisplay.SIGMA_ID);
            this.#thetaInput = document.getElementById(VehicleDisplay.THETA_ID);
            this.#gammaInput = document.getElementById(VehicleDisplay.GAMMA_ID);
            this.#xInput = document.getElementById(VehicleDisplay.X_ID);
            this.#yInput = document.getElementById(VehicleDisplay.Y_ID);
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
        set repulsiveForceTotal(value) {
            this.#repulsiveForceTotalInput.value = value.toPrecision(3);
        }
        /**
         * @param {number} value
         */
        set repulsiveForceNewTotal(value) {
            this.#repulsiveForceNewTotalInput.value = value.toPrecision(3);
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


    }

    return new VehicleDisplay()
})()

const canvasDisplay = (function() {
    class CanvasDisplay {
        static VECTORS_FLOW_CHECKBOX_ID = 'vectors-flow-field-checkbox';
        static TOTAL_FORCE_CHECKBOX_ID = 'total-force-field-checkbox';
        static ATTRACTIVE_FORCE_CHECKBOX_ID = 'attractive-force-field-checkbox';
        static REPULSIVE_FORCE_TOTAL_CHECKBOX_ID = 'repulsive-force-total-field-checkbox';
        static REPULSIVE_FORCE_NEW_TOTAL_CHECKBOX_ID = 'repulsive-force-new-total-field-checkbox';
        static REPULSIVE_FORCE_CHECKBOX_ID = 'repulsive-force-field-checkbox';
        static REPULSIVE_FORCE_NEW_CHECKBOX_ID = 'repulsive-force-new-field-checkbox'
        static OBSTACLES_FIELD_RADIUS_CHECKBOX_ID = 'obstacles-radius-field-checkbox';
        static VEHICLE_CHECKBOX_ID = 'vehicle-checkbox';
        static VEHICLE_FIELD_RADIUS_CHECKBOX_ID = 'vehicle-field-radius-checkbox';
        static REPULSIVE_FORCE_COLOR_ID = 'repulsive-force-field-color';
        static REPULSIVE_FORCE_NEW_COLOR_ID = 'repulsive-force-new-field-color';
        static VEHICLE_FIELD_RADIUS_COLOR_ID = 'vehicle-field-radius-color';
        static VEHICLE_COLOR_ID = 'vehicle-color';
        static TOTAL_FORCE_COLOR_ID = 'total-force-color';
        static ATTRACTIVE_FORCE_COLOR_ID = 'attractive-force-color';
        static REPULSIVE_FORCE_TOTAL_COLOR_ID = 'repulsive-force-total-color';
        static REPULSIVE_FORCE_NEW_TOTAL_COLOR_ID = 'repulsive-force-new-total-color';
        static VECTORS_FLOW_COLOR_ID = 'vectors-flow-color';
        static OBSTACLES_FIELD_RADIUS_COLOR_ID = 'obstacles-field-radius-color';
        
        static OBSTACLES_MAP_SELECT_ID = 'obstacles-map-select';
        static OBSTACLES_MAP_SELECT_OPTIONS = ['default', 'wall'];
        // true/false
        totalForce = 0;
        vectorsFlow = 0;
        attractiveForce = 0;
        repulsiveForceTotal = 0;
        repulsiveForceNewTotal = 0;
        repulsiveForce = 0;
        repulsiveForceNew = 0;
        obstaclesFieldRadius = 0;
        vehicle = 1;
        vehicleFieldRadius = 0;
        
        obstaclesMap = 0;
        constructor() {
            this.#setColors();
        }

        #setColors() {
            document.getElementById(CanvasDisplay.TOTAL_FORCE_COLOR_ID).style.backgroundColor = COLOR.TOTAL_FORCE;
            document.getElementById(CanvasDisplay.ATTRACTIVE_FORCE_COLOR_ID).style.backgroundColor = COLOR.ATTRACTIVE_FORCE;
            document.getElementById(CanvasDisplay.VECTORS_FLOW_COLOR_ID).style.backgroundColor = COLOR.VECTORS_FLOW;
            document.getElementById(CanvasDisplay.OBSTACLES_FIELD_RADIUS_COLOR_ID).style.backgroundColor = COLOR.OBSTACLES_FIELD_RADIUS;
            document.getElementById(CanvasDisplay.VEHICLE_COLOR_ID).style.backgroundColor = COLOR.VEHICLE;
            document.getElementById(CanvasDisplay.VEHICLE_FIELD_RADIUS_COLOR_ID).style.backgroundColor = COLOR.VEHICLE_FIELD_RADIUS;
            document.getElementById(CanvasDisplay.REPULSIVE_FORCE_COLOR_ID).style.backgroundColor = COLOR.REPULSIVE_FORCE;
            document.getElementById(CanvasDisplay.REPULSIVE_FORCE_NEW_COLOR_ID).style.backgroundColor = COLOR.REPULSIVE_FORCE_NEW;
            document.getElementById(CanvasDisplay.REPULSIVE_FORCE_TOTAL_COLOR_ID).style.backgroundColor = COLOR.REPULSIVE_FORCE;
            document.getElementById(CanvasDisplay.REPULSIVE_FORCE_NEW_TOTAL_COLOR_ID).style.backgroundColor = COLOR.REPULSIVE_FORCE_NEW;
        }
    }
    const withLs = withLsSubscribe(new CanvasDisplay());

    withLs.onSelectChange = () => {}

    const valueToElementCheckbox = {
        totalForce: document.getElementById(CanvasDisplay.TOTAL_FORCE_CHECKBOX_ID),
        vectorsFlow: document.getElementById(CanvasDisplay.VECTORS_FLOW_CHECKBOX_ID),
        attractiveForce: document.getElementById(CanvasDisplay.ATTRACTIVE_FORCE_CHECKBOX_ID),
        repulsiveForceTotal: document.getElementById(CanvasDisplay.REPULSIVE_FORCE_TOTAL_CHECKBOX_ID),
        repulsiveForceNewTotal: document.getElementById(CanvasDisplay.REPULSIVE_FORCE_NEW_TOTAL_CHECKBOX_ID),
        obstaclesFieldRadius: document.getElementById(CanvasDisplay.OBSTACLES_FIELD_RADIUS_CHECKBOX_ID),
        vehicle: document.getElementById(CanvasDisplay.VEHICLE_CHECKBOX_ID),
        vehicleFieldRadius: document.getElementById(CanvasDisplay.VEHICLE_FIELD_RADIUS_CHECKBOX_ID),
        repulsiveForce: document.getElementById(CanvasDisplay.REPULSIVE_FORCE_CHECKBOX_ID),
        repulsiveForceNew: document.getElementById(CanvasDisplay.REPULSIVE_FORCE_NEW_CHECKBOX_ID)
    }

    const valueToElementSelect = {
        obstaclesMap: document.getElementById(CanvasDisplay.OBSTACLES_MAP_SELECT_ID)
    }

    for (const value of Object.keys(valueToElementCheckbox)) {
        initCheckbox(valueToElementCheckbox[value], withLs[value]);
        onCheckboxChange(valueToElementCheckbox[value], (state) => withLs[value] = state);
    }

    for (const value of Object.keys(valueToElementSelect)) {
        onSelectChange(valueToElementSelect[value], (state) => {
            const index = CanvasDisplay.OBSTACLES_MAP_SELECT_OPTIONS.indexOf(state);

            withLs.onSelectChange(index, CanvasDisplay.OBSTACLES_MAP_SELECT_OPTIONS);
        });
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

