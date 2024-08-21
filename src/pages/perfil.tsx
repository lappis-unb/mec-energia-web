import { NextPage } from "next";
import DefaultTemplateV2 from "@/templates/DefaultV2";
import ProfileTemplate from "@/templates/Profile";
import SuccessNotification from "@/components/Notification/SuccessNotification";
import FailNotification from "@/components/Notification/FailNotification";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CircularProgress, Box } from "@mui/material";

const ProfilePage: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <DefaultTemplateV2>
      <ProfileTemplate />
      <SuccessNotification />
      <FailNotification />
    </DefaultTemplateV2>
  );
};

export default ProfilePage;
