import _ from "lodash";
import {useSelector} from "react-redux";
import {Notification} from "./Notification";

export const NotificationList = () => {
    const notifications = useSelector(state => state.notification.notifications);
    const sortedNotifications = {};
    Object.keys(notifications).sort().forEach(key => {
        sortedNotifications[key] = notifications[key];
    });
    
    return (
        <div className="notification-list">
            {(_.map(sortedNotifications, (value, key) => (
                <div key={`${value}-${key}`}>
                    <Notification notification={value} timestamp={key}/>
                </div>
            )))}
        </div>
    )
}
