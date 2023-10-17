import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './game/gameSlice';

export default configureStore({
    reducer: {
        game: gameReducer
    }
});