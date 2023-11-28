import {useSelector, useDispatch} from "react-redux";
import {resetGame} from "../../../store/game/gameSlice";
import {openModal} from "../../../store/modal/modalSlice";
import {findAllSavesForCurrentUser} from "../../../store/save/saveThunk";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {DoubleCheckButton} from "../../utils/DoubleCheckButton";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {modalTypes} from "../../../utils/constants";
import _ from "lodash";

export const GameFileControl = () => {
  const currentUser = useSelector(state => state.auth.currentUser);
  const dispatch = useDispatch();

  const doResetGame = () => {
    dispatch(resetGame());
  }

  const openGameFileOrLoginModal = async () => {
    if (!_.isEmpty(currentUser)) {
      await dispatch(findAllSavesForCurrentUser());
      dispatch(openModal({ type: modalTypes.gameFiles }));
    } else {
      dispatch(openModal({ type: modalTypes.signIn }));
    }
  }

  return (
      <Row className="mt-2">
        <Col>
          <DoubleCheckButton
              defaultVariant="outline-warning"
              confirmedVariant="outline-danger"
              className="w-100 text-center"
              size="sm"
              onClickDispatch={doResetGame}
              content={(
                  <div>
                    <FontAwesomeIcon icon={"refresh"}/>
                    <span className="ms-2">
                            Restart Game
                        </span>
                  </div>
              )}
          />
        </Col>
        <Col>
          <Button
              variant="outline-success"
              size="sm"
              className="w-100 text-center"
              onClick={openGameFileOrLoginModal}
          >
            <div>
              <FontAwesomeIcon icon={"refresh"}/>
              <span className="ms-2">
                  Save/Load
                </span>
            </div>
          </Button>
        </Col>
      </Row>
  )
}
