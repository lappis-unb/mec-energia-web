import { ComponentType, ReactNode } from "react";
import NextLink from "next/link";
import { useSelector } from "react-redux";
import { selectIsDrawerOpen } from "@/store/appSlice";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconProps,
} from "@mui/material";

interface DrawerListItemProps {
  text: string;
  Icon: ComponentType<SvgIconProps>;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

interface WrapperLinkProps {
  href?: string;
  children: ReactNode;
}

const WrapperLink = ({ href, children }: WrapperLinkProps) => {
  if (href) {
    return (
      <NextLink href={href} passHref legacyBehavior>
        {children}
      </NextLink>
    );
  }

  return <>{children}</>;
};

const DrawerListItem = ({
  text,
  Icon,
  href,
  active,
  onClick,
}: DrawerListItemProps) => {
  const isDrawerOpen = useSelector(selectIsDrawerOpen);

  return (
    <ListItem disablePadding sx={{ display: "block", p: 1 }}>
      <WrapperLink href={href}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: isDrawerOpen ? "initial" : "center",
            px: 1.5,
          }}
          selected={active}
          onClick={onClick}
          disabled={!href && !onClick}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isDrawerOpen ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            <Icon color={active ? "primary" : "inherit"} />
          </ListItemIcon>

          <ListItemText
            sx={{
              whiteSpace: "normal",
              opacity: isDrawerOpen ? 1 : 0,
            }}
            primary={text}
            primaryTypographyProps={{
              color: active ? "primary" : "inherit",
            }}
          />
        </ListItemButton>
      </WrapperLink>
    </ListItem>
  );
};

export default DrawerListItem;
