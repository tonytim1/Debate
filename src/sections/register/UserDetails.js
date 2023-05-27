import { useState } from "react";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { Box } from "@mui/system";
import { LoadingButton } from '@mui/lab';
import {
  tags,
} from 'src/pages/SignupPage.js';

const musicGenres = [
  "Politics",
  "Culture",
  "Sports",
  "Technology",
  "Education",
  "Science",
  "Religion and spirituality",
  "Health",
  "Climate change"
];

function MusicToggles() {
  const [genres, setGenres] = useState(
    musicGenres.reduce((obj, genre) => ({ ...obj, [genre]: false }), {})
  );

  const handleToggle = (event) => {
    setGenres({ ...genres, [event.target.name]: event.target.checked });
  };

  return (
    
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <FormGroup sx={{ mt: 4 }}>
        {musicGenres.map((genre) => (
          <FormControlLabel
            key={genre}
            control={
              <Switch
                sx={{
                  color: "primary.main",
                  "& .Mui-checked": {
                    color: "primary.main",
                  },
                }}
                checked={genres[genre]}
                onChange={handleToggle}
                name={genre}
              />
            }
            label={genre}
          />
        ))}
      </FormGroup>
      <img src={require('src/sections/register/placeholder.png')}  alt="description" style={{ width: "200px", height: "200px" }}/>
    </Box>
    
  );
}

export default MusicToggles;