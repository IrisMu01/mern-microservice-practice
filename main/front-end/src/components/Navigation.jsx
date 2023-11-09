import { useSelector, useDispatch } from "react-redux";
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
        console.log("sign out");
    }
    
    const openSignInModal = () => {
        dispatch(openModal({
            type: modalTypes.signIn,
            data: null
        }));
    };
    
    return (
        <Navbar expand="sm" data-bs-theme="dark" bg="navbar" sticky="top">
            <Container>
                <Navbar.Brand>Game Title</Navbar.Brand>
                <Navbar.Toggle aria-controls="page-navbar" />
                <Navbar.Collapse id="page-navbar" className="justify-content-end">
                    <Nav>
                        {currentUser ? (
                            <NavLink>
                                <Navbar.Text className="d-flex align-items-center">
                                    @username
                                    <FontAwesomeIcon icon={"sign-out"} className="ms-2" onClick={doSignOut}/>
                                </Navbar.Text>
                            </NavLink>
                        ) : (
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
