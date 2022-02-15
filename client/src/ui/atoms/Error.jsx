import { Box, Typography } from '@mui/material';
import errorImage from '../../assets/unknown_error.png';
import { theme } from '../../theme';

export const Error = ({ error }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {
        error?.message?.includes('Network Error') ? (
          <Typography>Uruchom Server!</Typography>
        ) :
          <Box>
            <img src={errorImage} />
            <Typography sx={{ color: theme.palette.grey[400] }}>Wystąpił nieoczekiwany błąd</Typography>
          </Box>
      }
    </Box>
  );
};
