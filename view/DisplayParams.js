const displayParams = (function() {
    class DisplayParams {
        constructor() {
            this.wrapper = document.getElementById('display-params');

            this.actionShowHide = document.getElementById('actions-show-hide');

            this.totalForce = document.getElementById('total-force');

            this.attractiveForce = document.getElementById('attractive-force');

            this.repulsiveForce = document.getElementById('repulsive-force');

            this.repulsiveNewForce = document.getElementById('repulsive-new-force');


            this.actionShowHide.onclick = () => {
                if (this.wrapper.style.display === 'none') { 
                    this.show();
                    return;
                }
            
                this.hide();
            }

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

        show() {
            this.wrapper.style.display = 'block';
            this.actionShowHide.innerHTML = 'hide';
        }

        hide() {
            this.wrapper.style.display = 'none';
            this.actionShowHide.innerHTML = 'show';
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