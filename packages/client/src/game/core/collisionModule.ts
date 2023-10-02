import state from '../store/gameState';
import BaseObject from '../objects/base/baseObject';

class CollisionModule {
    // TODO: try detect collision with circle instead of rect
    // TODO: make all methods static!
    // eslint-disable-next-line class-methods-use-this
    private checkCollision(object1: BaseObject, object2: BaseObject) {
        const point1 = object1.getState().getCoordinates();
        const point2 = object2.getState().getCoordinates();

        return (
            point1.x < point2.x + object2.width &&
            point1.x + object1.width > point2.x &&
            point1.y < point2.y + object2.height &&
            point1.y + object1.height > point2.y
        );
    }

    private playerHitByEnemy = () => {
        const { player } = state;

        state.enemies.forEach(ship => {
            if (ship.shouldCheckCollision() && this.checkCollision(player, ship)) {
                player.setHit();
            }
        });
    };

    // TODO: add enemy shots check here
    private enemyHit = () => {
        state.shots.forEach(shot => {
            if (shot.shouldCheckCollision()) {
                state.enemies.forEach(ship => {
                    if (ship.shouldCheckCollision() && this.checkCollision(shot, ship)) {
                        ship.setHit();
                    }
                });
            }
        });
    };

    public checkCollisions = () => {
        this.playerHitByEnemy();
        this.enemyHit();
    };
}

export default new CollisionModule();
