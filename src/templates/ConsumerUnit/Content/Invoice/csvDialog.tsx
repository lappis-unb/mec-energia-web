import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import { getSession } from "next-auth/react";

interface CsvDialogProps {
  isCsvDialogOpen: boolean;
  handleCloseCsvDialog: () => void;
  onFileSelect: (file: File) => void;
}

const CsvDialog: React.FC<CsvDialogProps> = ({
  isCsvDialogOpen,
  handleCloseCsvDialog,
  onFileSelect,
}) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [helpTextClicked, setHelpTextClicked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDownloadClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event?.preventDefault();
    try {
      const session = await getSession();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/energy-bills/download-csv-model/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${session?.user?.token}`,
            "Content-Type": "application/pdf",
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "modelo.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const handleHelpTextClick = () => {
    setHelpTextClicked(true);
  };

  const handleClearCsvDialogAndClose = () => {
    handleFileRemove();
    setHelpTextClicked(false);
    handleCloseCsvDialog();
  };

  return (
    <Dialog
      open={isCsvDialogOpen}
      onClose={handleClearCsvDialogAndClose}
      maxWidth="xs"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingRight={3}
      >
        <DialogTitle>Importar planilha</DialogTitle>
        <Link
          component="button"
          onClick={handleDownloadClick}
          style={{
            cursor: "pointer",
            color: theme.palette.primary.main,
            textDecoration: "underline",
            marginLeft: "auto",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="body2">modelo.csv</Typography>
            <AttachFileRoundedIcon style={{ marginLeft: 2, fontSize: 19 }} />
          </Box>
        </Link>
      </Box>
      <DialogContent sx={{ paddingTop: "8px" }}>
        <Box pb={2}>
          <Typography variant="body2" color="textSecondary">
            Importe uma planilha para lançar várias faturas de uma só vez.{" "}
            <span
              style={{
                cursor: "pointer",
                color: theme.palette.primary.main,
                textDecoration: "underline",
              }}
              onClick={handleHelpTextClick}
            >
              Saiba como fazer
            </span>
          </Typography>
        </Box>

        {helpTextClicked ? (
          <Box pb={2}>
            <Typography variant="body2" color="textSecondary">
              1. Baixe o arquivo modelo em formato CSV acima. <br />
              2. Abra o modelo. <br />
              3. Insira os dados das faturas sem alterar os cabeçalhos ou a
              ordem das colunas. <br />
              4. Grave o arquivo em formato CSV. <br />
              5. Arraste o arquivo até aqui, ou use o botão “Selecionar” abaixo.{" "}
              <br />
              6. Por fim, clique em “Importar”.
            </Typography>
          </Box>
        ) : null}

        {selectedFile ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={2}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px solid"
              borderRadius="24px"
              padding="4px 12px"
              marginRight="8px"
              bgcolor="#e3f2fd" // cor de fundo ajustada
              borderColor={theme.palette.primary.main}
            >
              <Typography variant="body2" color={theme.palette.primary.main}>
                {" "}
                {/* cor do texto ajustada */}
                {selectedFile.name}
              </Typography>
            </Box>
            <DeleteIcon
              onClick={handleFileRemove}
              style={{ cursor: "pointer", color: theme.palette.primary.main }}
            />
          </Box>
        ) : (
          <input
            type="file"
            id="csvFileInput"
            style={{ display: "none" }}
            onChange={handleFileSelect}
            accept=".csv"
            ref={fileInputRef}
          />
        )}
        {!selectedFile && (
          <Box display="flex" justifyContent="center" mt={2}>
            <label htmlFor="csvFileInput">
              <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid"
                borderRadius="8px"
                padding="8px 16px"
                color={theme.palette.primary.main}
                style={{
                  cursor: "pointer",
                  borderColor: theme.palette.primary.main,
                }}
              >
                <FolderIcon
                  style={{ marginRight: 8, color: theme.palette.primary.main }}
                />
                <Typography variant="body2" fontWeight="bold">
                  Selecionar arquivo CSV
                </Typography>
              </Box>
            </label>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClearCsvDialogAndClose}>Cancelar</Button>
        <Button onClick={handleUploadClick} disabled={!selectedFile}>
          Importar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CsvDialog;
