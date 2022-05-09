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
        #totalForceInput;
        #attractiveForceInput;
        #repulsiveForceInput;
        #repulsiveNewForceInput;
        constructor() {
            this.#totalForceInput = document.getElementById(VehicleDisplay.TOTAL_FORCE_ID);

            this.#attractiveForceInput = document.getElementById(VehicleDisplay.ATTRACTIVE_FORCE_ID);

            this.#repulsiveForceInput = document.getElementById(VehicleDisplay.REPULSIVE_FORCE_ID);

            this.#repulsiveNewForceInput = document.getElementById(VehicleDisplay.REPULSIVE_FORCE_NEW_ID);

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

        #setColors() {
            document.getElementById(VehicleDisplay.TOTAL_FORCE_COLOR_ID).style.backgroundColor = COLOR.TOTAL_FORCE;
            document.getElementById(VehicleDisplay.ATTRACTIVE_FORCE_COLOR_ID).style.backgroundColor = COLOR.ATTRACTIVE_FORCE;
            document.getElementById(VehicleDisplay.REPULSIVE_FORCE_COLOR_ID).style.backgroundColor = COLOR.REPULSIVE_FORCE;
            document.getElementById(VehicleDisplay.REPULSIVE_FORCE_NEW_COLOR_ID).style.backgroundColor = COLOR.REPULSIVE_FORCE_NEW;
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
        totalForce = false;
        vectorsFlow = false;
        attractiveForce = false;
        repulsiveForce = false;
        repulsiveNewForce = false;
        constructor() {
            this.#onCheckboxChange(document.getElementById(CanvasDisplay.TOTAL_FORCE_CHECKBOX_ID), (value) => this.totalForce = value);
            this.#onCheckboxChange(document.getElementById(CanvasDisplay.VECTORS_FLOW_CHECKBOX_ID), (value) => this.vectorsFlow = value);
            this.#onCheckboxChange(document.getElementById(CanvasDisplay.ATTRACTIVE_FORCE_CHECKBOX_ID), (value) => this.attractiveForce = value);
            this.#onCheckboxChange(document.getElementById(CanvasDisplay.REPULSIVE_FORCE_CHECKBOX_ID), (value) => this.repulsiveForce = value);
            this.#onCheckboxChange(document.getElementById(CanvasDisplay.REPULSIVE_FORCE_NEW_CHECKBOX_ID), (value) => this.repulsiveNewForce = value);
        }

        #onCheckboxChange = (el, listener) => {
            el.onchange = (e) => void listener(+e.target.checked);
        }
    }

    return new CanvasDisplay()
})()