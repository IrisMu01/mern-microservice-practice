import {WinLoseModal} from "./WinLoseModal";
import {ActionPanel} from "./action-panel/ActionPanel";
import {MapContainer} from "./map/MapContainer";

export const Game = () => {
    return (
        <div className="d-flex justify-content-center">
            <div className="game">
                <WinLoseModal/>
                <div className="d-flex mx-0">
                    <ActionPanel/>
                    <MapContainer/>
                </div>
            </div>
        </div>
    )
}
