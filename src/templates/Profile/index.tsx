import { useMemo } from "react";
import { useSession } from "next-auth/react";

import { Box, Typography } from "@mui/material";
import UserRoleChip from "@/components/Person/Role/Chip";

import ProfileEditButton from "./EditButton";
import ProfileResetPasswordButton from "./ResetPasswordButton";
import { useGetPersonQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/dist/query";

const ProfileTemplate = () => {
  const { data: session } = useSession();
  const { data: currentUser } = useGetPersonQuery(session?.user.id as number || skipToken)

  const userFullName = useMemo(() => {
    if (!currentUser) {
      return null;
    }

    return `${currentUser.firstName} ${currentUser.lastName}`;
  }, [currentUser]);

  if (!currentUser) {
    return <>Carregando...</>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h4">{userFullName}</Typography>

        {
          currentUser.type !== "super_user" &&
          <Box ml={2}>
            <ProfileEditButton personId={currentUser.id as number} />
          </Box>

        }

        <Box ml={2}>
          <ProfileResetPasswordButton personId={currentUser.id as number} />
        </Box>
      </Box>

      <Typography variant="subtitle1">{currentUser.email}</Typography>

      <Box mt={3}>
        <UserRoleChip role={currentUser.type} />
      </Box>
    </Box>
  );
};

export default ProfileTemplate;
