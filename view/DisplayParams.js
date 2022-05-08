const displayParams = (function() {
    class DisplayParams {
        constructor() {
            this.wrapper = document.getElementById('display-params');

            this.totalForce = document.getElementById('total-force');

            this.attractiveForce = document.getElementById('attractive-force');

            this.repulsiveForce = document.getElementById('repulsive-force');

            this.repulsiveNewForce = document.getElementById('repulsive-new-force');

            this.setColors();
        }

        setTotalForceSpeed(value) {
            this.totalForce.value = value.toPrecision(3);
        }

        setAttractiveForce(value) {
            this.attractiveForce.value = value.toPrecision(3);
        }

        setRepulsiveForce(value) {
            this.repulsiveForce.value = value.toPrecision(3);
        }

        setRepulsiveNewForce(value) {
            this.repulsiveNewForce.value = value.toPrecision(3);
        }

        setColors() {
            document.getElementById('total-force-color').style.backgroundColor = COLOR.TOTAL_FORCE;
            document.getElementById('attractive-force-color').style.backgroundColor = COLOR.ATTRACTIVE_FORCE;
            document.getElementById('repulsive-force-color').style.backgroundColor = COLOR.REPULSIVE_FORCE;
            document.getElementById('repulsive-new-force-color').style.backgroundColor = COLOR.REPULSIVE_NEW_FORCE;
        }
    }

    return new DisplayParams()
})()