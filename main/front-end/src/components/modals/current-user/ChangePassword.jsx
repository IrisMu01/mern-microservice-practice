import {useState} from "react";
import {useDispatch} from "react-redux";
import {changePassword} from "../../../store/auth/authThunks";
import {addError} from "../../../store/notification/notificationSlice";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export const ChangePassword = () => {
    const [ oldPassword, setOldPassword ] = useState(null);
    const [ password, setPassword ] = useState(null);
    const [ confirmPassword, setConfirmPassword ] = useState(null);
    
    const dispatch = useDispatch();
    
    const doChangePassword = () => {
        if (password !== confirmPassword) {
            // todo add proper form validation - addError should be reserved for errors coming from the backend
            dispatch(addError("The new password and confirmed new password do not match"));
        } else {
            dispatch(changePassword({
                oldPassword: oldPassword,
                newPassword: password
            }));
        }
    }
    
    return (
        <Form>
            <Form.Group controlId="changeOldPassword" className="form-group">
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                    type="password" required
                    onChange={event => setOldPassword(event.target.value)}
                />
            </Form.Group>
            
            <Form.Group controlId="changeNewPassword" className="form-group">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                    type="password" required
                    onChange={event => setPassword(event.target.value)}
                />
            </Form.Group>
    
            <Form.Group controlId="changeNewConfirmPassword" className="form-group">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                    type="password" required
                    onChange={event => setConfirmPassword(event.target.value)}
                />
            </Form.Group>
            
            <Button variant="success" onClick={doChangePassword} className="mt-2">
                Change Password
            </Button>
        </Form>
    )
}
