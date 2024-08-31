import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import TungstenRoundedIcon from "@mui/icons-material/TungstenRounded";
import FactoryRoundedIcon from "@mui/icons-material/FactoryRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

import { Route } from "@/types/router";
import { UserRole } from "@/types/person";

export const INSTITUTIONS_ROUTE: Route = {
  title: "Instituições",
  Icon: SchoolRoundedIcon,
  href: "/instituicoes",
  pathnames: ["/instituicoes"],
  roles: [UserRole.SUPER_USER],
};

export const DASHBOARD_ROUTE: Route = {
  title: "Painel",
  Icon: DashboardRoundedIcon,
  href: "/",
  pathnames: ["/"],
  roles: [UserRole.UNIVERSITY_ADMIN, UserRole.UNIVERSITY_USER],
};

export const CONSUMER_UNITS_ROUTE: Route = {
  title: "Unidades Consumidoras",
  Icon: TungstenRoundedIcon,
  href: "/uc",
  pathnames: ["/uc", "/uc/[id]"],
  roles: [UserRole.UNIVERSITY_ADMIN, UserRole.UNIVERSITY_USER],
};

export const DISTRIBUTORS_ROUTE: Route = {
  title: "Distribuidoras",
  Icon: FactoryRoundedIcon,
  href: "/distribuidoras",
  pathnames: ["/distribuidoras", "/distribuidoras/[distributorId]"],
  roles: [UserRole.UNIVERSITY_ADMIN, UserRole.UNIVERSITY_USER],
};

export const USER_LIST_ROUTE: Route = {
  title: "Pessoas",
  Icon: GroupsRoundedIcon,
  href: "/pessoas",
  pathnames: ["/pessoas"],
  roles: [UserRole.SUPER_USER, UserRole.UNIVERSITY_ADMIN],
};

export const PROFILE_ROUTE: Route = {
  title: "Informações pessoais",
  Icon: AccountCircleRoundedIcon,
  href: "/perfil",
  pathnames: ["/perfil"],
};