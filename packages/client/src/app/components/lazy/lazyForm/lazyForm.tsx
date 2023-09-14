import React, { FC, ReactNode } from 'react';

import Form from '../../common/form/form';
import LazyInput, { TInputProps } from '../lazyInput/lazyInput';

import { someFunction } from '@/const/types';

type ChangeInputEvent = React.ChangeEvent<HTMLInputElement>;
type TInputHandler = (event: ChangeInputEvent, callback: someFunction) => unknown;

const handleChange: TInputHandler = (event, callback) => {
    callback(event.target.value);
};

interface IInputData extends TInputProps {
    handler: someFunction;
}

type TLazyFormProps = {
    inputs: IInputData[];
    children?: ReactNode;
    className?: string;
    wrapType?: string;
};

const LazyForm: FC<TLazyFormProps> = ({
    children,
    className,
    inputs,
    wrapType = 'line stretch',
}) => (
    <Form className={className}>
        {inputs.map(inputData => (
            <LazyInput
                key={inputData.name}
                value={inputData.value}
                type={inputData.type}
                wrapType={wrapType}
                onChange={e => handleChange(e as ChangeInputEvent, inputData.handler)}
                name={inputData.name}
                inputStyle="normal"
            />
        ))}

        {children}
    </Form>
);

export default LazyForm;
