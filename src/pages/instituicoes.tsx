import { NextPage } from "next";
import DefaultTemplateV2 from "@/templates/DefaultV2";
import InstitutionsTemplate from "@/templates/Institution";
import InstitutionHeaderAction from "@/templates/Institution/HeaderAction";
import SuccessNotification from "@/components/Notification/SuccessNotification";
import FailNotification from "@/components/Notification/FailNotification";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { UserRole } from "@/types/person";
import { useEffect } from "react";

const InstitutionsPage: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || session?.user.type !== UserRole.SUPER_USER) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "unauthenticated" || session?.user.type !== UserRole.SUPER_USER) {
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
