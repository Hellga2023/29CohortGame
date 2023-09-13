import state from '../store/gameState';
import { BaseGameObject } from './baseObject';

class CollisionModule {
    private static detectCollision(object1: BaseGameObject, object2: BaseGameObject) {
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

    private static detectPlayerHit = () => {
        const { player } = state;

        state.enemies.forEach(ship => {
            if (ship.shouldDetectCollision()) {
                if (CollisionModule.detectCollision(player, ship)) {
                    player.setIsHit();
                    console.log('player hit');
                }
            }
        });
    };

    private static detectEnemyHit = () => {
        state.shots.forEach(shot => {
            if (shot.isPlayerShot() && shot.isVisible()) {
                state.enemies.forEach(ship => {
                    if (ship.shouldDetectCollision()) {
                        if (CollisionModule.detectCollision(shot, ship)) {
                            console.log('ship hit');
                            ship.setIsHit();
                        }
                    }
                });
            }
        });
    };

    public static collisionDetection = () => {
        CollisionModule.detectPlayerHit();
        CollisionModule.detectEnemyHit();
    };
}

export default CollisionModule;
