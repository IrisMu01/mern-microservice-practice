import {useSelector} from "react-redux";
import {modalTypes} from "../../utils/constants";
import {RegisterModal} from "./_modals/RegisterModal";
import {SignInModal} from "./_modals/SignInModal";
import {CurrentUserModal} from "./_modals/CurrentUserModal";
import {ChangePasswordModal} from "./_modals/ChangePasswordModal";
import {DeleteAccountModal} from "./_modals/DeleteAccountModal";

// todo a case-sensitive font family should be used for the account-related functionalities
export const Modals = () => {
    const openModals = useSelector(state => state.modal.priorities);
    
    const IndividualModal = (type) => {
        switch (type) {
            case (modalTypes.register):
                return (<RegisterModal/>);
            case (modalTypes.signIn):
                return (<SignInModal/>);
            case (modalTypes.currentUser):
                return (<CurrentUserModal/>);
            case (modalTypes.changePassword):
                return (<ChangePasswordModal/>);
            case (modalTypes.deleteAccount):
                return (<DeleteAccountModal/>);
            default:
                return (<div></div>);
        }
    }
    
    return (
        <div>
            {openModals.map((modalType, i) => IndividualModal(modalType))}
        </div>
    )
}
