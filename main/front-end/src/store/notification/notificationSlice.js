import {createSlice} from "@reduxjs/toolkit";
import {notificationTypes} from "../../utils/constants";

export const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: {}
    },
    reducers: {
        addError: (state, action) => {
            const timestamp = new Date().getTime();
            state.notifications[timestamp] = {
                type: notificationTypes.error,
                message: action.payload
            };
        },
        addMessage: (state, action) => {
            const timestamp = new Date().getTime();
            state.notifications[timestamp] = {
                type: notificationTypes.message,
                message: action.payload
            };
        },
        removeNotification: (state, action) => {
            const timestamp = action.payload;
            delete state.notifications[timestamp];
        }
    }
});

export const {
    addError,
    addMessage,
    removeNotification
} = notificationSlice.actions;

export default notificationSlice.reducer;
