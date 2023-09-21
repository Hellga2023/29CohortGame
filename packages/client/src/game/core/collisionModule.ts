import state from '../store/gameState';
import BaseObject from '../objects/base/baseObject';

class CollisionModule {
    // TODO: try detect collision with circle instead of rect
    private static detectCollision(object1: BaseObject, object2: BaseObject) {
        const point1 = object1.getState().getCoordinates();
        const point2 = object2.getState().getCoordinates();

        return (
            point1.x < point2.x + object2.width &&
            point1.x + object1.width > point2.x &&
            point1.y < point2.y + object2.height &&
            point1.y + object1.height > point2.y
        );
    }

    private static playerHitByEnemyShip = () => {
        const { player } = state;

        state.enemies.forEach(ship => {
            if (ship.shouldDetectCollision()) {
                if (CollisionModule.detectCollision(player, ship)) {
                    player.setHit();
                    console.log('player hit');
                }
            }
        });
    };

    // TODO: add enemy shots check here
    private static enemyHit = () => {
        state.shots.forEach(shot => {
            if (shot.isPlayerShot() && shot.isVisible()) {
                state.enemies.forEach(ship => {
                    if (ship.shouldDetectCollision()) {
                        if (CollisionModule.detectCollision(shot, ship)) {
                            console.log('ship hit');
                            ship.setHit();
                        }
                    }
                });
            }
        });
    };

    public static collisionDetection = () => {
        CollisionModule.playerHitByEnemyShip();
        CollisionModule.enemyHit();
    };
}

export default CollisionModule;
