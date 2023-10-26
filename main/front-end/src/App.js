import './style/App.scss';
import {loadIcons} from "./fontAwesome";
import {MapContainer} from "./components/map/MapContainer";
import {ActionPanel} from "./components/action-panel/ActionPanel";

loadIcons();

function App() {
    return (
    <div className="App">
      <div className="d-flex mx-0">
          <ActionPanel/>
          <MapContainer/>
      </div>
    </div>
  );
}

export default App;
