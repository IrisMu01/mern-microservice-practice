import {useSelector, useDispatch} from "react-redux";
import {closeModal} from "../../../store/modal/modalSlice";
import {save} from "../../../store/save/saveThunk";
import {modalTypes} from "../../../utils/constants";
import Modal from "../../utils/Modal";
import _ from "lodash";
import {GameFile} from "../game-file/GameFile";
import Card from "react-bootstrap/Card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const GameFileModal = () => {
    const gameFileIds = useSelector(state => state.save.results);
    console.log(gameFileIds);
    const gameState = useSelector(state => state.game);
    const currentUser = useSelector(state => state.auth.currentUser);
    const dispatch = useDispatch();
    
    const doClose = () => {
        dispatch(closeModal());
    };

    const doSaveGame = () => {
        dispatch(save(gameState));
    };
    
    return (
        <Modal variant="lg" modalType={modalTypes.gameFiles}>
            <Modal.Title onClose={doClose}>Game Files</Modal.Title>
            <Modal.Content>
                {_.isEmpty(currentUser) ? (
                    <div className="w-100 text-center">
                        - Sign in to save/load your game files -
                    </div>
                ) : (
                    <div className="d-flex game-file-container">
                        <Card className="game-file add-save" onClick={doSaveGame}>
                            <Card.Body>
                                <FontAwesomeIcon icon={"plus"}/>
                                <div>
                                    Save current game
                                </div>
                            </Card.Body>
                        </Card>
                        {!_.isEmpty(gameFileIds) && (
                            gameFileIds.map((id, i) => (
                                <GameFile key={id} id={id}/>
                            ))
                        )}
                    </div>
                )}
            </Modal.Content>
        </Modal>
    )
}
