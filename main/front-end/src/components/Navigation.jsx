import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/auth/authThunks";
import { openModal } from "../store/modal/modalSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NavLink from "react-bootstrap/NavLink";
import Nav from "react-bootstrap/Nav";
import { modalTypes } from "../utils/constants";

export const Navigation = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const dispatch = useDispatch();
    
    const doSignOut = () => {
        dispatch(logout());
    }
    
    const openSignInModal = () => {
        dispatch(openModal({
            type: modalTypes.signIn,
            data: null
        }));
    };
    
    const openCurrentUserModal = () => {
        dispatch(openModal({
            type: modalTypes.currentUser,
            data: null
        }));
    };
    
    const openRulesModal = () => {
        dispatch(openModal({
            type: modalTypes.rules,
            data: null
        }));
    };
    
    return (
        <Navbar expand="sm" data-bs-theme="dark" bg="navbar" sticky="top">
            <Container>
                <Navbar.Brand>Game Title</Navbar.Brand>
                <Navbar.Toggle aria-controls="page-navbar" />
                <Navbar.Collapse id="page-navbar">
                    <Nav>
                        <NavLink onClick={openRulesModal}>
                            <Navbar.Text>How To Play</Navbar.Text>
                        </NavLink>
                    </Nav>
                    <Nav className="ms-auto d-flex align-items-center">
                        {currentUser && (
                            <NavLink onClick={openCurrentUserModal}>
                                <Navbar.Text className="d-flex align-items-center">
                                    {`@${currentUser.username}`}
                                </Navbar.Text>
                            </NavLink>
                        )}
                        {currentUser && (
                            <NavLink>
                                <Navbar.Text>
                                    <FontAwesomeIcon icon={"sign-out"} className="ms-2" onClick={doSignOut}/>
                                </Navbar.Text>
                            </NavLink>
                        )}
                        {!currentUser && (
                            <NavLink>
                                <Navbar.Text onClick={openSignInModal}>Sign In/Sign Up</Navbar.Text>
                            </NavLink>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
