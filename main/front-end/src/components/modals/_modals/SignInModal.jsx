import {useState} from "react";
import {useDispatch} from "react-redux";
import {closeModal, openModal} from "../../../store/modal/modalSlice";
import {login} from "../../../store/auth/authThunks";
import {modalTypes} from "../../../utils/constants";
import Modal from "../../utils/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// todo
//  - register form validation
//  - finish other modals
export const SignInModal = () => {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const dispatch = useDispatch();
    
    const doClose = () => {
        dispatch(closeModal());
    };
    
    const openRegisterModal = () => {
        dispatch(openModal({
            type: modalTypes.register,
            data: null
        }));
    };
    
    const doSignIn = () => {
        dispatch(login({username: username, password: password}));
    };
    
    return (
        <Modal variant="md" modalType={modalTypes.signIn}>
            <Modal.Title onClose={doClose}>Sign In</Modal.Title>
            <Modal.Content>
                <Form>
                    <Form.Group controlId="signInUsername" as={Row} className="form-group">
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
                    <Form.Group controlId="signInPassword" as={Row} className="form-group">
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
                    
                    <div className="d-flex">
                        <Button variant="success" onClick={doSignIn}>
                            Sign In
                        </Button>
                        <Button className="px-0 ms-auto" variant="link" onClick={openRegisterModal}>
                            Create An Account
                        </Button>
                    </div>
                
                </Form>
            </Modal.Content>
        </Modal>
    );
}
