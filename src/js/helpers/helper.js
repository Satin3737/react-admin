import Uikit from "uikit";

export default class Helper {
    
    static showNotifications = (message, status) => {
        Uikit.notification({message, status});
    }
    
}