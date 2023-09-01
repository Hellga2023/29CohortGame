import bg from '@/assets/images/bg.jpeg';

const width = 600;
const height = 600;

// todo one for here and game types
const playerSize = 64;

const GameParameters = {
    WIDTH: width,
    HEIGHT: height,
    BACKGROUND_IMAGE: bg,
    FIRST_LEVEL_LENGTH: 500,
    PLAYER_COORDINATES: { x: width / 2 - playerSize / 2, y: height - playerSize },
} as const;

export default GameParameters;
