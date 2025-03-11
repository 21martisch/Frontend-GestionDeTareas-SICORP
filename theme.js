import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Color primario
    },
    secondary: {
      main: "#dc004e", // Color secundario
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default theme;