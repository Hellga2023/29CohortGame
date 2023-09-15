import Trajectory from '../objects/trajectory';

describe('Тесты Trajectory', () => {
    test('getSegmentLength 0:0 => 0:0 === 0', () => {
        const pointA = { x: 0, y: 0 };
        const pointB = { x: 0, y: 0 };

        const result = Trajectory.getSegmentLength(pointA, pointB);

        expect(result).toBe(0);
    });

    test('getSegmentLength 0:0 => 0:X === X', () => {
        const diffY = 10;

        const pointA = { x: 0, y: 0 };
        const pointB = { x: 0, y: diffY };

        const result = Trajectory.getSegmentLength(pointA, pointB);

        expect(result).toBe(diffY);
    });

    test('getSegmentLength 0:0 => X:0 === X', () => {
        const diffX = 10;

        const pointA = { x: 0, y: 0 };
        const pointB = { x: diffX, y: 0 };

        const result = Trajectory.getSegmentLength(pointA, pointB);

        expect(result).toBe(diffX);
    });

    test('getSegmentLength 0:0 => X:Y === sqrt(X**2 + Y**2)', () => {
        const diffX = 10;
        const diffY = 20;

        const hypot = Math.sqrt(diffX * diffX + diffY * diffY);

        const pointA = { x: 0, y: 0 };
        const pointB = { x: diffX, y: diffY };

        const result = Trajectory.getSegmentLength(pointA, pointB);

        expect(result).toBe(hypot);
    });
});

export {};
