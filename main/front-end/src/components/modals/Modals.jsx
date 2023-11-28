import {useSelector} from "react-redux";
import {modalTypes} from "../../utils/constants";
import {RegisterModal} from "./_modals/RegisterModal";
import {SignInModal} from "./_modals/SignInModal";
import {CurrentUserModal} from "./_modals/CurrentUserModal";
import {GameFileModal} from "./_modals/GameFileModal";

// todo a case-sensitive font family should be used for the account-related functionalities
export const Modals = () => {
    const openModals = useSelector(state => state.modal.priorities);
    
    const IndividualModal = (type) => {
        switch (type) {
            case (modalTypes.register):
                return (
                    <RegisterModal/>
                );
            case (modalTypes.signIn):
                return (
                    <SignInModal/>
                );
            case (modalTypes.currentUser):
                return (
                    <CurrentUserModal/>
                );
            case (modalTypes.gameFiles):
                return (
                    <GameFileModal/>
                );
            default:
                return (<div></div>);
        }
    }
    
    return (
        <div>
            {openModals.map((modalType, i) => (
                <div key={modalType}>
                    {IndividualModal(modalType)}
                </div>
            ))}
        </div>
    )
}
