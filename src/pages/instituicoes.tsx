import { NextPage } from "next";
import DefaultTemplateV2 from "@/templates/DefaultV2";
import InstitutionsTemplate from "@/templates/Institution";
import InstitutionHeaderAction from "@/templates/Institution/HeaderAction";
import SuccessNotification from "@/components/Notification/SuccessNotification";
import FailNotification from "@/components/Notification/FailNotification";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CircularProgress, Box } from "@mui/material";

const InstitutionsPage: NextPage = () => {
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
    <DefaultTemplateV2 headerAction={<InstitutionHeaderAction />}>
      <InstitutionsTemplate />
      <SuccessNotification />
      <FailNotification />
    </DefaultTemplateV2>
  );
};

export default InstitutionsPage;
