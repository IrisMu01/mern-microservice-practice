import {useState} from "react";
import {useDispatch} from "react-redux";
import {deleteAccount} from "../../../store/auth/authThunks";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {addError} from "../../../store/notification/notificationSlice";

export const DeleteAccount = () => {
    const [ password, setPassword ] = useState(null);
    const [ confirmPassword, setConfirmPassword ] = useState(null);
    
    const dispatch = useDispatch();
    
    const doDeleteAccount = () => {
        if (password !== confirmPassword) {
            // todo add proper form validation - addError should be reserved for errors coming from the backend
            dispatch(addError("The password and confirmed password do not match"));
        } else {
            dispatch(deleteAccount(password));
        }
    }
    
    return (
        <Form>
            <div className="text-danger">
                Are you sure you want to delete your account? All your game save files will be lost.
            </div>
            
            <Form.Group controlId="changeNewPassword" className="form-group">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password" required
                    onChange={event => setPassword(event.target.value)}
                />
            </Form.Group>
    
            <Form.Group controlId="changeNewConfirmPassword" className="form-group">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password" required
                    onChange={event => setConfirmPassword(event.target.value)}
                />
            </Form.Group>
    
            <Button variant="danger" onClick={doDeleteAccount} className="mt-2">
                Delete Account
            </Button>
        </Form>
    )
}
