import { NextPage } from "next";
import DefaultTemplateV2 from "@/templates/DefaultV2";
import UserListTemplate from "@/templates/UserList";
import SuccessNotification from "@/components/Notification/SuccessNotification";
import FailNotification from "@/components/Notification/FailNotification";
import CreatePersonHeaderAction from "@/templates/UserList/CreatePersonHeaderAction";
import { USER_LIST_ROUTE } from "@/routes";

const UserListPage: NextPage = () => (
  <DefaultTemplateV2 headerAction={<CreatePersonHeaderAction />} route={USER_LIST_ROUTE}>
    <UserListTemplate />
    <SuccessNotification />
    <FailNotification />
  </DefaultTemplateV2>
);

export default UserListPage;
