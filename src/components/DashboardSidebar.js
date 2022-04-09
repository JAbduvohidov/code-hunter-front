import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  Hidden,
  List
} from '@material-ui/core';
import {
  Lock as LockIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';
import PublicRoundedIcon from '@material-ui/icons/PublicRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import BusinessIcon from '@material-ui/icons//Business';

const DashboardSidebar = ({onMobileClose, openMobile}) => {
  const location = useLocation();

  const isAuthorized = localStorage.getItem('accessToken') !== null;

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box sx={{p: 2}}>
        <List>
          <NavItem
            href={'/questions'}
            key={'Questions'}
            title={'Questions'}
            icon={PublicRoundedIcon}
          />
          {(isAuthorized) ?
            <NavItem
              href={'/users'}
              key={'Users'}
              title={'Users'}
              icon={UsersIcon}
            /> : <></>}
          {(isAuthorized) ?
            <NavItem
              href={'/profile'}
              key={'Profile'}
              title={'Profile'}
              icon={AccountCircleIcon}
            /> : <></>}
          {(isAuthorized) ?
            <NavItem
              href={'/rating'}
              key={'Rating'}
              title={'Rating'}
              icon={TrendingUpIcon}
            /> : <></>}
          {(isAuthorized) ?
            <NavItem
              href={'/organizations'}
              key={'organizations'}
              title={'Organizations'}
              icon={BusinessIcon}
            /> : <></>}
          {(!isAuthorized) ? <NavItem
            href={'/login'}
            key={'Login'}
            title={'Login'}
            icon={LockIcon}
          /> : <></>}
          {(isAuthorized) ? <NavItem
            href={'/logout'}
            key={'Logout'}
            title={'Logout'}
            icon={LockIcon}
          /> : <></>}
          {(!isAuthorized) ? <NavItem
            href={'/register'}
            key={'Register'}
            title={'Register'}
            icon={UserPlusIcon}
          /> : <></>}
        </List>
      </Box>
      <Box sx={{flexGrow: 1}}/>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor='left'
          onClose={onMobileClose}
          open={openMobile}
          variant='temporary'
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor='left'
          open
          variant='persistent'
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {
  },
  openMobile: false
};

export default DashboardSidebar;
