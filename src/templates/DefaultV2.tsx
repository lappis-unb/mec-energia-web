import { ReactNode, useEffect, useState } from "react";
import { Box, Container, ContainerProps } from "@mui/material";
import Drawer from "@/components/Drawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSelector } from "react-redux";
import { selectIsDrawerOpen } from "@/store/appSlice";

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
  const isDrawerOpen = useSelector(selectIsDrawerOpen);
  const [width, setWidth] = useState("calc(100vw - 64px)");

  useEffect(() => {
    setWidth("80vw");
  }, [isDrawerOpen]);

  return (
    <Box display="flex" height="100vh">
      <Drawer />

      <Box width={width} flexGrow={1}>
        <Header>{headerAction}</Header>

        <Box display="flex">
          {secondaryDrawer && (
            <Box height="calc(100vh - 64px)">{secondaryDrawer}</Box>
          )}

          <Box
            flexGrow={1}
            minHeight="calc(100vh - 64px)"
            maxHeight="calc(100vh - 64px)"
            overflow="overlay"
            display="flex"
            flexDirection="column"
          >
            <Box sx={{ flexGrow: 1, position: "relative", pb: 5 }}>
              {contentHeader}

              <Container maxWidth={contentContainerMaxWidth} sx={{ height: '100%' }}>
                {children}
              </Container>
            </Box>

            <Footer />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DefaultTemplateV2;
