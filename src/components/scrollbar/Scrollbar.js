import PropTypes from 'prop-types';
import { memo, useEffect, useRef } from 'react';
// @mui
import { Box } from '@mui/material';
//
import { StyledRootScrollbar, StyledScrollbar } from './styles';

// ----------------------------------------------------------------------

Scrollbar.propTypes = {
  sx: PropTypes.object,
  children: PropTypes.node,
};

function Scrollbar({ children, sx, ...other }) {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isMobile && scrollRef.current) {
      scrollRef.current.recalculate(); // Recalculate the scrollbar position
      scrollRef.current.getScrollElement().scrollTop = scrollRef.current.getScrollElement().scrollHeight; // Scroll to the bottom
    }
  }, [children]);

  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', wordWrap: 'break-all', ...sx }} {...other}>
        <Box sx={{ whiteSpace: 'pre-wrap' }}>{children}</Box>
      </Box>
    );
  }

  return (
    <StyledRootScrollbar>
      <StyledScrollbar ref={scrollRef} timeout={500} clickOnTrack={false} sx={sx} {...other}>
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
}

export default memo(Scrollbar);
