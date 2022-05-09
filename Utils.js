/**
 * helper functions
 */
class Utils {
    static toDegree(rads) {
        if (Number.isNaN(rads)) return 0;

        return (rads / Math.PI) * 180;
    }
    static toRadians(degree) {
        return (degree*Math.PI) / 180
    }
}