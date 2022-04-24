import { Helmet } from 'react-helmet';
import {
  Autocomplete,
  Box, Button,
  Card,
  CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  InputAdornment,
  SvgIcon,
  Table, TableBody, TableCell,
  TableHead, TablePagination, TableRow,
  TextField, Tooltip
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search as SearchIcon } from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from 'notistack';

const Users = () => {
    const navigate = useNavigate();

    const snackbar = useSnackbar();

    const [users, setUsers] = useState([]);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');

    const [editOpen, setEditOpen] = useState(false);

    const handleEditOpen = () => {
      setEditOpen(true);
    };

    const handleEditClose = () => {
      setEditOpen(false);
    };

    const handleLimitChange = (event) => {
      setLimit(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
      setPage(newPage);
    };

    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };

    const handleDeleteConfirmationOpen = () => {
      setOpenDeleteConfirmation(true);
    };

    const handleEditUserChange = (title, value) => {
      setUser(prevState => ({ ...prevState, [title]: value }));
    };

    const handleDeleteConfirmationClose = () => {
      setOpenDeleteConfirmation(false);
    };

    const handleEditUser = () => {
      return new Promise(resolve => {
        axios({
          method: 'PUT',
          url: 'http://localhost:5000/api/users/' + user.id,
          data: {
            username: user.username,
            email: user.email,
            role: user.role
          },
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
          },
          crossDomain: true
        }).then((response) => {
          if (response.status === 200) {
            snackbar.enqueueSnackbar('User edited successfully', {
              variant: 'success'
            });
            resolve();
          }
        })
          .catch((error) => {
            if (error.response.status === 401) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('role');
              navigate('/questions', { replace: true });
            }
          });
      });
    };

    const handleDeleteUser = () => {
      axios({
        method: 'DELETE',
        url: 'http://localhost:5000/api/users/' + user.id,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then((response) => {
        if (response.status === 200) {
          snackbar.enqueueSnackbar('User deleted successfully', {
            variant: 'success'
          });
        }
      })
        .catch((error) => {
          if (error.response.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            navigate('/questions', { replace: true });
          }
        });
    };

    const handleGetUsers = () => {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/api/users',
        params: {
          email: email,
          limit: limit,
          offset: page * limit
        },
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then((response) => {
        if (response.status === 200) {
          setUsers(response.data);
        }
      })
        .catch((error) => {
          if (error.response.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            navigate('/questions', { replace: true });
          }
        });
    };

    const handleEdit = () => {
      handleEditUser().then(() => {
        handleGetUsers();
        handleEditClose();
      });
    };

    const isAdmin = localStorage.getItem('role') === 'Admin';

    useEffect(() => {
      if (localStorage.getItem('accessToken') === null) {
        navigate('/questions', { replace: true });
      }

      handleGetUsers();
    }, [email, page, limit]);

    return (
      <>
        <Helmet>
          <title>Users | codehunter</title>
        </Helmet>
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Edit user info</DialogTitle>
          <DialogContent>
            <TextField
              margin='dense'
              name='email'
              label='Email'
              type='email'
              value={user.email}
              fullWidth
              disabled
            />
            <TextField
              id='username'
              margin='dense'
              label='Username'
              type='text'
              value={user.username}
              onChange={(e) => {
                handleEditUserChange('username', e.target.value);
              }}
              fullWidth
            />
            <Autocomplete
              id='role'
              style={{ marginTop: 10 }}
              options={['User', 'Admin', 'Organization']}
              fullWidth
              onChange={(e, newValue) => {
                handleEditUserChange('role', newValue);
              }}
              value={user.role}
              renderInput={(params) => <TextField {...params} label='Role' variant='outlined' />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={handleEdit} color='warning'>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDeleteConfirmation}
          onClose={handleDeleteConfirmationClose}
        >
          <DialogTitle>Are you sure you want to delete this user ?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              If you delete this account <b>{user.email}</b> can not be restored!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmationClose} color='success' autoFocus>
              Cancel
            </Button>
            <Button onClick={() => {
              handleDeleteUser();
              handleGetUsers();
              handleDeleteConfirmationClose();
            }} color='error'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3
          }}
        >
          <Container maxWidth={false}>
            <Box>
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ maxWidth: 500 }}>
                      <TextField
                        fullWidth
                        onChange={handleEmailChange}
                        value={email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <SvgIcon
                                fontSize='small'
                                color='action'
                              >
                                <SearchIcon />
                              </SvgIcon>
                            </InputAdornment>
                          )
                        }}
                        placeholder='Search email'
                        variant='outlined'
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
            <Box sx={{ pt: 3 }}>
              <Card>
                <PerfectScrollbar>
                  <Box sx={{ minWidth: 1050 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            Username
                          </TableCell>
                          <TableCell>
                            Email
                          </TableCell>
                          {isAdmin &&
                          <TableCell>
                            Role
                          </TableCell>}
                          {isAdmin &&
                          <TableCell>
                            Removed
                          </TableCell>}
                          <TableCell>
                            Created at
                          </TableCell>
                          <TableCell>
                            Updated at
                          </TableCell>
                          {isAdmin &&
                          <TableCell align='center'>
                            ...
                          </TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.users && users.users.length ? users.users.map((user) => (
                          <TableRow
                            hover
                            key={user.id}
                          >
                            <TableCell>
                              {user.username}
                            </TableCell>
                            <TableCell>
                              {user.email}
                            </TableCell>
                            {isAdmin &&
                            <TableCell>
                              {user.role}
                            </TableCell>}
                            {isAdmin &&
                            <TableCell>
                              {user.removed.toString()}
                            </TableCell>}
                            <TableCell>
                              {moment(user.createdAt).format('DD/MM/YYYY hh:mm')}
                            </TableCell>
                            <TableCell>
                              {moment(user.updatedAt).format('DD/MM/YYYY hh:mm')}
                            </TableCell>
                            {isAdmin &&
                            <TableCell align='center'>
                              <Tooltip title='Edit user'>
                                <IconButton onClick={() => {
                                  setUser(user);
                                  handleEditOpen();
                                }}>
                                  <EditIcon color='primary' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Delete user'>
                                <IconButton disabled={user.removed} onClick={() => {
                                  setUser(user);
                                  handleDeleteConfirmationOpen();
                                }}>
                                  <DeleteIcon color={user.removed ? 'disabled' : 'error'} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>}
                          </TableRow>
                        )) : <TableRow>
                          <TableCell>
                            No data :(
                          </TableCell>
                        </TableRow>}
                      </TableBody>
                    </Table>
                  </Box>
                </PerfectScrollbar>
                <TablePagination
                  component='div'
                  count={users.count}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </Card>
            </Box>
          </Container>
        </Box>
      </>
    );
  }
;

export default Users;
