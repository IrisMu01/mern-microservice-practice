import {ruleIconTypes} from "../../../utils/constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const RuleIcon = ({type}) => {
    switch (type) {
        case ruleIconTypes.forbiddenGoop:
            return (
                <div className="rule-icon cursed-grass">
                    <FontAwesomeIcon icon={"skull"}/>
                </div>
            );
        case ruleIconTypes.tree:
            return (
                <div className="rule-icon tree">
                    <FontAwesomeIcon icon={"tree"}/>
                </div>
            );
        case ruleIconTypes.hunger:
            return (
                <div className="rule-icon hunger default-background">
                    <FontAwesomeIcon icon={"drumstick-bite"}/>
                </div>
            );
        case ruleIconTypes.sanity:
            return (
                <div className="rule-icon sanity default-background">
                    <FontAwesomeIcon icon={"brain"}/>
                </div>
            );
        case ruleIconTypes.actionPoint:
            return (
                <div className="rule-icon action-points default-background">
                    <FontAwesomeIcon icon={"hand"}/>
                </div>
            );
        case ruleIconTypes.home:
            return (
                <div className="rule-icon house">
                    <FontAwesomeIcon icon={"house"}/>
                </div>
            );
        case ruleIconTypes.movementA:
            return (
                <div className="rule-icon movement">
                    <FontAwesomeIcon icon={"chevron-left"}/>
                </div>
            );
        case ruleIconTypes.movementW:
            return (
                <div className="rule-icon movement">
                    <FontAwesomeIcon icon={"chevron-up"}/>
                </div>
            );
        case ruleIconTypes.movementS:
            return (
                <div className="rule-icon movement">
                    <FontAwesomeIcon icon={"chevron-down"}/>
                </div>
            );
        case ruleIconTypes.movementD:
            return (
                <div className="rule-icon movement">
                    <FontAwesomeIcon icon={"chevron-right"}/>
                </div>
            );
        case ruleIconTypes.human:
            return (
                <div className="rule-icon player default-background">
                    <FontAwesomeIcon icon={"user"}/>
                </div>
            );
        case ruleIconTypes.dog:
            return (
                <div className="rule-icon dog default-background">
                    <FontAwesomeIcon icon={"dog"}/>
                </div>
            );
        case ruleIconTypes.grass:
            return (
                <div className="rule-icon grass invisible-icon">
                    <FontAwesomeIcon icon={"user"}/>
                </div>
            );
        case ruleIconTypes.shallowWater:
            return (
                <div className="rule-icon water">
                    <FontAwesomeIcon icon={"water"}/>
                </div>
            );
        case ruleIconTypes.deepWater:
            return (
                <div className="rule-icon water-deep">
                    <FontAwesomeIcon icon={"water"}/>
                </div>
            );
        case ruleIconTypes.cursedLand:
            return (
                <div className="rule-icon cursed-grass">
                    <FontAwesomeIcon icon={"skull"}/>
                </div>
            );
        case ruleIconTypes.pawedGrass:
            return (
                <div className="rule-icon paw">
                    <FontAwesomeIcon icon={"paw"}/>
                </div>
            );
        case ruleIconTypes.cursedTree:
            return (
                <div className="rule-icon cursed-tree">
                    <FontAwesomeIcon icon={"tree"} />
                </div>
            );
        case ruleIconTypes.seed:
            return (
                <div className="rule-icon seed default-background">
                    <FontAwesomeIcon icon={"seedling"}/>
                </div>
            );
        case ruleIconTypes.crop:
            return (
                <div className="rule-icon farm">
                    <FontAwesomeIcon icon={"wheat-awn"}/>
                </div>
            );
        case ruleIconTypes.unexplored:
            return (
                <div className="rule-icon fog invisible-icon">
                    <FontAwesomeIcon icon={"user"}/>
                </div>
            );
        case ruleIconTypes.boat:
            return (
                <div className="rule-icon boat">
                    <FontAwesomeIcon icon={"sailboat"}/>
                </div>
            );
        case ruleIconTypes.wood:
            return (
                <div className="rule-icon wood default-background">
                    <FontAwesomeIcon icon={"cubes-stacked"}/>
                </div>
            );
        case ruleIconTypes.sapling:
            return (
                <div className="rule-icon sapling default-background">
                    <FontAwesomeIcon icon={"tree"}/>
                </div>
            );
        case ruleIconTypes.wilt:
            return (
                <div className="rule-icon wilt">
                    <FontAwesomeIcon icon={"plant-wilt"}/>
                </div>
            );
        case ruleIconTypes.fish:
            return (
                <div className="rule-icon fish default-background">
                    <FontAwesomeIcon icon={"fish"}/>
                </div>
            );
        case ruleIconTypes.food:
            return (
                <div className="rule-icon food default-background">
                    <FontAwesomeIcon icon={"bowl-food"}/>
                </div>
            );
        case ruleIconTypes.night:
            return (
                <div className="rule-icon night default-background">
                    <FontAwesomeIcon icon={"moon"}/>
                </div>
            );
        default:
            return (<div></div>);
    }
}
