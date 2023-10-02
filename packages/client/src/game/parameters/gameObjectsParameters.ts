import { ShipType, ShotType } from '@game/types/commonTypes';
import { BaseParams } from '@game/objects/base/baseObject';
import BattlecruiserImage from '@/assets/images/game/ships/Battlecruiser.png';
import BomberImage from '@/assets/images/game/ships/Bomber.png';
import FighterImage from '@/assets/images/game/ships/Fighter.png';
import FrigateImage from '@/assets/images/game/ships/Frigate.png';
import RocketImage from '@/assets/images/game/shots/Rocket.png';
import PlayerRocketImage from '@/assets/images/game/shots/PlayerRocket.png';

/* Shots parameters */

const shotParams = {
    width: 9,
    height: 16,
    imageSpriteWidth: 36,
};

export const ShotParametersValues: Record<ShotType, BaseParams> = {
    [ShotType.Enemy]: new BaseParams(
        shotParams.width,
        shotParams.height,
        RocketImage,
        shotParams.imageSpriteWidth
    ),
    [ShotType.Player]: new BaseParams(
        shotParams.width,
        shotParams.height,
        PlayerRocketImage,
        shotParams.imageSpriteWidth
    ),
} as const;

/* Ships parameters */

const imageSpriteWidth = 959;

export const ShipTypesParameterValues: Record<ShipType, BaseParams> = {
    [ShipType.Battlecruiser]: new BaseParams(128, 128, BattlecruiserImage, imageSpriteWidth),
    [ShipType.Fighter]: new BaseParams(64, 64, FighterImage, imageSpriteWidth),
    [ShipType.Bomber]: new BaseParams(64, 64, BomberImage, imageSpriteWidth),
    [ShipType.Player]: new BaseParams(64, 64, FrigateImage, 1024),
} as const;
