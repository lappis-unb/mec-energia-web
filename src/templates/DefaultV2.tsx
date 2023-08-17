import { ReactNode } from "react";
import { Box, Container, ContainerProps } from "@mui/material";
import Drawer from "@/components/Drawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Divider from "@mui/material/Divider";

type DefaultTemplateProps = {
  headerAction?: ReactNode;
  secondaryDrawer?: ReactNode;
  contentHeader?: ReactNode;
  contentContainerMaxWidth?: ContainerProps["maxWidth"];
  children?: ReactNode;
};

const DefaultTemplateV2 = ({
  headerAction,
  secondaryDrawer,
  contentHeader,
  contentContainerMaxWidth,
  children,
}: DefaultTemplateProps) => {
  return (
    <Box display="flex" height="100vh">
      <Drawer />

      <Box flexGrow={1}>
        <Header>{headerAction}</Header>

        <Box display="flex">
          {secondaryDrawer && (
            <Box height="calc(100vh - 64px)">{secondaryDrawer}</Box>
          )}

          <Box
            flexGrow={1}
            minHeight="calc(100vh - 64px)"
            maxHeight="calc(100vh - 64px)"
            overflow="scroll"
            display="flex"
            flexDirection="column"
            bgcolor="rgb(248, 248, 248)"
          >
            <Box sx={{ flexGrow: 1, position: "relative", pb: 5 }}>
              {contentHeader}

              <Container maxWidth={contentContainerMaxWidth}>
                {children}
              </Container>
            </Box>

            <Divider />

            <Footer />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DefaultTemplateV2;
