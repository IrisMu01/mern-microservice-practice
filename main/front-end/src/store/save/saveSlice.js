import {createSlice} from "@reduxjs/toolkit";

export const saveSlice = createSlice({
    name: "save",
    initialState: {
        gameSaves: {}
    },
    reducers: {
        loadSaves: (state, action) => {
            state.gameSaves = action.payload;
        },
        addSave: (state, action) => {
            const save = action.payload;
            state.gameSaves[save._id] = save;
        },
        removeSave: (state, action) => {
            delete state.gameSaves[action.payload];
        }
    }
});

export const {
    loadSaves,
    addSave,
    removeSave
} = saveSlice.actions;

export default saveSlice.reducer;
