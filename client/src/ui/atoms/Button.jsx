import * as React from 'react';
import { Button as MuiButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/system';

import { theme } from '../../theme';

function getButtonStyles(color, bgColor, hColor, hBgColor, aColor, aBgColor, dColor, dBgColor, isBorder) {

  var borderStyle = '';

  if (isBorder) {
    borderStyle = '1px solid ' + color;
  }
  else {
    borderStyle = 'none';
  }

  return {
    borderStyle: borderStyle,
    color: color,
    backgroundColor: bgColor,
    ':hover': {
      color: hColor,
      backgroundColor: hBgColor,
      borderStyle: borderStyle,
    },
    ':active': {
      color: aColor,
      backgroundColor: aBgColor,
      borderStyle: borderStyle,
    },
    ':disabled': {
      color: dColor,
      backgroundColor: dBgColor,
      borderStyle: borderStyle,
    }
  };
}


let ButtonTheme = createTheme(theme, {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
        }
      },
      variants: [
        {
          props: { color: 'primary', variant: 'outlined' },
          style: getButtonStyles(
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.primary.dark,
            theme.palette.secondary.dark,
            theme.palette.primary.dark,
            theme.palette.secondary.dark,
            theme.palette.grey[300],
            theme.palette.grey[100],
            false
          )
        },
        {
          props: { color: 'primary', variant: 'contained' },
          style: getButtonStyles(
            '#FFFFFF',
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.primary.dark,
            theme.palette.secondary.main,
            theme.palette.primary.dark,
            theme.palette.grey[300],
            theme.palette.grey[100],
            false
          )
        },
        {
          props: { color: 'error', variant: 'contained' },
          style: getButtonStyles(
            theme.palette.error.main,
            theme.palette.error.light,
            '#FFFFFF',
            theme.palette.error.main,
            theme.palette.error.main,
            theme.palette.error.light,
            theme.palette.grey[300],
            theme.palette.grey[100],
            false
          )
        },
        {
          props: { color: 'error', variant: 'outlined' },
          style: getButtonStyles(
            theme.palette.error.main,
            'transparent',
            theme.palette.error.main,
            '#FDE8E0',
            theme.palette.error.main,
            '#FDE8E0',
            theme.palette.grey[300],
            'transparent',
            true
          )
        },
        {
          props: { color: 'success', variant: 'contained' },
          style: getButtonStyles(
            theme.palette.success.dark,
            theme.palette.success.light,
            '#FFFFFF',
            theme.palette.success.main,
            theme.palette.success.dark,
            theme.palette.success.light,
            theme.palette.grey[300],
            theme.palette.grey[100],
            false
          )
        },
        {
          props: { color: 'success', variant: 'outlined' },
          style: getButtonStyles(
            theme.palette.success.dark,
            'transparent',
            theme.palette.success.dark,
            theme.palette.success.light,
            theme.palette.success.dark,
            theme.palette.success.light,
            theme.palette.grey[300],
            'transparent',
            true
          )
        },
        {
          props: { color: 'warning', variant: 'contained' },
          style: getButtonStyles(
            theme.palette.warning.dark,
            theme.palette.warning.light,
            '#FFFFFF',
            theme.palette.warning.main,
            theme.palette.warning.dark,
            theme.palette.warning.light,
            theme.palette.grey[300],
            theme.palette.grey[100],
            false
          )
        },
        {
          props: { color: 'warning', variant: 'outlined' },
          style: getButtonStyles(
            theme.palette.warning.main,
            'transparent',
            theme.palette.warning.main,
            theme.palette.warning.light,
            theme.palette.warning.main,
            theme.palette.warning.light,
            theme.palette.grey[300],
            'transparent',
            true
          )
        },
      ]
    }
  }
});

export function Button({ children, ...props }) {
  return (
    <ThemeProvider theme={ButtonTheme}>
      <MuiButton {...props}>{children}</MuiButton>
    </ThemeProvider>
  )
}
