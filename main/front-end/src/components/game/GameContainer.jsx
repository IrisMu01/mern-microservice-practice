import {Terrain} from "./Terrain";
import {Fog} from "./Fog";
import {Player} from "./Player";

export const GameContainer = () => {
    return (
        <div className="game-container">
            <Terrain/>
            <Fog/>
            <Player/>
        </div>
    )
}