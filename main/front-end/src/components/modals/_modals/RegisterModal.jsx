import Modal from "../../utils/Modal";
import {useSelector, useDispatch} from "react-redux";
import {closeModal} from "../../../store/modal/modalSlice";
import {modalTypes} from "../../../utils/constants";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const RegisterModal = () => {
    const dispatch = useDispatch();
    const doClose = () => {
        dispatch(closeModal());
    }
    
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
                            <Form.Control type="text" required />
                        </Col>
                    </Form.Group>
                    
                    <Form.Group controlId="registerEmail" as={Row} className="form-group">
                        <Col sm="3">
                            <Form.Label>Email Address</Form.Label>
                        </Col>
                        <Col sm="9">
                            <Form.Control type="email" required />
                        </Col>
                    </Form.Group>
                    
                    <Form.Group controlId="registerPassword" as={Row} className="form-group">
                        <Col sm="3">
                            <Form.Label>Password</Form.Label>
                        </Col>
                        <Col sm="9">
                            <Form.Control type="password" required />
                        </Col>
                    </Form.Group>
                    
                    <Form.Group controlId="registerConfirmPassword" as={Row} className="form-group">
                        <Col sm="3">
                            <Form.Label>Confirm Password</Form.Label>
                        </Col>
                        <Col sm="9">
                            <Form.Control type="password" required />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Content>
        </Modal>
    );
}
