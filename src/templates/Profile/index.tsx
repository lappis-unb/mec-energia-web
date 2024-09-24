import { useSession } from "next-auth/react";
import { Box, Typography, CircularProgress } from "@mui/material";
import UserRoleChip from "@/components/Person/Role/Chip";
import ProfileEditButton from "./EditButton";
import ProfileResetPasswordButton from "./ResetPasswordButton";
import { useGetPersonQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/dist/query";

const ProfileTemplate = () => {
  const { data: session } = useSession();
  const { data: currentUser, isLoading } = useGetPersonQuery(session?.user.id as number || skipToken);

  if (isLoading || !currentUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  const { firstName, lastName, email, type, id } = currentUser;
  const userFullName = `${firstName} ${lastName}`;

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h4">{userFullName}</Typography>
        {type !== "super_user" && (
          <Box ml={2}>
            <ProfileEditButton personId={id as number} />
          </Box>
        )}
        <Box ml={2}>
          <ProfileResetPasswordButton personId={id as number} />
        </Box>
      </Box>

      <Typography variant="subtitle1">{email}</Typography>

      <Box mt={3}>
        <UserRoleChip role={type} />
      </Box>
    </Box>
  );
};

export default ProfileTemplate;
