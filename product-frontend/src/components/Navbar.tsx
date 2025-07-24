import { AppBar, Toolbar, Box } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="static" elevation={10} sx={{ mb: 4 }}>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1}>
        </Box>
      </Toolbar>
    </AppBar>
  );
}