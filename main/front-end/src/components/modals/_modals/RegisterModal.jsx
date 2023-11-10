import Modal from "../../utils/Modal";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {register} from "../../../store/auth/authThunks";
import {closeModal} from "../../../store/modal/modalSlice";
import {addError} from "../../../store/notification/notificationSlice";
import {modalTypes} from "../../../utils/constants";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export const RegisterModal = () => {
    const [ username, setUsername ] = useState(null);
    const [ email, setEmail ] = useState(null);
    const [ password, setPassword ] = useState(null);
    const [ confirmPassword, setConfirmPassword ] = useState(null);
    const dispatch = useDispatch();
    const doClose = () => {
        dispatch(closeModal());
    };
    const doRegister = () => {
        if (password !== confirmPassword) {
            // todo add proper form validation - addError should be reserved for errors coming from the backend
            dispatch(addError("The password and confirmed password do not match"));
        } else {
            dispatch(register({
                username: username,
                email: email,
                password: password
            }));
        }
    };
    
    return (
        <Modal variant="lg" modalType={modalTypes.register}>
            <Modal.Title onClose={doClose}>Sign Up</Modal.Title>
            <Modal.Content>
                <Form>
                    <Form.Group controlId="registerUsername" as={Row} className="form-group">
                        <Col sm="3">
                            <Form.Label>Username</Form.Label>
                        </Col>
                        <Col sm="9">
                            <Form.Control
                                type="text" required
                                onChange={event => setUsername(event.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    
                    <Form.Group controlId="registerEmail" as={Row} className="form-group">
                        <Col sm="3">
                            <Form.Label>Email Address</Form.Label>
                        </Col>
                        <Col sm="9">
                            <Form.Control
                                type="email" required
                                onChange={event => setEmail(event.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    
                    <Form.Group controlId="registerPassword" as={Row} className="form-group">
                        <Col sm="3">
                            <Form.Label>Password</Form.Label>
                        </Col>
                        <Col sm="9">
                            <Form.Control
                                type="password" required
                                onChange={event => setPassword(event.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    
                    <Form.Group controlId="registerConfirmPassword" as={Row} className="form-group">
                        <Col sm="3">
                            <Form.Label>Confirm Password</Form.Label>
                        </Col>
                        <Col sm="9">
                            <Form.Control
                                type="password" required
                                onChange={event => setConfirmPassword(event.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    
                    <Button variant="success" onClick={doRegister}>
                        Create Account
                    </Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}
