import { DrawableGameObject } from './types/commonTypes';
import params from './parameters/gameParameters';

class GamePainter {
    private context: CanvasRenderingContext2D;

    private bgImage = new Image();

    constructor(ctx: CanvasRenderingContext2D) {
        this.context = ctx;
        this.bgImage.src = params.BACKGROUND_IMAGE;
    }

    public drawBackground = () => {
        /* this.bgImage.onload = () => {
            this.context.drawImage(this.bgImage, 0, 0, params.WIDTH, params.HEIGHT);
        }; */
        this.context.drawImage(this.bgImage, 0, 0, params.WIDTH, params.HEIGHT);
    };

    public drawLoadScreen = () => {
        this.drawBackground();
        this.context.font = 'bold 48px serif';
        this.context.fillStyle = '#fff';
        this.context.fillText('BLACK STAR GAME', 70, 200);
        this.context.fillText('Incredible space adventure', 25, 300);
        this.context.fillText('you have never seen before', 25, 360);
    };

    // todo replace with new level state
    public drawLevelEnd = () => {
        this.drawBackground();
        this.context.font = 'bold 48px serif';
        this.context.fillStyle = '#fff';
        this.context.fillText('LEVEL FINISHED', 100, 200);
    };

    public drawFrame = (object: DrawableGameObject) => {
        const parameters = object.getParameters();
        const state = object.getState();
        const spriteX = parameters.width * state.getFrameIndex();
        const coordinates = state.getCoordinates();
        this.context.drawImage(
            object.image,
            spriteX,
            0,
            parameters.width,
            parameters.height,
            coordinates.x,
            coordinates.y,
            parameters.width,
            parameters.height
        );
    };
}

export default GamePainter;
