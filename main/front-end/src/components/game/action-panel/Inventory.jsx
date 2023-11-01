import { useSelector } from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Inventory = () => {
    const inventory = useSelector(state => state.game.player.inventory);
    
    return (
        <div className="inventory row mx-0">
            <div className="col-12 mb-2 text-center">
                Inventory
            </div>
            <div className="col-4">
                <span className="inventory-icon seed">
                    <FontAwesomeIcon icon={"seedling"}/>
                </span>
                {inventory.seed}
            </div>
            <div className="col-4">
                <span className="inventory-icon sapling">
                    <FontAwesomeIcon icon={"tree"}/>
                </span>
                {inventory.sapling}
            </div>
            <div className="col-4">
                <span className="inventory-icon wood">
                    <FontAwesomeIcon icon={"cubes-stacked"}/>
                </span>
                {inventory.wood}
            </div>
            <div className="col-4">
                <span className="inventory-icon fish">
                    <FontAwesomeIcon icon={"fish"}/>
                </span>
                {inventory.fish}
            </div>
            <div className="col-4">
                <span className="inventory-icon crop">
                    <FontAwesomeIcon icon={"wheat-awn"}/>
                </span>
                {inventory.crop}
            </div>
            <div className="col-4">
                <span className="inventory-icon food">
                    <FontAwesomeIcon icon={"bowl-food"}/>
                </span>
                {inventory.food}
            </div>
        </div>
    )
}