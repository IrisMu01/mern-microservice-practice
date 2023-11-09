import axios from "axios";
import {setCurrentUser} from "./authSlice";
import {addError, addMessage} from "../notification/notificationSlice";

const authServiceClient = axios.create({
    baseURL: "http://localhost:4000/api/auth",
    timeout: 30000
});

const userServiceClient = axios.create({
    baseURL: "http://localhost:4001/api/users",
    timeout: 30000
});

export const login = credentials => dispatch => {
    authServiceClient.post("/login", {
            username: credentials.username,
            password: credentials.password
        })
        .then(response => {
            console.log(response);
            dispatch(setCurrentUser({
                payload: response.user
            }));
        })
        .catch(error => {
            console.log(error);
            dispatch(addError({
                payload: error.message || error
            }));
        });
};

export const logout = () => dispatch => {
    authServiceClient.get("/logout")
        .then(response => {
            console.log(response);
            dispatch(setCurrentUser({
                payload: null
            }));
        })
        .catch(error => {
            console.log(error);
            dispatch(addError({
                payload: error.message || error
            }));
        });
};

export const register = user => dispatch => {
    userServiceClient.post("/register", user)
        .then(response => {
            console.log(response.verificationKey); // todo change behaviour later
        })
        .catch(error => {
            dispatch(addError({
                payload: error.message || error
            }));
        });
};

export const deleteAccount = password => dispatch => {
    userServiceClient.post("/delete-my-account", {
            password: password
        })
        .then(response => {
            dispatch(setCurrentUser({
                payload: null
            }));
        })
        .catch(error => {
            dispatch(addError({
                payload: error.message || error
            }));
        });
};

export const changePassword = (oldPassword, newPassword) => dispatch => {
    userServiceClient.post("/register", {
            oldPassword: oldPassword,
            newPassword: newPassword
        })
        .then(response => {
            dispatch(addMessage({
                payload: "Password changed successfully"
            }));
        })
        .catch(error => {
            dispatch(addError({
                payload: error.message || error
            }))
        });
};
