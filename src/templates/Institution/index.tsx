import { useState } from "react";
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
} from "@mui/material";
import { FlashOn, FlashOff } from "@mui/icons-material";
import InstitutionEditButton from "./EditButton";
import { EditInstitutionRequestPayload } from "@/types/institution";

const InstitutionsTemplate = () => {
  const { data: institutions } = useFetchInstitutionsQuery();
  const [editInstitution] = useEditInstitutionMutation();
  
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

  return (
    <TableContainer>
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
          {institutions?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((institution) => (
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
        count={institutions?.length || 0}
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
    </TableContainer>
  );
};

export default InstitutionsTemplate;