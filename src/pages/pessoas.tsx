import { NextPage } from "next";
import DefaultTemplateV2 from "@/templates/DefaultV2";
import UserListTemplate from "@/templates/UserList";
import SuccessNotification from "@/components/Notification/SuccessNotification";
import FailNotification from "@/components/Notification/FailNotification";
import CreatePersonHeaderAction from "@/templates/UserList/CreatePersonHeaderAction";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const UserListPage: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <DefaultTemplateV2 headerAction={<CreatePersonHeaderAction />}>
      <UserListTemplate />
      <SuccessNotification />
      <FailNotification />
    </DefaultTemplateV2>
  )
};

export default UserListPage;
