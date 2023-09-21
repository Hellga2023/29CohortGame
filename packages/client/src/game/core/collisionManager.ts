import state from '../store/gameState';
import BaseObject from '../objects/baseObject';

class CollisionManager {
    // TODO: try detect collision with circle instead of rect
    private static detectCollision(object1: BaseObject, object2: BaseObject) {
        const point1 = object1.getState().getCoordinates();
        const params1 = object1.getParameters();
        const point2 = object2.getState().getCoordinates();
        const params2 = object2.getParameters();
        return (
            point1.x < point2.x + params2.width &&
            point1.x + params1.width > point2.x &&
            point1.y < point2.y + params2.height &&
            point1.y + params1.height > point2.y
        );
    }

    private static playerHitByEnemyShip = () => {
        const { player } = state;

        state.enemies.forEach(ship => {
            if (ship.shouldDetectCollision()) {
                if (CollisionManager.detectCollision(player, ship)) {
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
                        if (CollisionManager.detectCollision(shot, ship)) {
                            console.log('ship hit');
                            ship.setHit();
                        }
                    }
                });
            }
        });
    };

    public static collisionDetection = () => {
        CollisionManager.playerHitByEnemyShip();
        CollisionManager.enemyHit();
    };
}

export default CollisionManager;
