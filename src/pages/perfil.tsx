import { NextPage } from "next";
import DefaultTemplateV2 from "@/templates/DefaultV2";
import ProfileTemplate from "@/templates/Profile";
import SuccessNotification from "@/components/Notification/SuccessNotification";
import FailNotification from "@/components/Notification/FailNotification";
import { PROFILE_ROUTE } from "@/routes";

const ProfilePage: NextPage = () => {
  return (
    <DefaultTemplateV2 route={PROFILE_ROUTE}>
      <ProfileTemplate />
      <SuccessNotification />
      <FailNotification />
    </DefaultTemplateV2>
  );
};

export default ProfilePage;
