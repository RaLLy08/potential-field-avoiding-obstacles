/**
 * basic vector
 * @param {number} x
 * @param {number} y
 */
export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    mag() {
        return Math.hypot(this.x, this.y);
    }
    angle(other) {
        const dotOther = this.dot(other);
        const magMult = this.mag() * other.mag();

        const result = Math.acos(dotOther / magMult)
        
        if (Number.isNaN(result)) return 0;

        return result;
    }
    fullAngle(other) {
        return Math.atan2(this.x * other.y - this.y* other.x, this.x*other.x + this.y*other.y)
    }
    sum(other) {
        return new Vector(other.x + this.x, other.y + this.y);
    }
    sub(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }
    scaleBy(koef) {
        return new Vector(this.x * koef, this.y * koef);
    }
    normalize() {
        const mag = this.mag();

        if (mag === 0) return this;

        return this.scaleBy(1 / mag);
    }
    negate() {
        return this.scaleBy(-1);
    }
} 