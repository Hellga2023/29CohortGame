import { Canvas } from 'canvas';
import GameEngine from '../core/gameEngine';

describe('Тесты gameEngine', () => {
    const canvas = new Canvas(200, 200);
    const ctx = canvas.getContext('2d');

    const gameEngine = new GameEngine(ctx as unknown as CanvasRenderingContext2D);

    test('Тесты GameEngine.constructor result', () => {
        expect(gameEngine instanceof GameEngine).toEqual(true);
    });

    test('Тесты GameEngine.getPlayerCoordinates', () => {
        const result = gameEngine.getPlayerCoordinates();

        expect(result).toEqual({ x: 268, y: 536 });
    });
});

export {};
