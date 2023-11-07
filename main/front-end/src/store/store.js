import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./game/gameSlice";
import authReducer from "./auth/authSlice";
import notificationReducer from "./notification/notificationSlice";
import modalReducer from "./modal/modalSlice";

export default configureStore({
    reducer: {
        game: gameReducer,
        //auth: authReducer,
        notification: notificationReducer,
        //modal: modalReducer
    }
});
