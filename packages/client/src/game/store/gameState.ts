import PlayerShip from '../objects/ships/playerShip';
import params, { NEXT_SHIP_DELAY } from '../parameters/gameParameters';
import { TEnemyType } from '../types/commonTypes';
import GameLevels, { GameLevelList } from '../parameters/gameLevels';
import Trajectory from '../objects/trajectory';
import EnemyShip from '../objects/ships/enemyShip';
import GameShot from '../objects/gameShot';

class GameState {
    public player: PlayerShip;

    public enemies: EnemyShip[] = [];

    public shots: GameShot[] = [];

    private currentLevel: GameLevelList;

    constructor() {
        this.currentLevel = GameLevelList.Level1;
        this.player = this.initPlayer();
    }

    // eslint-disable-next-line class-methods-use-this
    private initPlayer = () => new PlayerShip(params.PLAYER_COORDINATES);

    private initEnemies = () => {
        const ships: EnemyShip[] = [];
        const levelParams = GameLevels[this.currentLevel];
        Object.keys(levelParams.enemies).forEach(key => {
            const type = key as unknown as TEnemyType;
            const enemyLevelParams = levelParams.enemies[type];
            if (enemyLevelParams) {
                for (let i = 0; i < enemyLevelParams.number; i++) {
                    const trajectory = new Trajectory(
                        enemyLevelParams.trajectoryPoints,
                        i * NEXT_SHIP_DELAY
                    );
                    ships.push(new EnemyShip(type, trajectory));
                }
            }
        });
        return ships;
    };

    public getLevelTime = (): number => {
        const levelParams = GameLevels[this.currentLevel];
        return levelParams.time;
    };

    public startLevel = () => {
        console.log('start level');
        this.player = this.initPlayer();
        this.enemies = this.initEnemies();
        this.shots = [];
    };

    /* public setState = (state: GlobalGameState) => {
        this.state = state;
    };

    public getState = () => this.state; */
}

export default new GameState();
