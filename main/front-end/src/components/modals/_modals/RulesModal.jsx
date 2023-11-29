import {useDispatch} from "react-redux";
import {closeModal} from "../../../store/modal/modalSlice";
import {modalTypes, ruleIconTypes} from "../../../utils/constants";
import Modal from "../../utils/Modal";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import {RuleIcon} from "../rules/RuleIcon";

export const RulesModal = () => {
    const dispatch = useDispatch();
    
    const doClose = () => {
        dispatch(closeModal());
    }
    
    return (
        <Modal variant="lg" modalType={modalTypes.rules}>
            <Modal.Title onClose={doClose}>Game Rules</Modal.Title>
            <Modal.Content>
                <Accordion
                    activeKey={["0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                    className="rules-accordion"
                    alwaysOpen
                >
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Objectives</Accordion.Header>
                        <Accordion.Body>
                            The world is on the verge of collapse with forbidden goop <RuleIcon type={ruleIconTypes.forbiddenGoop}/> invading every corner! <br/>
                            Stay alive, plant magical trees <RuleIcon type={ruleIconTypes.tree}/> , and harvest their energy to cleanse the land.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Your Status</Accordion.Header>
                        <Accordion.Body>
                            Your hunger <RuleIcon type={ruleIconTypes.hunger}/> and sanity <RuleIcon type={ruleIconTypes.sanity}/> can be between 0-100. <br/>
                            The game is over when your sanity drops to 0. <br/>
                            Regularly eat at your home <RuleIcon type={ruleIconTypes.home}/> so you can have more action points <RuleIcon type={ruleIconTypes.actionPoint}/> , <br/>
                            and starving will drive you insane!
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Controls</Accordion.Header>
                        <Accordion.Body>
                            Click <RuleIcon type={ruleIconTypes.movementW}/> <RuleIcon type={ruleIconTypes.movementA}/> <RuleIcon type={ruleIconTypes.movementS}/> <RuleIcon type={ruleIconTypes.movementD}/> to move around. This does not cost you action points <RuleIcon type={ruleIconTypes.actionPoint}/> . <br/>
                            Toggle <RuleIcon type={ruleIconTypes.human}/> / <RuleIcon type={ruleIconTypes.dog}/> to switch between your active characters. <br/>
                            The available actions are on their left. <br/>
                            Forward time to gain more action points, <br/>
                            and if something went horribly wrong you can reverse time ... at a cost.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>The Map</Accordion.Header>
                        <Accordion.Body>
                            Home <RuleIcon type={ruleIconTypes.home}/> : Your home.<br/>
                            Grass <RuleIcon type={ruleIconTypes.grass}/> : A normal patch of grassland.<br/>
                            Cursed land <RuleIcon type={ruleIconTypes.cursedLand}/> : Infected with forbidden goop. Walking on them doesn't do good to your mental health. <br/>
                            Shallow water <RuleIcon type={ruleIconTypes.shallowWater}/> : You can walk into these waters without drowning yourself. <br/>
                            Deep water <RuleIcon type={ruleIconTypes.deepWater}/> : You can't really swim, so you'll need a boat. <br/>
                            Pawed grass <RuleIcon type={ruleIconTypes.pawedGrass}/> : Walking in the paw print's direction leads you to a trusty companion! <br/>
                            Unexplored <RuleIcon type={ruleIconTypes.unexplored}/> : Covered in dense fog. You can't really walk into these areas.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="4">
                        <Accordion.Header>Exploring</Accordion.Header>
                        <Accordion.Body>
                            The explore action allows you to clear out fogs <RuleIcon type={ruleIconTypes.unexplored}/> 1 block around you. <br/>
                            Building a boat <RuleIcon type={ruleIconTypes.boat}/> with 5 pieces of wood <RuleIcon type={ruleIconTypes.wood}/> lets you travel across deep waters <RuleIcon type={ruleIconTypes.deepWater}/> .
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="5">
                        <Accordion.Header>The trees</Accordion.Header>
                        <Accordion.Body>
                            Plant a sapling <RuleIcon type={ruleIconTypes.sapling}/> and they'll grow tall in a few rounds. <br/>
                            Saplings on cursed land <RuleIcon type={ruleIconTypes.cursedTree}/> will take longer to grow. <br/>
                            Release the energy from a grown tree <RuleIcon type={ruleIconTypes.tree}/> to turn cursed lands around it to normal grasslands <RuleIcon type={ruleIconTypes.cursedLand}/> -> <RuleIcon type={ruleIconTypes.grass}/> . You'll also gain some saplings <RuleIcon type={ruleIconTypes.sapling}/> . <br/>
                            A grown tree may wilt <RuleIcon type={ruleIconTypes.wilt}/> the next round. A grown tree on cursed lands <RuleIcon type={ruleIconTypes.cursedTree}/> may wilt faster. <br/>
                            If the wilt is not cleaned up, the next round it may turn normal grasslands around it into cursed grasslands <RuleIcon type={ruleIconTypes.grass}/> -> <RuleIcon type={ruleIconTypes.cursedLand}/> .
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="6">
                        <Accordion.Header>Getting food</Accordion.Header>
                        <Accordion.Body>
                            You need fish <RuleIcon type={ruleIconTypes.fish}/> and/or crops <RuleIcon type={ruleIconTypes.crop}/> to make food <RuleIcon type={ruleIconTypes.food}/> . <br/>
                            You can catch fish <RuleIcon type={ruleIconTypes.fish}/> from shallow water <RuleIcon type={ruleIconTypes.shallowWater}/> , or from deep water <RuleIcon type={ruleIconTypes.deepWater}/> too on a boat <RuleIcon type={ruleIconTypes.boat}/> . <br/>
                            You can harvest crops <RuleIcon type={ruleIconTypes.crop}/> from grown farms, and a farm can be started with a seedling <RuleIcon type={ruleIconTypes.seed}/> from the inventory. <br/>
                            Eating does not consume action points <RuleIcon type={ruleIconTypes.actionPoint}/> , but making food consumes 1.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="7">
                        <Accordion.Header>Resting</Accordion.Header>
                        <Accordion.Body>
                            Resting at your home <RuleIcon type={ruleIconTypes.home}/> clears out action points <RuleIcon type={ruleIconTypes.actionPoint}/>, and restores sanity <RuleIcon type={ruleIconTypes.sanity}/> when you forward to the next round. <br/>
                            At night <RuleIcon type={ruleIconTypes.night}/> , the more you stay up doing work, the less you are able to keep sane...
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="8">
                        <Accordion.Header>Your trusty companion</Accordion.Header>
                        <Accordion.Body>
                            If you find a paw print <RuleIcon type={ruleIconTypes.pawedGrass}/> , walk in its direction to find more paw prints <RuleIcon type={ruleIconTypes.pawedGrass}/> or a dog <RuleIcon type={ruleIconTypes.dog}/> ! <br/>
                            Feed the dog with food <RuleIcon type={ruleIconTypes.food}/> and it'll join you. <br/>
                            The dog can swim across all waters <RuleIcon type={ruleIconTypes.shallowWater}/> <RuleIcon type={ruleIconTypes.deepWater}/> , explore, and clean up wilt <RuleIcon type={ruleIconTypes.wilt}/> for you. <br/>
                            After the dog joins your team, if you don't feed it often <RuleIcon type={ruleIconTypes.hunger}/> you will lose a teammate to starvation, and a big chunk of sanity <RuleIcon type={ruleIconTypes.sanity}/> . <br/>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Modal.Content>
            <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={doClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
