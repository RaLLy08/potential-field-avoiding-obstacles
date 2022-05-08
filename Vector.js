/**
 * basic vector
 * @param {number} x
 * @param {number} y
 */
class Vector {
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

        // if (magMult === 0) return 1;

        return Math.acos(dotOther / magMult);
    }
    sum(other) {
        return new Vector(other.x + this.x, other.y + this.y, this.params);
    }
    sub(other) {
        return new Vector(this.x - other.x, this.y - other.y, this.params);
    }
    scaleBy(koef) {
        return new Vector(this.x * koef, this.y * koef, this.params);
    }
    normalize() {
        return this.scaleBy(1 / this.mag())
    }
    negate() {
        return this.scaleBy(-1);
    }
} 