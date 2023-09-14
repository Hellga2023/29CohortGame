import React, { FC, MouseEventHandler } from 'react';
import classNames from 'classnames';
import style from './button.module.scss';

type TButtonStyle = 'normal' | 'withoutBackGround' | 'icon';
type TButtonSize = 'large' | 'medium' | 'small';
type TButtonType = 'button' | 'submit';

type TButtonProps = {
    size?: TButtonSize;
    click?: MouseEventHandler;
    buttonStyle?: TButtonStyle;
    type?: TButtonType;
    text?: string;
    isActive?: boolean;
    children?: React.ReactNode;
};

const Button: FC<TButtonProps> = ({
    text,
    children,
    type = 'button',
    size = 'medium',
    buttonStyle = 'normal',
    isActive = true,
    click,
}) => (
    <button
        type={type}
        onClick={click}
        className={classNames(style[size], style[buttonStyle])}
        disabled={!isActive}>
        {text || children}
    </button>
);

export default Button;
