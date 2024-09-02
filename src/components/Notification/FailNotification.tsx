import {
  selectErrorNotification,
  setIsErrorNotificationOpen,
} from "@/store/appSlice";
import Notification from "./Notification";

const FailNotification = () => {
  return (
    <Notification
      selectNotification={selectErrorNotification}
      setIsNotificationOpen={setIsErrorNotificationOpen}
      severity="error"
    />
  );
};
export default FailNotification;
