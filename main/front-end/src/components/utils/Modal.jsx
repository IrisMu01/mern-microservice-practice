// not using the Modal component from react-bootstrap
// because it only supports one modal per page;
// this project experiments with being able to open multiple modals simultaneously.
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Modal = ({children, variant, modalType, className}) => {
    const modal = useSelector(state => state.modal.modals[modalType]);
    const priority = modal?.priority || 0;
    
    const getModalClassName = () => {
        const classes = ["custom-modal"];
        if (["sm", "md", "lg"].includes(variant)) {
            classes.push(variant);
        }
        if (className) {
            classes.push(className);
        }
        return classes.join(" ");
    };
    
    return (
        <div className={getModalClassName()}>
            <div className="modal-box" style={{zIndex: 100 + priority}}>
                {children}
            </div>
        </div>
    )
}

Modal.Title = ({children, onClose}) => {
    return (
        <div className="modal-title">
            {children}
            <FontAwesomeIcon icon={"x"} className="close-icon" onClick={onClose}/>
        </div>
    );
};

Modal.Content = ({children}) => {
    return (
        <div className="modal-content">
            {children}
        </div>
    );
};

Modal.Footer = ({children}) => {
    return (
        <div className="modal-footer">
            {children}
        </div>
    );
};

export default Modal;
