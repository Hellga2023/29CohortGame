import BattlecruiserImage from '@/assets/images/game/ships/Battlecruiser.png';
import BomberImage from '@/assets/images/game/ships/Bomber.png';
import FighterImage from '@/assets/images/game/ships/Fighter.png';
import FrigateImage from '@/assets/images/game/ships/Frigate.png';
import RocketImage from '@/assets/images/game/shots/Rocket.png';
import PlayerRocketImage from '@/assets/images/game/shots/PlayerRocket.png';
import { ShipType, ShotType } from '../types/commonTypes';
import { DrawableObjectParams } from '../../../../../game/objects/baseObject';

/* Shots parameters */

const shotParams = {
    width: 9,
    height: 16,
    imageSpriteWidth: 36,
};

export const ShotParametersValues: Record<ShotType, DrawableObjectParams> = {
    [ShotType.Enemy]: new DrawableObjectParams(
        shotParams.width,
        shotParams.height,
        RocketImage,
        shotParams.imageSpriteWidth
    ),
    [ShotType.Player]: new DrawableObjectParams(
        shotParams.width,
        shotParams.height,
        PlayerRocketImage,
        shotParams.imageSpriteWidth
    ),
} as const;

/* Ships parameters */

const imageSpriteWidth = 959;

export const ShipTypesParameterValues: Record<ShipType, DrawableObjectParams> = {
    [ShipType.Battlecruiser]: new DrawableObjectParams(
        128,
        128,
        BattlecruiserImage,
        imageSpriteWidth
    ),
    [ShipType.Fighter]: new DrawableObjectParams(64, 64, FighterImage, imageSpriteWidth),
    [ShipType.Bomber]: new DrawableObjectParams(64, 64, BomberImage, imageSpriteWidth),
    [ShipType.Player]: new DrawableObjectParams(64, 64, FrigateImage, 1024),
} as const;
