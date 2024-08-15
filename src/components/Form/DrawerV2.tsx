import { ReactNode } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { FormErrorsAlert } from "./FormErrorsAlert";
import { SubmitButton } from "./SubmitButton";

interface FormDrawerV2Props {
  open: boolean;
  title: string;
  header: ReactNode;
  sections: ReactNode[];
  isLoading: boolean;
  errorsLength: number;
  handleCloseDrawer: () => void;
  handleSubmitDrawer: () => void;
}

const FormDrawerV2 = ({
  open,
  title,
  header,
  sections,
  isLoading,
  errorsLength,
  handleSubmitDrawer,
  handleCloseDrawer,
}: FormDrawerV2Props) => {
  return (
    <Drawer
      open={open}
      anchor="bottom"
      PaperProps={{ sx: { height: "100%" } }}
      onClose={handleCloseDrawer}
    >
      <AppBar position="static">
        <Toolbar>
          <Container maxWidth="md">
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                style={{ color: '#000000DE' }}
                aria-label="Fechar formulário"
                onClick={handleCloseDrawer}
              >
                <CloseRounded />
              </IconButton>

              <Box ml={3}>
                <Typography variant="h6">{title}</Typography>
              </Box>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Box mt={3} mb={6} component="form" onSubmit={handleSubmitDrawer}>
          {header}

          <Box my={4}>
            <Typography variant="body2" color="primary.main">
              * campos obrigatórios
            </Typography>
          </Box>

          <Box mt={4}>
            {sections.map((section, index) => (
              <Box mt={4} key={index}>
                <Paper>
                  <Box p={2}>{section}</Box>
                </Paper>
              </Box>
            ))}
          </Box>

          <Box mt={4}>
            <FormErrorsAlert
              hasErrors={errorsLength > 0 ? true : false}
            />
            <Grid item xs={12}>
              <SubmitButton isLoading={isLoading} />
              <Button variant="text" onClick={handleCloseDrawer} size="large">
                <Typography pl={3} pr={3}>
                  Cancelar
                </Typography>
              </Button>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Drawer >
  );
};

export default FormDrawerV2;
