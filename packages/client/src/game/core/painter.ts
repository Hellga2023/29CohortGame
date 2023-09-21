import params from '@game/parameters/gameParameters';
import BaseObject from '../objects/baseObject';

class Painter {
    private bgImage = new Image();

    constructor(private contextDelegate: () => CanvasRenderingContext2D) {
        this.bgImage.src = ''; // params.BACKGROUND_IMAGE
    }

    get context() {
        return this.contextDelegate();
    }

    public drawFrame = (object: BaseObject) => {
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

    public drawBackground = () => {
        this.context.clearRect(0, 0, params.WIDTH, params.HEIGHT);
        this.context.drawImage(this.bgImage, 0, 0, params.WIDTH, params.HEIGHT);
    };

    // TODO: remove this when start state is fixed
    public drawLoadScreen = () => {
        this.bgImage.onload = () => {
            this.drawBackground();
            this.context.font = 'bold 48px serif';
            this.context.fillStyle = '#fff';
            this.context.fillText('START GAME', 140, 200);
        };
    };

    // TODO: can we make level screen like start and end
    public drawLevelEnd = () => {
        this.drawBackground();
        this.context.font = 'bold 48px serif';
        this.context.fillStyle = '#fff';
        this.context.fillText('LEVEL FINISHED', 100, 200);
    };
}

export default Painter;
