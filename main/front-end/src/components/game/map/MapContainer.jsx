import {Terrain} from "./Terrain";
import {Fog} from "./Fog";
import {Player} from "./Player";

export const MapContainer = () => {
    return (
        <div className="map-container">
            <Terrain/>
            <Fog/>
            <Player/>
        </div>
    )
}