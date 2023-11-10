import {useSelector, useDispatch} from "react-redux";
import Modal from "../../utils/Modal";
import {closeModal} from "../../../store/modal/modalSlice";
import {modalTypes} from "../../../utils/constants";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import {MyProfile} from "../current-user/MyProfile";
import {ChangePassword} from "../current-user/ChangePassword";
import {DeleteAccount} from "../current-user/DeleteAccount";

export const CurrentUserModal = () => {
    const dispatch = useDispatch();
    
    const doClose = () => {
        dispatch(closeModal());
    };
    
    return (
        <Modal variant="md" modalType={modalTypes.currentUser}>
            <Modal.Title onClose={doClose}>My Account</Modal.Title>
            <Modal.Content>
                <div className="current-user">
                    <Tab.Container defaultActiveKey="profile">
                        <Row>
                            <Col sm={3}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="profile">My Profile</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="change-password">Change Password</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="delete-account" className="delete-account">Delete Account</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="profile">
                                        <MyProfile/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="change-password">
                                        <ChangePassword/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="delete-account">
                                        <DeleteAccount/>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
            </Modal.Content>
        </Modal>
    )
}
