import './style/App.scss';
import {loadIcons} from "./fontAwesome";
import {GameContainer} from "./components/game/GameContainer";

loadIcons();

function App() {
    return (
    <div className="App">
      <div>
        <GameContainer/>
      </div>
    </div>
  );
}

export default App;
