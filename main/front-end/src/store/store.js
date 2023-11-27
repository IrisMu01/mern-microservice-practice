import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./game/gameSlice";
import authReducer from "./auth/authSlice";
import notificationReducer from "./notification/notificationSlice";
import modalReducer from "./modal/modalSlice";
import saveReducer from "./save/saveSlice";

export default configureStore({
    reducer: {
        game: gameReducer,
        auth: authReducer,
        notification: notificationReducer,
        modal: modalReducer,
        save: saveReducer
    }
});
