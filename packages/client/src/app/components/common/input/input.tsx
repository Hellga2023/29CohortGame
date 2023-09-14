import React, { FC, ChangeEventHandler } from 'react';
import classNames from 'classnames';
import style from './input.module.scss';

type TInputProps = {
    size?: 'large' | 'medium' | 'small';
    inputStyle?: 'normal';
    isActive?: boolean;
    onChange?: ChangeEventHandler;
    value: string;
    name?: string;
    label?: string;
    placeholder?: string;
    className?: string;
    type?: string;
};

const Input: FC<TInputProps> = ({
    size = 'medium',
    inputStyle = 'normal',
    isActive = true,
    onChange,
    value = '',
    label = '',
    name = '',
    type = 'text',
    placeholder,
    className,
}) => (
    <label className={classNames('inputWrapper', style[size], style[inputStyle], className)}>
        <span className="line">{label}</span>
        <input
            onChange={onChange}
            name={name}
            value={value}
            disabled={!isActive}
            placeholder={placeholder}
            type={type}
        />
    </label>
);

export default Input;
