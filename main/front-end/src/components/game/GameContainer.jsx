import {Terrain} from "./Terrain";
import {Player} from "./Player";

export const GameContainer = () => {
    return (
        <div className="w-100">
            <div className="w-100 text-center">
                Game container
            </div>
            <Terrain/>
            <Player/>
        </div>
    )
}