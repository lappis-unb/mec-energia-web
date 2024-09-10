import {
  selectSuccessNotification,
  setIsSuccessNotificationOpen,
} from "@/store/appSlice";
import Notification from "./Notification";

const SuccessNotification = () => {
  return (
    <Notification
      selectNotification={selectSuccessNotification}
      setIsNotificationOpen={setIsSuccessNotificationOpen}
      severity="success"
    />
  );
};
export default SuccessNotification;
