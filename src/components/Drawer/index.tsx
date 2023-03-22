import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { signOut, useSession } from "next-auth/react";

import theme from "@/theme";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import DrawerListItem from "@/components/Drawer/ListItem";

import { selectIsDrawerOpen, setIsDrawerOpen } from "@/store/appSlice";
import {
  CONSUMER_UNITS_ROUTE,
  DASHBOARD_ROUTE,
  DISTRIBUTORS_ROUTE,
  INSTITUTIONS_ROUTE,
  USER_LIST_ROUTE,
} from "@/routes";
import { Route } from "@/types/router";
import { useGetPersonQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/dist/query";

interface RouteItem extends Route {
  active: boolean;
}

export const openDrawerWidth = 224;
export const closedDrawerWidth = `calc(${theme.spacing(8)} + 1px)`;

const openedMixin = (theme: Theme): CSSObject => ({
  width: openDrawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: closedDrawerWidth,
});

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: "208px", // TODO Para ficar um quadrado, utilizar openDrawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const drawerListedRoutes = [
  INSTITUTIONS_ROUTE,
  DASHBOARD_ROUTE,
  CONSUMER_UNITS_ROUTE,
  DISTRIBUTORS_ROUTE,
  USER_LIST_ROUTE,
];

const Drawer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { data: currentUser } = useGetPersonQuery(session?.user.id as number || skipToken)
  const isDrawerOpen = useSelector(selectIsDrawerOpen);

  const allowedRoutes = useMemo(() => {
    if (!session) {
      return [];
    }

    const allowedRoutes: RouteItem[] = [];

    drawerListedRoutes.forEach((route) => {
      const routeItem = {
        ...route,
        active: route.pathnames.includes(router.pathname),
      };

      if (!routeItem.roles) {
        allowedRoutes.push(routeItem);
      } else if (routeItem.roles.includes(session.user.type)) {
        allowedRoutes.push(routeItem);
      }
    });

    return allowedRoutes;
  }, [session, router.pathname]);

  const isCurrentRoute = useCallback(
    (pathname: string) => pathname === router.pathname,
    [router.pathname]
  );

  const handleSignOutClick = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleToggleDrawer = () => {
    dispatch(setIsDrawerOpen(!isDrawerOpen));
  };

  return (
    <StyledDrawer
      variant="permanent"
      open={isDrawerOpen}
      PaperProps={{ sx: { backgroundColor: "#FFFFFF" } }}
    >
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="192px"
        p={1}
        pb={0}
      >
        <Fade in={isDrawerOpen} appear={false}>
          <Toolbar
            disableGutters
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <IconButton onClick={handleToggleDrawer}>
              <ChevronLeftRoundedIcon fontSize="large" />
            </IconButton>
          </Toolbar>
        </Fade>

        <Fade in={!isDrawerOpen} appear={false}>
          <Box
            mb={3}
            display="flex"
            justifyContent="center"
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
            }}
          >
            <Toolbar>
              <IconButton onClick={handleToggleDrawer}>
                <MenuRoundedIcon fontSize="large" />
              </IconButton>
            </Toolbar>
          </Box>
        </Fade>

        <Box
          sx={{
            width: "100%",
            maxWidth: "144px",
            aspectRatio: "1/1",
          }}
        >
          <Image
            src="/icons/mec-energia.svg"
            alt="MEC Energia"
            layout="responsive"
            width="144px"
            height="144px"
          />
        </Box>
      </Box>

      <List sx={{ padding: 0 }}>
        {allowedRoutes.map(({ title, Icon, href, active }, index) => (
          <Box mt={index > 0 ? 1 : 0} key={href}>
            <DrawerListItem
              Icon={Icon}
              text={title}
              href={href}
              active={active}
            />
          </Box>
        ))}
      </List>

      {session && (
        <>
          <Box flexGrow={1} />

          <List>
            <DrawerListItem
              Icon={AccountCircleRoundedIcon}
              text={currentUser?.firstName ?? ""}
              href="/perfil"
              active={isCurrentRoute("/perfil")}
            />

            <Divider />

            <DrawerListItem
              Icon={LogoutRoundedIcon}
              text="Sair"
              href="/"
              onClick={handleSignOutClick}
            />
          </List>
        </>
      )}
    </StyledDrawer>
  );
};

export default Drawer;
