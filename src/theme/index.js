import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#f4f4f4',
      paper: colors.common.white
    },
    primary: {
      contrastText: '#ffffff',
      main: '#1a1a1a'
    },
    secondary: {
      contrastText: '#ffffff',
      main: '#56d262'
    },
    error: {
      contrastText: '#ffffff',
      main: '#d25656'
    },
    warning: {
      contrastText: '#ffffff',
      main: '#e59c0a'
    },
    text: {
      primary: '#172b4d',
      secondary: '#6b778c'
    }
  },
  shadows,
  typography
});

export default theme;
