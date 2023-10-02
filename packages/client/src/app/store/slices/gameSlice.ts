import { createSlice } from '@reduxjs/toolkit';
import { GlobalGameState } from '@/game/store/objectState';

type TGameState = {
    gameState: GlobalGameState;
    score: number;
    enemiesKilled: number;
};

const initialState: TGameState = {
    gameState: GlobalGameState.Loaded,
    score: 0,
    enemiesKilled: 0,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameState: (state, action) => {
            state.gameState = action.payload;
        },
        setScore: (state, action) => {
            state.score = action.payload;
        },
        setKilledNumber: (state, action) => {
            state.enemiesKilled = action.payload;
        },
    },
});

export const { setGameState, setScore, setKilledNumber } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
