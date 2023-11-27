import {useDispatch} from "react-redux";
import {closeModal} from "../../../store/modal/modalSlice";
import {modalTypes} from "../../../utils/constants";
import Modal from "../../utils/Modal";


export const GameFileModal = () => {
    const dispatch = useDispatch();
    
    const doClose = () => {
        dispatch(closeModal());
    };
    
    return (
        <Modal variant="lg" modalType={modalTypes.gameFiles}>
            <Modal.Title onClose={doClose}>Game Files</Modal.Title>
            <Modal.Content>
                <div>
                    <div className="game-file-container">
                    
                    </div>
                    <div className="text-danger">
                        Progress in the current game will be lost if you do not save it before loading a new one.
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    )
}
