import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export function useAuth() {
    const user = useSelector((rootState: RootState) => rootState.user);

    return { isAuthenticated: user !== null };
}

export default useAuth;
