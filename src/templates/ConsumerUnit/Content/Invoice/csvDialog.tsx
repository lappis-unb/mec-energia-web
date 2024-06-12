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

  const handleClearCsvDialogAndClose = () => {
    handleFileRemove();
    handleCloseCsvDialog();
  };

  return (
    <Dialog open={isCsvDialogOpen} onClose={handleClearCsvDialogAndClose} maxWidth="xs">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingRight={3}
      >
        <DialogTitle>Importar Planilha</DialogTitle>
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
          modelo.csv{" "}
          <AttachFileRoundedIcon style={{ marginLeft: 2, fontSize: 19 }} />
        </Link>
      </Box>
      <DialogContent>
        <Box pb={2}>
          <Typography variant="body2" color="textSecondary">
            É possível lançar várias faturas faturas de uma só vez. Para isso,
            preencha uma planilha em formato CSV seguindo o modelo acima. Em
            seguida, selecione o arquivo ou arraste-o até aqui. Depois clique em
            “Importar”.
          </Typography>
        </Box>

        {selectedFile ? (
          <Box display="flex" alignItems="center">
            <Typography variant="body1">{selectedFile.name}</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleFileRemove}
              style={{ marginLeft: "auto" }}
            >
              Remover
            </Button>
          </Box>
        ) : null}

        <input
          type="file"
          id="csvFileInput"
          style={{ display: "none" }}
          onChange={handleFileSelect}
          accept=".csv"
          ref={fileInputRef}
        />
        <label htmlFor="csvFileInput">
          <Button variant="contained" component="span">
            Escolher CSV
          </Button>
        </label>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClearCsvDialogAndClose}>Cancelar</Button>
        <Button onClick={handleUploadClick} disabled={!selectedFile}>
          Próximo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CsvDialog;
