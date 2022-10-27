import React from 'react'
import { Box, Button, Divider, IconButton, Typography } from '@mui/material'
import { setIsContractCreateFormOpen, setIsContractEditFormOpen } from '../../store/appSlice';
import { useDispatch } from "react-redux";
import ContractCreateForm from '../Contract/Form/ContractCreateForm';
import LaunchIcon from '@mui/icons-material/Launch';
import { PhotoCamera } from '@mui/icons-material';
import ContractEditForm from '../Contract/Form/ContractEditForm';

const Contract = () => {
  const dispatch = useDispatch();
  const handleCreateContractClick = () => {
    dispatch(setIsContractCreateFormOpen(true));
  };

  const handleEditContractClick = () => {
    dispatch(setIsContractEditFormOpen(true));
  };
  return (
    <Box width="60%" margin="auto" marginTop="40px">
      <Box display='flex' justifyContent="space-between" marginBottom="1px">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h4"> Neoenergia</Typography>
          <LaunchIcon fontSize="large" />

        </Box>
        <Box display="flex" justifyContent='space-around' width="30%">
          <Button
            variant="outlined"
            onClick={handleCreateContractClick}
            size='small'
            sx={{ height: '30px' }}
          >
            RENOVAR
          </Button>
          <Button
            variant="outlined"
            onClick={handleEditContractClick}
            size='small'
            sx={{ height: '30px' }}
          >
            CORRIGIR
          </Button>

        </Box>

      </Box>
      <Divider />
      <Box marginTop="20px" marginLeft="10px">
        <Box margin='20px 0'>
          <Typography color={'grey'} fontWeight='regular'> Início</Typography>
          <Typography fontSize='20px'>05/01/2022</Typography>
        </Box>
        <Box margin='20px 0'>
          <Typography color={'grey'} fontWeight='regular'>Tensão de fornecimento</Typography>
          <Typography fontSize='20px'>350kV</Typography>
        </Box>
        <Box margin='20px 0'>
          <Typography color={'grey'} fontWeight='regular'>Modalidade tarifária</Typography>
          <Typography fontSize='20px'>Azul</Typography>
        </Box>
        <Box margin='20px 0'>
          <Typography fontSize='20px'>Demanda Contratada</Typography>
          <Box display='flex' justifyContent='space-between' alignItems='center' width='40%'>
            <Box margin='20px 0'>
              <Typography color={'grey'} fontWeight='regular'>Ponta</Typography>
              <Typography fontSize='20px'>270kW</Typography>
            </Box>
            <Box margin='20px 0'>
              <Typography color={'grey'} fontWeight='regular'>Fora de Ponta</Typography>
              <Typography fontSize='20px'>150kW</Typography>
            </Box>

          </Box>
        </Box>
      </Box>
      <ContractCreateForm />
      <ContractEditForm />
    </Box >
  )
}
export default Contract;
