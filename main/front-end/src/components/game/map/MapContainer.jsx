import {Terrain} from "./Terrain";
import {Fog} from "./Fog";
import {Player} from "./Player";
import {NightOverlay} from "./NightOverlay";

export const MapContainer = () => {
    return (
        <div className="map-container">
            <Terrain/>
            <Fog/>
            <Player/>
            <NightOverlay/>
        </div>
    )
}
