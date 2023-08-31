import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState, forwardRef } from 'react';
import { IconButton, Menu, MenuItem, Snackbar} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ReportMenu = ({userId, currUserId, roomId, socket}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        console.log(open);
      };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleReport = (userId) => {
        reportUser(userId);
        setOpenAlert(true);
        handleClose();
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };
    
    const reportUser = (userId) => {   
        socket.current.emit(
            'report_user', 
            {
            'userId': currUserId,
            'reportedUserId': userId,
            'roomId': roomId 
            }
        );  
    }

    return (
    <>
        <IconButton 
            className={userId}
            onClick={handleClick}
        >
            <MoreHorizIcon/>
        </IconButton>

        <Menu
            open={open}
            onClose={handleClose}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <MenuItem onClick={() => handleReport(userId)}>Report</MenuItem>
        </Menu>
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="info" sx={{ width: '100%' }}>
            Report received. If the user receives reports at least from half of the participants, he will be kicked off from the conversation.
        </Alert>
      </Snackbar>
    </>
    );
}

export default ReportMenu;