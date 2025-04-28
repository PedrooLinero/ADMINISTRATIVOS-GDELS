import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import logo_acciona_sin_fondo from "../assets/logo_acciona_sin_fondo.png";

function ResponsiveAppBar() {
  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#ff0000",
          height: "80px",
          justifyContent: "center",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            paddingLeft: "16px",
            paddingRight: "16px",
            minHeight: "80px !important",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={logo_acciona_sin_fondo} height="60" alt="Acciona" />
          </Box>

          {/* Título */}
          <Box
            sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 600,
                color: "white",
                letterSpacing: ".1rem",
                fontSize: "1.5rem",

              }}
            >
              ADMINISTRACIÓN GDELS
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default ResponsiveAppBar;
