import {HumanStatus} from "./HumanStatus";
import {DogStatus} from "./DogStatus";
import {Inventory} from "./Inventory";
import {MovementControl} from "./MovementControl";

export const ActionPanel = () => {
    return (
        <div className="action-panel">
            <HumanStatus/>
            <DogStatus/>
            <Inventory/>
            <div className="row">
                <div className="col-8">
                    block-specific actions
                </div>
                <div className="col-4">
                    <MovementControl/>
                </div>
            </div>
            <div>
                <div>
                    clock | round count
                </div>
                <div>
                    forward/reverse time
                </div>
            </div>
        </div>
    )
}