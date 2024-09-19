import { Close } from "@mui/icons-material";
import {
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { ReactNode } from "react";
import theme from "../../theme";

interface FormDrawerProps {
  open: boolean;
  children: ReactNode;
  handleCloseDrawer: () => void;
}

const FormDrawer = ({ open, children, handleCloseDrawer }: FormDrawerProps) => {
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Drawer
      open={open}
      anchor="bottom"
      PaperProps={{ sx: { height: "100%" } }}
      onClose={handleCloseDrawer}
    >
      <Toolbar />

      <Box position="relative" py={3}>
        {isSmUp && (
          <Box position="absolute" top={0} left={0} p={2}>
            <IconButton style={{ color: '#000000DE' }} onClick={handleCloseDrawer}>
              <Close fontSize="large" />
            </IconButton>
          </Box>
        )}

        <Container maxWidth="sm">{children}</Container>
      </Box>
    </Drawer>
  );
};

export default FormDrawer;
