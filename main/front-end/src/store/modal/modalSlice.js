import _ from "lodash";
import {createSlice} from "@reduxjs/toolkit";
import {modalTypes} from "../../utils/constants";

const initialModals = {};
const initialModalStatus = { open: false, data: null };
_.forEach(modalTypes, (value, key) => {
    initialModals[value] = initialModalStatus;
});

export const modalSlice = createSlice({
    name: "modal",
    initialState: {
        priorities: [],
        modals: initialModals
    },
    reducers: {
        openModal: (state, action) => {
            if (!Object.values(modalTypes).includes(action?.payload?.type)) {
                console.error("Invalid modal type: " + action?.payload?.type);
                return;
            } else if (state.priorities.includes(action?.payload?.type)) {
                console.error("This modal is already open: " + action?.payload?.type);
            }
            state.priorities.push(action.payload.type);
            state.modals[action.payload.type] = {
                open: true,
                priority: state.priorities.length,
                data: action.payload.data
            };
        },
        closeModal: (state, action) => {
            const modalType = state.priorities.pop();
            state.modals[modalType] = initialModalStatus;
        }
    }
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
