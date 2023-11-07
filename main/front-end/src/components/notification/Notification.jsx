import {useDispatch} from "react-redux";
import {removeNotification} from "../../store/notification/notificationSlice";
import {notificationTypes} from "../../utils/constants";
import Alert from "react-bootstrap/Alert";

export const Notification = ({timestamp, notification}) => {
    const dispatch = useDispatch();
    
    const doRemoveNotification = () => {
        dispatch(removeNotification(timestamp));
    };
    
    return (
        <Alert
            variant={notification.type === notificationTypes.message ? "success" : "danger"}
            onClose={doRemoveNotification}
            dismissible
        >
            <span>{notification.message}</span>
        </Alert>
    )
};
