import { useState, useEffect} from 'react';
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function AccountPopover() {

  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleProfile = () => {
    const userId = localStorage.getItem("userId");
    navigate(`/user/${userId}`);
  };

  const handleLogout = () => {
    console.log("logout");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tags");
    localStorage.removeItem("profilePhotoURL");
    localStorage.removeItem("provider");
    localStorage.removeItem("UserAuthenticated");
    navigate('/');
  };

  return (
    <>

      <meta name="referrer" content="no-referrer" />

      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={localStorage.getItem('profilePhotoURL')} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {localStorage.getItem("userId")}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <MenuItem onClick={() => window.location.href = "/dashboard/home"} sx={{ m: 1 }}>
            Home
          </MenuItem>
          <MenuItem onClick={handleProfile} sx={{ m: 1 }}>
            Profile
          </MenuItem>


          
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
