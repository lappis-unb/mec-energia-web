import { ReactNode } from "react";

import { AppBar, Box, Toolbar, Typography } from "@mui/material";

import { Route } from "@/types/router";

const Header = ({ children, route }: { children?: ReactNode, route: Route }) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ backgroundColor: "background.default" }}
    >
      <Toolbar sx={{ px: 2 }} disableGutters>
        <Box flexGrow={1}>
          <Box display="flex" alignItems="center">
            {route && (
              <>
                <route.Icon fontSize="large" color="primary" />

                <Typography sx={{ ml: 1 }} variant="h6" color="primary">
                  {route.title}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {children}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
