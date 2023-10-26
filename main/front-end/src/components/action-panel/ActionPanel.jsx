import {ResetGame} from "./ResetGame";
import {HumanStatus} from "./HumanStatus";
import {DogStatus} from "./DogStatus";
import {Inventory} from "./Inventory";
import {MovementControl} from "./MovementControl";
import {ActionControl} from "./ActionControl";
import {TimeControl} from "./TimeControl";

export const ActionPanel = () => {
    return (
        <div className="action-panel">
            <HumanStatus/>
            <DogStatus/>
            <Inventory/>
            <div className="row">
                <div className="col-6">
                    <ActionControl/>
                </div>
                <div className="col-6">
                    <MovementControl/>
                </div>
            </div>
            <TimeControl/>
            <ResetGame/>
        </div>
    )
}
