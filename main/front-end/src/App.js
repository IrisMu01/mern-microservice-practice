import './style/App.scss';
import {loadIcons} from "./fontAwesome";
import {MapContainer} from "./components/map/MapContainer";
import {ActionPanel} from "./components/action-panel/ActionPanel";

loadIcons();

function App() {
    return (
    <div className="App">
      <div className="row mx-0">
          <div className="col-5">
              <ActionPanel/>
          </div>
          <div className="col-7">
              <MapContainer/>
          </div>
      </div>
    </div>
  );
}

export default App;
