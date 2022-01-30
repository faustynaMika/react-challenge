import { Box, Typography } from '@mui/material';
import noContent from '../../assets/no_content.png'
import { theme } from '../../theme';

export const NoContent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <img src={noContent} />
      <Typography sx={{ color: theme.palette.grey[400] }}>Brak danych do wyświetlenia</Typography>
    </Box>
  );
};
