import PropTypes from 'prop-types';
import { useRef } from 'react';
import React from 'react';
// @mui
import { random, clamp } from 'lodash';
import { alpha, styled } from '@mui/material/styles';
import { Box, Link,  Card, CardActionArea, Grid, Avatar, Typography, Stack, CardContent, Grow } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
import { useNavigate } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';
// import { PeopleIcon } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
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

const BlogPostCard = React.forwardRef(({ room, roomId, color, timeout }, ref) => {
  const { name, tags, time_to_start, spectators, teams, room_size, users_list } = room;
  const index = 1;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;

  const navigate = useNavigate();

  const time = new Date()
  const diff = time - new Date(time_to_start * 1000)
  const seconds = Math.abs(diff / 1000)
  time.setSeconds(time.getSeconds() + seconds);
  function MyTimer({ expiryTimestamp }) {
    const {
      seconds,
      minutes,
      isRunning,
    } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '60', fontWeight: 'bold'}}>
          {diff < 0 && isRunning ? (<div>Deabate start in {minutes}:{seconds}</div>) : 'Deabate started'}
        </div>
      </div>
    );
  }

  return (
    <Grow in={true} timeout={timeout}>
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 2.7}>
      <Card sx={{ position: 'relative' }} ref={ref}>
      <CardActionArea onClick={() => {
                  navigate(`/room/${roomId}`)
                }}>
        <StyledCardMedia
          sx={{
            pt: 'calc(100% * 4 / 3)',
            '&:after': {
              top: 0,
              content: "''",
              width: '100%',
              height: '100%',
              position: 'absolute',
              bgcolor: color,
            },
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
            }}
          />
          {/* <StyledAvatar
            // alt={moderator}
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
            bottom: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        >
          <Stack spacing={5}>
            <Stack spacing={1}>
              <Stack direction='row' spacing={1}>
                <PeopleIcon sx={{ color: 'white' }}/>
                <Typography gutterBottom variant="caption" sx={{
                  color: 'white',
                  display: 'block',
                  justifyContent: 'flex-end',
                }}>

                  {Object.keys(users_list).length} / {room_size}

              </Typography>
              </Stack>
              <Typography
                color="inherit"
                variant="subtitle2"
                underline="hover"
                sx={{
                  ...((latestPostLarge || latestPost) && {
                    color: 'common.white',

                  }),
                  typography: 'h5', height: 1
                }}
              >
                {name}
              </Typography>
            </Stack>
            <Stack>
              <StyledInfo>
                <Stack spacing={3}>
                  <StyledInfo sx={{ justifyContent: 'flex-start' }}>
                    {tags.map((tag, index) => (
                      <Typography
                        key={index}
                        variant="caption"
                        sx={{ color: 'white', display: 'inline-block', marginRight: '0.5rem' }}
                      >
                        #{tag}
                      </Typography>
                    ))}
                  </StyledInfo>
                  <Typography gutterBottom variant="caption" sx={{ color: 'white', display: 'block' }}>
                    <MyTimer expiryTimestamp={time} />
                  </Typography>
                </Stack>
              </StyledInfo>
            </Stack>
          </Stack>
        </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
     </Grow>
  );
});

BlogPostCard.propTypes = {
  room: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default BlogPostCard;
