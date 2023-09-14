import React, { FC, ChangeEventHandler } from 'react';
import classNames from 'classnames';
import Input from '../../common/input/input';

export type TInputProps = {
    size?: 'large' | 'medium' | 'small';
    inputStyle?: 'normal';
    isActive?: boolean;
    onChange?: ChangeEventHandler;
    value: string;
    name?: string;
    label?: string;
    placeholder?: string;
    className?: string;
    wrapType?: string;
    type?: string;
};

const LazyInput: FC<TInputProps> = ({
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
    wrapType,
}) => (
    <Input
        onChange={onChange}
        name={name}
        value={value}
        placeholder={placeholder || name}
        label={label || name}
        isActive={isActive}
        className={classNames(className, wrapType)}
        inputStyle={inputStyle}
        size={size}
        type={type}
    />
);

export default LazyInput;
