import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar, Tooltip
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import Logo from './Logo';

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  const navigate = useNavigate();

  const isAuthorized = localStorage.getItem('accessToken') !== null;

  return (
    <AppBar
      elevation={5}
      {...rest}
    >
      <Toolbar>
        <RouterLink to='/'>
          <Logo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgDown>
          {isAuthorized ?
            <Tooltip title={'Logout'}>
              <IconButton
                onClick={() => {
                  navigate('/logout', { replace: true });
                }}
                color='inherit'>
                <InputIcon />
              </IconButton>
            </Tooltip>
            : <></>}
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color='inherit'
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

export default DashboardNavbar;
