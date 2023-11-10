import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const MyProfile = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    
    return (
        <div>
            <div className="d-flex align-items-center my-1">
                <FontAwesomeIcon icon={"user-circle"} className="me-2"/>
                <span>@{currentUser.username}</span>
            </div>
            <div className="d-flex align-items-center my-1">
                <FontAwesomeIcon icon={"envelope"} className="me-2"/>
                <span>{currentUser.email}</span>
            </div>
        </div>
    )
}
