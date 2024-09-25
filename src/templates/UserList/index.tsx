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
  TextField,
  InputAdornment,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useGetUsersQuery } from "@/api";
import { User, UserRole } from "@/types/person";
import { UserRoleLabelMap } from "@/components/Person/Role/constants";
import UserRoleSelect from "./RoleSelect";
import UserListPasswordResetButton from "./PasswordResetButton";
import { Session } from "next-auth";
import { useMemo, useState } from "react";

const isUniversityAdmin = (user: User) =>
  user.type === UserRole.UNIVERSITY_ADMIN;

const getUsersQueryParams = (session: Session | null) => {
  if (!session) {
    return skipToken;
  }

  const {
    user: { type, universityId },
  } = session;

  return type === UserRole.UNIVERSITY_ADMIN ? universityId : undefined;
};

const userRoleImportance: Record<UserRole, number> = {
  [UserRole.SUPER_USER]: 1,
  [UserRole.UNIVERSITY_ADMIN]: 2,
  [UserRole.UNIVERSITY_USER]: 3,
};

const getUniversityAcronym = (email: string) => {
  const match = email.match(/@([^\.]+)/);
  if (match) {
    const acronym = match[1].toUpperCase();
    return acronym === "ADMIN" ? "-" : acronym;
  }
  return "";
};

const sortUsers = (array: User[], comparator: (a: User, b: User) => number) => {
  return array.slice().sort(comparator);
};

const getComparator = (order: "asc" | "desc", orderBy: string) => {
  return (a: User, b: User) => {
    if (orderBy === "fullName") {
      const fullNameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const fullNameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      if (fullNameA === fullNameB) {
        return (
          (userRoleImportance[a.type] - userRoleImportance[b.type]) *
          (order === "asc" ? 1 : -1)
        );
      }
      return (fullNameA < fullNameB ? -1 : 1) * (order === "asc" ? 1 : -1);
    }

    if (orderBy === "email") {
      const emailA = a.email.toLowerCase();
      const emailB = b.email.toLowerCase();
      return (emailA < emailB ? -1 : 1) * (order === "asc" ? 1 : -1);
    }

    if (orderBy === "type") {
      const roleImportanceA = userRoleImportance[a.type];
      const roleImportanceB = userRoleImportance[b.type];
      return (roleImportanceA - roleImportanceB) * (order === "asc" ? -1 : 1);
    }

    if (orderBy === "university") {
      const universityA = getUniversityAcronym(a.email);
      const universityB = getUniversityAcronym(b.email);
      return (universityA < universityB ? -1 : 1) * (order === "asc" ? 1 : -1);
    }

    return 0;
  };
};

const UserListTemplate = () => {
  const { data: session } = useSession();
  const isSysAdmin = session?.user.email === "admin@admin.com";
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("fullName");

  const usersQueryPayload = useMemo(
    () => getUsersQueryParams(session),
    [session]
  );

  const { data: users } = useGetUsersQuery(usersQueryPayload);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const role = UserRoleLabelMap[user.type].toLowerCase();
      const searchString = searchQuery.toLowerCase();

      return (
        fullName.includes(searchString) ||
        email.includes(searchString) ||
        role.includes(searchString)
      );
    });
  }, [users, searchQuery]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedUsers = useMemo(() => {
    return sortUsers(filteredUsers, getComparator(order, orderBy));
  }, [filteredUsers, order, orderBy]);

  const paginatedUsers = useMemo(() => {
    return sortedUsers.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedUsers, page, rowsPerPage]);

  if (!session) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <TableContainer>
      <Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          mb={2}
          sx={{
            backgroundColor: "#0A5C67",
            paddingTop: "10px",
            marginBottom: "0px",
          }}
        >
          <TextField
            placeholder="Buscar"
            variant="standard"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
              sx: {
                color: "white",
                "&:before": {
                  borderBottomColor: "white",
                },
              },
            }}
            InputLabelProps={{
              style: { color: "white" },
            }}
            sx={{ width: "200px", marginRight: "16px" }}
          />
        </Box>
        <Table size="small">
          <TableHead>
            <TableCell sortDirection={orderBy === "fullName" ? order : false}>
              <TableSortLabel
                active={orderBy === "fullName"}
                direction={orderBy === "fullName" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "fullName")}
                sx={{
                  color: "white !important",
                  "& .MuiTableSortLabel-icon": {
                    color: "white !important",
                  },
                }}
              >
                Nome completo
              </TableSortLabel>
            </TableCell>

            <TableCell sortDirection={orderBy === "email" ? order : false}>
              <TableSortLabel
                active={orderBy === "email"}
                direction={orderBy === "email" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "email")}
                sx={{
                  color: "white !important",
                  "& .MuiTableSortLabel-icon": {
                    color: "white !important",
                  },
                }}
              >
                E-mail
              </TableSortLabel>
            </TableCell>

            <TableCell sortDirection={orderBy === "type" ? order : false}>
              <TableSortLabel
                active={orderBy === "type"}
                direction={orderBy === "type" ? order : "asc"}
                onClick={(event) => handleRequestSort(event, "type")}
                sx={{
                  color: "white !important",
                  "& .MuiTableSortLabel-icon": {
                    color: "white !important",
                  },
                }}
              >
                Perfil
              </TableSortLabel>
            </TableCell>

            {isSysAdmin && (
              <TableCell
                sortDirection={orderBy === "university" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "university"}
                  direction={orderBy === "university" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "university")}
                  sx={{
                    color: "white !important",
                    "& .MuiTableSortLabel-icon": {
                      color: "white !important",
                    },
                  }}
                >
                  Universidade
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell width="56px" />
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
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
                  {user.id === session?.user.id ? (
                    <Chip color="primary" label={UserRoleLabelMap[user.type]} />
                  ) : (
                    <UserRoleSelect id={user.id} type={user.type} />
                  )}
                </TableCell>
                {isSysAdmin && (
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={isUniversityAdmin(user) ? "bold" : "normal"}
                    >
                      {user.universityDetail.name}
                    </Typography>
                  </TableCell>
                )}
                <TableCell>
                  <UserListPasswordResetButton
                    id={user.id}
                    userName={user.firstName}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{
            backgroundColor: "#0A5C67",
            color: "white",
            padding: "8px",
          }}
        >
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              "& .MuiTablePagination-toolbar": {
                color: "white",
              },
              "& .MuiTablePagination-actions": {
                color: "white",
              },
              "& .MuiSelect-icon": {
                color: "white",
              },
              "& .MuiIconButton-root": {
                color: "white",
              },
              "& .MuiIconButton-root .MuiSvgIcon-root": {
                color: "white",
              },
            }}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        </Box>
      </Box>
    </TableContainer>
  );
};

export default UserListTemplate;
