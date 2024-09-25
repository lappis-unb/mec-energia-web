import { useState } from "react";
import { HelpRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import { UserRole } from "@/types/person";
import { UserRoleLabelMap } from "@/components/Person/Role/constants";

const UserRoleDialog = () => {
  const [open, setOpen] = useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleDialogOpen}>
        <HelpRounded />
      </IconButton>

      <Dialog open={open} onClose={handleDialogClose}>
        <Card>
          <CardContent>
            <Typography variant="h6">Perfis</Typography>

            <Box pt={2}>
              <Typography variant="body1" color="primary" fontWeight="bold">
                {UserRoleLabelMap[UserRole.UNIVERSITY_USER]}
              </Typography>

              <Typography variant="body1">
                Acesso às tarefas básicas do sistema como: gerenciar unidades
                consumidoras e distribuidoras, lançar faturas e tarifas, além de
                gerar recomendações.
              </Typography>
            </Box>

            <Box pt={2}>
              <Typography variant="body1" color="primary" fontWeight="bold">
                {UserRoleLabelMap[UserRole.UNIVERSITY_ADMIN]}
              </Typography>

              <Typography variant="body1">
                Permite gerenciar o perfil das outras pessoas que usam o
                sistema, além das tarefas operacionais.
              </Typography>
            </Box>
          </CardContent>

          <CardActions>
            <Box display="flex" justifyContent="flex-end" width="100%">
              <Button onClick={handleDialogClose}>Fechar</Button>
            </Box>
          </CardActions>
        </Card>
      </Dialog>
    </>
  );
};

export default UserRoleDialog;
