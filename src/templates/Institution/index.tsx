import { useMemo, useState } from "react";
import { useFetchInstitutionsQuery, useEditInstitutionMutation } from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FlashOn, FlashOff } from "@mui/icons-material";
import InstitutionEditButton from "./EditButton";
import { EditInstitutionRequestPayload } from "@/types/institution";
import { GridSearchIcon } from "@mui/x-data-grid";

const InstitutionsTemplate = () => {
  const { data: institutions } = useFetchInstitutionsQuery();
  const [editInstitution] = useEditInstitutionMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleToggleActivation = async (
    institutionId: number,
    institutionActive: boolean,
    institutionName: string,
    institutionCnpj: string
  ) => {
    const institutionToUpdate: EditInstitutionRequestPayload = {
      id: institutionId,
      is_active: !institutionActive,
      name: institutionName,
      cnpj: institutionCnpj,
    };

    await editInstitution(institutionToUpdate);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredInstitutions = useMemo(() => {
    if (!institutions) return [];
    return institutions.filter((institution) => {
      const acronym = institution?.acronym?.toLowerCase();
      const cnpj = institution.cnpj.toLowerCase();
      const name = institution.name.toLowerCase();
      
      const searchString = searchQuery.toLowerCase();

      return (
        acronym?.includes(searchString) ||
        cnpj.includes(searchString) ||
        name.includes(searchString)
      );
    });
  }, [institutions, searchQuery]);

  return (
    <TableContainer>
      <Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          mb={2}
          sx={{
            backgroundColor: "#0A5C67",
            paddingTop: "10px",
            marginBottom: "0px",
          }}
        >
          <TextField
            placeholder="Buscar"
            variant="standard"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GridSearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
              sx: {
                color: "white",
                "&:before": {
                  borderBottomColor: "white",
                },
              },
            }}
            InputLabelProps={{
              style: { color: "white" },
            }}
            sx={{ width: "200px", marginRight: "16px" }}
          />
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="70px">Ativa</TableCell>
              <TableCell width="122px">Sigla</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell width="166px">CNPJ</TableCell>
              <TableCell width="48px"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredInstitutions?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((institution) => (
              <TableRow
                key={institution.id}
                style={{
                  textDecoration: institution.isActive ? "none" : "line-through",
                  color: "inherit",
                }}
              >
                <TableCell>
                  <IconButton
                    onClick={() =>
                      handleToggleActivation(
                        institution.id,
                        institution.isActive,
                        institution.name,
                        institution.cnpj
                      )
                    }
                  >
                    {institution.isActive ? <FlashOn /> : <FlashOff />}
                  </IconButton>
                </TableCell>
                <TableCell>{institution.acronym}</TableCell>
                <TableCell>{institution.name}</TableCell>
                <TableCell>{institution.cnpj}</TableCell>
                <TableCell>
                  <InstitutionEditButton institutionId={institution.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInstitutions?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            "& .MuiTablePagination-toolbar": {
              backgroundColor: "#0A5C67",
            },
            "& .MuiTablePagination-select, & .MuiTablePagination-selectIcon, & .MuiTablePagination-actions .MuiIconButton-root, & .MuiTablePagination-displayedRows": {
              color: "#FFFFFF",
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              color: "#FFFFFF",
            },
          }}
        />
      </Box>
    </TableContainer>
  );
};

export default InstitutionsTemplate;