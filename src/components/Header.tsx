import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { selectIsDrawerOpen, setIsDrawerOpen } from "../store/appSlice";
import Link from 'next/link'
import { Link as MUILink } from '@mui/material';

const Header = () => {
  const dispatch = useDispatch();
  const isDrawerOpen = useSelector(selectIsDrawerOpen);

  const toggleDrawer = () => {
    dispatch(setIsDrawerOpen(!isDrawerOpen));
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Box mr={3}>
            <IconButton color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography variant="h6"><Link href="/"><MUILink sx={{ cursor: 'pointer' }} underline="none" color="inherit">MEC Energia</MUILink></Link></Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
