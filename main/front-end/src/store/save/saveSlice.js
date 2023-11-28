import {createSlice} from "@reduxjs/toolkit";
import _ from "lodash";

export const saveSlice = createSlice({
    name: "save",
    initialState: {
        query: {},
        results: [], // the list of game ids
        gameSaves: {} // the full entities
    },
    reducers: {
        loadSaves: (state, action) => {
            state.query = action.payload.query;
            state.results = action.payload.results;
            state.gameSaves = action.payload.gameSaves;
        },
        addSave: (state, action) => {
            const save = action.payload;
            state.results = [save._id, ...state.results];
            state.gameSaves[save._id] = save;
        },
        removeSave: (state, action) => {
            _.pull(state.results, action.payload);
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
