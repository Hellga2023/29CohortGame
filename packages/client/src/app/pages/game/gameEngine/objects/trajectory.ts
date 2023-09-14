import TrajectoryHelper from '../helpers/trajectoryHelper';
import { TPoint } from '../types/common';

class Trajectory {
    private points: TPoint[];

    private segmentIndex = 0;

    private logged = false;

    private segmentStartTime = 0;

    private delay = 0;

    constructor(points: TPoint[], delay?: number) {
        this.points = points;
        if (delay) {
            this.delay = delay;
        }
    }

    private static getSegmentLength = (startPoint: TPoint, endPoint: TPoint): number =>
        Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);

    private static getNextCoordinate = (
        start: number,
        end: number,
        time: number,
        length: number
    ): number => start + ((end - start) * time) / length; // todo speed coefficient

    public getStartPoint = () => this.points[0];

    public getCoordinates = (time: number): TPoint => {
        const startPoint = this.points[this.segmentIndex];
        const endPoint = this.points[this.segmentIndex + 1];

        /* calculate segments params */

        const segmentTime = time - this.segmentStartTime - this.delay;
        const segmentLength = Trajectory.getSegmentLength(startPoint, endPoint);
        let pathLength = segmentLength;

        // temp fot testing
        const isFirstSegment: boolean = this.segmentIndex === 0;
        // const isFirstSegment = false;
        let point: TPoint;

        if (isFirstSegment) {
            // this block is ok for small angles
            // todo apply the logic for small angles
            point = {
                x: Trajectory.getNextCoordinate(
                    startPoint.x,
                    endPoint.x,
                    segmentTime,
                    segmentLength
                ),
                y: Trajectory.getNextCoordinate(
                    startPoint.y,
                    endPoint.y,
                    segmentTime,
                    segmentLength
                ),
            };
        } else {
            /* calc vector angle by previous segment's vector angle and dif angle */

            // todo move this to trajectory initialization to calculate this once for every segment

            const { difAngle, vectorAngle } = TrajectoryHelper.getPreviousAngles(
                this.points,
                this.segmentIndex
            );

            /* radius and arc center coordinates */

            let radiusLength: number;
            let arcCenterX: number;
            let arcCenterY: number;
            // if very big angle
            if (difAngle > -0.1 && difAngle < 0.1) {
                point = {
                    x: Trajectory.getNextCoordinate(
                        startPoint.x,
                        endPoint.x,
                        segmentTime,
                        segmentLength
                    ),
                    y: Trajectory.getNextCoordinate(
                        startPoint.y,
                        endPoint.y,
                        segmentTime,
                        segmentLength
                    ),
                };
            } else {
                const difAngleAbs = Math.abs(difAngle);
                if (difAngleAbs > Math.PI / 2 - 0.1 && difAngleAbs < Math.PI / 2 + 0.1) {
                    radiusLength = segmentLength / 2;
                    arcCenterX = (startPoint.x + endPoint.x) / 2;
                    arcCenterY = (startPoint.y + endPoint.y) / 2;
                    pathLength = 2 * difAngle * radiusLength;
                } else {
                    radiusLength = segmentLength / (2 * Math.sin(difAngle));
                    arcCenterX = startPoint.x - radiusLength * Math.sin(vectorAngle);
                    arcCenterY = startPoint.y + radiusLength * Math.cos(vectorAngle);
                    pathLength = 2 * difAngle * radiusLength;
                }
                const currentAngle =
                    vectorAngle + Math.PI / 2 + (2 * difAngle * segmentTime) / pathLength;

                // temp for testing in 6 sprint, will remove before 6 sprint demo
                /* if (this.segmentIndex === 1) {
                    console.log('difAngle');
                    console.log(difAngle);
                    console.log('segmentAngle');
                    console.log(segmentAngle);
                    console.log('vectorAngle');
                    console.log(vectorAngle);
                    console.log('currentAngle');
                    console.log(currentAngle);
                    console.log('segmentTime');
                    console.log(segmentTime);
                    console.log('pathLength');
                    console.log(pathLength);
                    console.log('segmentLength');
                    console.log(segmentLength);
                    console.log('startPoint');
                    console.log(startPoint);
                    console.log('endPoint');
                    console.log(endPoint);
                    console.log('radiusLength');
                    console.log(radiusLength);
                    console.log('arcCenterX, arcCenterY');
                    console.log(arcCenterX, arcCenterY);
                    console.log('this.segmentIndex');
                    console.log(this.segmentIndex);
                    console.log('Math.cos(currentAngle)');
                    console.log(Math.cos(currentAngle)); // check if -
                    console.log('Math.sin(currentAngle)');
                    console.log(Math.sin(currentAngle));
                } */

                point = {
                    x: arcCenterX - radiusLength * Math.cos(currentAngle),
                    y: arcCenterY - radiusLength * Math.sin(currentAngle),
                };
            }
        }

        // temp for testing in 6 sprint, will remove before 6 sprint demo
        /* console.log('point.x');
        console.log(point.x);
        console.log('point.y');
        console.log(point.y); */

        // switch segment if needed
        if (Trajectory.shouldSwitchSegment(segmentTime, Math.abs(pathLength))) {
            this.segmentIndex += 1;
            this.segmentStartTime = time - this.delay;
        }
        return point;
    };

    public getSegmentsNumber = (): number => this.points.length - 1;

    private static shouldSwitchSegment = (time: number, length: number): boolean => time >= length;

    public shouldMove = (time: number) =>
        this.segmentIndex < this.getSegmentsNumber() && this.shouldStartMoving(time);

    public shouldStartMoving = (time: number) => time > this.delay;

    public movedOutOfGameField = (time: number): boolean => {
        // todo calculate if ship or shoot coordinate is outside of canvas
        // to set dead state not to render this objects
        if (this.logged) {
            console.log(time);
            console.log(this.delay);
        }
        return false;
    };
}

export default Trajectory;
