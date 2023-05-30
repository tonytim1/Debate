import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, Stack, CardContent } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
import { random, clamp } from 'lodash';
import { useNavigate } from 'react-router-dom';
// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 100,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',

});


// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  room: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ room, roomId }) {
  const { name, tags, time_to_start, spectators, teams, room_size, users_list} = room;
  const index = 1;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;
  const colors = [
    '#263238', // Dark Blue Grey
    '#9C27B0', // Deep Purple
    '#6A1B9A', // Dark Purple
    '#303F9F', // Indigo
    '#1A237E', // Midnight Blue
    '#004D40', // Dark Teal
    '#006064', // Dark Cyan
    '#01579B', // Dark Blue
    '#FF6F00', // Dark Orange
    '#E65100', // Dark Amber
  ];
  

  const navigate = useNavigate();

  const handleTitleClick = (roomId) => {
    navigate(`/rooms/${roomId}`); // Navigate to the specified URL when the title is clicked
  };

  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 2.7 }>
      <Card sx={{ position: 'relative' }}>
        <StyledCardMedia
          sx={{
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: alpha(colors[random(0, colors.length - 1)], 0.72),
              },
            }),
          }}
        >
          <SvgColor
            color="paper"
            src="/assets/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
              ...((latestPostLarge || latestPost) && { display: 'none' }),
            }}
          />
          {/* <StyledAvatar
            alt={moderator}
            // src={}
            sx={{
              ...((latestPostLarge || latestPost) && {
                zIndex: 9,
                top: 24,
                left: 24,
                width: 40,
                height: 40,
              }),
            }}
          /> */}

          {/* <StyledCover alt={name} src={cover} /> */}
        </StyledCardMedia>

        <CardContent
          sx={{
            pt: 4,
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: '100%',
              position: 'absolute',
            }),
          }}
        > 
            <Stack>
            <Typography gutterBottom variant="caption" sx={{
              color: 'white',
              display: 'block',
              justifyContent: 'flex-end',
            }}>
              { Object.keys(users_list).length } / {room_size}
            </Typography>
            <StyledTitle
              color="inherit"
              variant="subtitle2"
              underline="hover"
              onClick={() =>{
                navigate(`/room/${roomId}`)
              }}
              sx={{
                ...(latestPostLarge && { typography: 'h5', height: 60 }),
                ...((latestPostLarge || latestPost) && {
                  color: 'common.white',

                }),
              }}
              >
              {name}
            </StyledTitle>
            <Typography gutterBottom variant="caption" sx={{ color: 'white', display: 'block' }}>
              starts in {time_to_start} minutes
            </Typography>
            </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}
