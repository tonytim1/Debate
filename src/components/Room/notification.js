import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

const Notification = ({}) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      everity="info"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <SnackbarContent
        message= 'End of conversation, hope to see you soon in another debate :)'
        sx={{ backgroundColor: 'info.main' }}
      />
    </Snackbar>
  );
};

export default Notification;