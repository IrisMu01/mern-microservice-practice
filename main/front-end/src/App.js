import './style/App.scss';
import {loadIcons} from "./fontAwesome";
import {MapContainer} from "./components/game/map/MapContainer";
import {ActionPanel} from "./components/game/action-panel/ActionPanel";
import {WinLoseModal} from "./components/game/WinLoseModal";

loadIcons();

function App() {
    return (
        <div className="App">
            <WinLoseModal/>
            <div className="d-flex mx-0">
                <ActionPanel/>
                <MapContainer/>
            </div>
        </div>
    );
}

export default App;
