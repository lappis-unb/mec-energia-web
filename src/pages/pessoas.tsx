import { NextPage } from "next";
import DefaultTemplateV2 from "@/templates/DefaultV2";
import UserListTemplate from "@/templates/UserList";
import SuccessNotification from "@/components/Notification/SuccessNotification";
import FailNotification from "@/components/Notification/FailNotification";
import CreatePersonHeaderAction from "@/templates/UserList/CreatePersonHeaderAction";

const UserListPage: NextPage = () => (
  <DefaultTemplateV2 headerAction={<CreatePersonHeaderAction />}>
    <UserListTemplate />
    <SuccessNotification />
    <FailNotification />
  </DefaultTemplateV2>
);

export default UserListPage;
