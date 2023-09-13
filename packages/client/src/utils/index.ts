import { ERRORS_TYPES, TResponse, someObject } from '@/const/types';

export default {
    getcookie: (a: string) => {
        const b = new RegExp(`${a}=([^;]){1,}`);
        const c = b.exec(document.cookie);
        let s;

        if (c) {
            s = c[0].split('=');
        } else {
            return false;
        }

        return s[1] ? s[1] : false;
    },
    safeGetData: (response: someObject | any, logged?: boolean) => {
        if (logged) console.log(response.response);
        try {
            const data = JSON.parse(
                response && typeof response === 'object'
                    ? (response as TResponse).response
                    : response.toString()
            );

            return data;
        } catch {
            throw new Error(ERRORS_TYPES.JSON_parse);
        }
    },

    approximatelyEqual: (firstNumber: number, secondNumber: number, epsilon: number) =>
        Math.abs(firstNumber - secondNumber) < epsilon,
};
