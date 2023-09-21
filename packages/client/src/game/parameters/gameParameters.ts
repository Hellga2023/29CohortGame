import bg from '@/assets/images/game/bg.jpeg';

const width = 600;
const height = 600;

// todo one for here and game types
const playerSize = 64;

const GameParameters = {
    WIDTH: width,
    HEIGHT: height,
    BACKGROUND_IMAGE: bg,
    PLAYER_COORDINATES: { x: width / 2 - playerSize / 2, y: height - playerSize },
} as const;

export const NEXT_SHIP_DELAY = 1 * 60; // frames per second??? todo to const

export default GameParameters;
