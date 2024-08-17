import { useSession } from "next-auth/react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import {
  Box,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useGetUsersQuery } from "@/api";
import { User, UserRole } from "@/types/person";
import { UserRoleLabelMap } from "@/components/Person/Role/constants";
import UniversityUserRoleDialog from "./RoleDialog";
import UserRoleSelect from "./RoleSelect";
import UserListPasswordResetButton from "./PasswordResetButton";
import { Session } from "next-auth";
import { useMemo } from "react";

const isUniversityAdmin = (user: User) =>
  user.type === UserRole.UNIVERSITY_ADMIN;

const getUsersQueryParams = (session: Session | null) => {
  if (!session) {
    return skipToken;
  }

  const {
    user: { type, universityId },
  } = session;

  if (type === UserRole.UNIVERSITY_ADMIN) {
    return universityId;
  }
};

const UserListTemplate = () => {
  const { data: session } = useSession();

  const usersQueryPayload = useMemo(
    () => getUsersQueryParams(session),
    [session]
  );

  const { data: users } = useGetUsersQuery(usersQueryPayload);

  if (!session) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome completo</TableCell>

            <TableCell>E-mail</TableCell>

            <TableCell>Universidade</TableCell>

            <TableCell width="200px">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="inherit">Perfil</Typography>

                <UniversityUserRoleDialog />
              </Box>
            </TableCell>

            <TableCell width="56px" />
          </TableRow>
        </TableHead>

        <TableBody>
          {users &&
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight={isUniversityAdmin(user) ? "bold" : "normal"}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight={isUniversityAdmin(user) ? "bold" : "normal"}
                  >
                    <Link href={`mailto:${user.email}`}>{user.email}</Link>
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight={isUniversityAdmin(user) ? "bold" : "normal"}
                  >
                    {user.university.name}
                  </Typography>
                </TableCell>

                <TableCell>
                  {user.id === session?.user.id ? (
                    <Chip color="primary" label={UserRoleLabelMap[user.type]} />
                  ) : (
                    <UserRoleSelect id={user.id} type={user.type} />
                  )}
                </TableCell>

                <TableCell>
                <UserListPasswordResetButton id={user.id} userName={`${user.firstName}`} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserListTemplate;
