import axios from "axios";
import {setCurrentUser} from "./authSlice";
import {addError, addMessage} from "../notification/notificationSlice";
import {closeModal} from "../modal/modalSlice";

const authServiceClient = axios.create({
    baseURL: "http://localhost:4000/api/auth",
    timeout: 30000,
    withCredentials: true
});

const userServiceClient = axios.create({
    baseURL: "http://localhost:4001/api/users",
    timeout: 30000,
    withCredentials: true
});

export const login = credentials => dispatch => {
    authServiceClient.post("/login", {
            username: credentials.username,
            password: credentials.password
        })
        .then(response => {
            dispatch(setCurrentUser(response.data.user));
            dispatch(addMessage("You have logged in"));
            dispatch(closeModal());
        })
        .catch(error => {
            console.error(error);
            dispatch(addError(error?.response?.data?.message || error));
        });
};

export const logout = () => dispatch => {
    authServiceClient.get("/logout")
        .then(response => {
            dispatch(setCurrentUser(null));
            dispatch(addMessage("You have logged out"));
        })
        .catch(error => {
            console.error(error);
            dispatch(addError(error?.response?.data?.message || error));
        });
};

export const getCurrentUser = () => dispatch => {
    userServiceClient.get("/my-profile")
        .then(response => {
            dispatch(setCurrentUser(response.data.user));
        })
        .catch(error => {
            // no-op
        });
};

export const register = user => dispatch => {
    userServiceClient.post("/register", user)
        .then(response => {
            dispatch(addMessage(`Account @${response.data.username} has been created`));
            dispatch(closeModal());
        })
        .catch(error => {
            dispatch(addError(error?.response?.data?.message || error));
        });
};

export const deleteAccount = password => dispatch => {
    userServiceClient.put("/delete-my-account", {
            password: password
        })
        .then(response => {
            dispatch(closeModal());
            dispatch(addMessage("Your account has been deleted"));
            dispatch(setCurrentUser(null));
        })
        .catch(error => {
            dispatch(addError(error?.response?.data?.message || error));
        });
};

export const changePassword = ({oldPassword, newPassword}) => dispatch => {
    userServiceClient.put("/change-password", {
            oldPassword: oldPassword,
            newPassword: newPassword
        })
        .then(response => {
            dispatch(addMessage("Password changed successfully"));
        })
        .catch(error => {
            dispatch(addError(error?.response?.data?.message || error));
        });
};
