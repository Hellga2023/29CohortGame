import React, { FC, ReactNode } from 'react';

type TFormProps = {
    children?: ReactNode;
    className?: string;
};

const Form: FC<TFormProps> = ({ children, className }) => (
    <form className={className}>{children}</form>
);

export default Form;
