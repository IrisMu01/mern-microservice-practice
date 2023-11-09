import {useDispatch, useSelector} from "react-redux";
import {closeModal, openModal} from "../../../store/modal/modalSlice";
import {modalTypes} from "../../../utils/constants";
import Modal from "../../utils/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// todo
//  - use thunk to connect to Auth/UserService
//  - register form validation
//  - finish other modals
export const SignInModal = () => {
    const dispatch = useDispatch();
    const doClose = () => {
        dispatch(closeModal());
    }
    
    const openRegisterModal = () => {
        dispatch(openModal({
            type: modalTypes.register,
            data: null
        }));
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
                            <Form.Control type="text" required />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="signInPassword" as={Row} className="form-group">
                        <Col sm="3">
                            <Form.Label>Password</Form.Label>
                        </Col>
                        <Col sm="9">
                            <Form.Control type="password" required />
                        </Col>
                    </Form.Group>
                    
                    <Button className="px-0" variant="link" onClick={openRegisterModal}>
                        Create An Account
                    </Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}
