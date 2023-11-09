import {useDispatch} from "react-redux";
import {getCurrentUser} from "./store/auth/authThunks";
import './style/App.scss';
import {loadIcons} from "./fontAwesome";
import {NotificationList} from "./components/notification/NotificationList";
import {Game} from "./components/game/Game";
import {Navigation} from "./components/Navigation";
import {Modals} from "./components/modals/Modals";

loadIcons();

function App() {
    const dispatch = useDispatch();
    dispatch(getCurrentUser());
    
    return (
        <div className="App">
            {/* overlays */}
            <NotificationList/>
            <Modals/>
            {/* the page */}
            <Navigation/>
            <Game/>
        </div>
    );
}

export default App;
