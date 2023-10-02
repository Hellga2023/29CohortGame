import { TPoint } from '../types/commonTypes';

type TAngles = {
    vectorAngle: number;
    difAngle: number;
    segmentAngle: number;
};

class TrajectoryHelper {
    public static getPreviousAngles(points: TPoint[], segmentIndex: number): TAngles {
        if (segmentIndex >= points.length) {
            throw Error('index is out of array');
        }

        let difAngle = 0; // 0 for the first segement
        let vectorAngle = 0; // 0 for the first segment
        let segmentAngle = 0; // default value to avoid error

        for (let i = 0; i <= segmentIndex; i++) {
            const sPoint = points[i];
            const ePoint = points[i + 1];
            segmentAngle = Math.atan2(ePoint.y - sPoint.y, ePoint.x - sPoint.x);

            // todo ???
            vectorAngle = i === 0 ? segmentAngle : vectorAngle + 2 * difAngle;
            difAngle = segmentAngle - vectorAngle;
        }

        return { vectorAngle, difAngle, segmentAngle };
    }
}

export default TrajectoryHelper;
