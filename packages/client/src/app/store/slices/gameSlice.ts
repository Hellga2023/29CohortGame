import { createSlice } from '@reduxjs/toolkit';
import { GlobalGameState } from '@/game/store/objectState';

type TGameState = {
    gameState: GlobalGameState;
    score: number;
};

const initialState: TGameState = {
    gameState: GlobalGameState.Loaded,
    score: 0,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameState: (state, action) => {
            state.gameState = action.payload;
        },
    },
});

export const { setGameState } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
