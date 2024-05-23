import { createTheme } from "@mui/material";
import "@mui/x-data-grid/themeAugmentation";
import { ptBR as corePtBR } from "@mui/material/locale";
import { ptBR } from "@mui/x-date-pickers";

declare module "@mui/material/styles" {
  interface Palette {
    highlighted: Palette["primary"];
  }

  interface PaletteOptions {
    highlighted: PaletteOptions["primary"];
  }
}

const primaryMain = "#0A5C67";

const theme = createTheme(
  {
    palette: {
      primary: {
        main: primaryMain,
        contrastText: "#fff",
      },
      secondary: {
        main: "#FB736C",
      },
      background: {
        default: "#EEF4F4",
        paper: "#fff",
      },
      error: {
        main: "#B31B0A",
      },
      warning: {
        main: "#FB736C",
        contrastText: "#000",
      },
      highlighted: {
        main: "rgba(10, 92, 103, 0.12)",
      },
    },
    typography: {
      fontFamily: ["Lexend", "sans-serif"].join(","),
    },
    components: {
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          standardError: {
            backgroundColor: "#F8E9E7",
            color: "#520D05",
          },
          standardSuccess: {
            backgroundColor: "#ECF2E9",
            color: "#25401A",
          },
          standardWarning: {
            backgroundColor: "#FBF4E7",
            color: "#613E05", // Cor do texto do alerta de aviso
            "& .MuiAlert-icon": {
              // Especifica a customização do ícone dentro de um alerta de aviso
              color: "#D98A0B", // Nova cor do ícone
            },
          },
          standardInfo: {
            backgroundColor: "#E6ECF3",
            color: "#0F294D",
          },
          filledError: {
            backgroundColor: "#B31B0A",
            color: "#FFF",
          },
          filledSuccess: {
            backgroundColor: "#418026",
            color: "#FFF",
          },
          filledWarning: {
            backgroundColor: "#D98A0B",
            color: "#000",
          },
          filledInfo: {
            backgroundColor: "#0E438C",
            color: "#FFF",
          },
          outlinedError: {
            backgroundColor: "#FFF",
            borderColor: "#B31B0A",
            color: "#520D05",
          },
          outlinedSuccess: {
            backgroundColor: "#FFF",
            borderColor: "#418026",
            color: "#25401A",
          },
          outlinedWarning: {
            backgroundColor: "#FFF",
            borderColor: "#D98A0B",
            color: "#613E05",
          },
          outlinedInfo: {
            backgroundColor: "#FFF",
            borderColor: "#0E438C",
            color: "#0F294D",
          },
          icon: {
            color: "#FFFFFF",
          },
        },
      },

      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: primaryMain,

            "& .MuiTableCell-root": {
              color: "white",
            },
          },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            "& .MuiTableRow-root": {
              "&:nth-of-type(odd)": {
                backgroundColor: "white",
              },
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .MuiDataGrid-columnHeader--filledGroup": {
              backgroundColor: "rgba(10, 92, 103, 0.08)",
              color: "rgba(0, 0, 0, 0.87)",
            },
            "& .MuiDataGrid-columnHeader--emptyGroup": {
              backgroundColor: "unset",
            },
            border: "unset",
          },
          row: {
            ":nth-of-type(odd)": {
              backgroundColor: "white",
            },
          },
          columnHeader: {
            color: "white",
            backgroundColor: primaryMain,
            ":focus": {
              outline: "none",
            },
            button: {
              color: "white",
            },
            // Remove o último separador de coluna dos componentes baseados no MuiDataGrid 
            "&:last-of-type": { 
              "& .MuiDataGrid-columnSeparator": { 
                display: "none" 
              }
            }
          },
        },
      },
      MuiDrawer: {
        styleOverrides: { paper: { backgroundColor: "#EEF4F4" } },
      },
    },
  },
  ptBR,
  corePtBR
);

export default theme;
