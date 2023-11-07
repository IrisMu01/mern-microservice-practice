import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NavLink from "react-bootstrap/NavLink";

export const Navigation = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    
    return (
        <Navbar expand="sm" data-bs-theme="dark" bg="navbar" sticky="top">
            <Container>
                <Navbar.Brand>Game Title</Navbar.Brand>
                <Navbar.Toggle aria-controls="page-navbar" />
                <Navbar.Collapse id="page-navbar" className="justify-content-end">
                    {currentUser ? (
                        <NavLink>
                            <Navbar.Text className="d-flex align-items-center">
                                @username
                                <FontAwesomeIcon icon={"sign-out"} className="ms-2"/>
                            </Navbar.Text>
                        </NavLink>
                    ) : (
                        <NavLink>
                            <Navbar.Text>Sign In/Sign Up</Navbar.Text>
                        </NavLink>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
