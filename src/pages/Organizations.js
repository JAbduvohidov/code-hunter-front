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

const Organizations = () => {
    const navigate = useNavigate();

    const snackbar = useSnackbar();

    const [organizations, setOrganizations] = useState([]);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);
    const [email, setEmail] = useState('');
    const [organization, setOrganization] = useState('');

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

    const handleEditOrganizationChange = (title, value) => {
      setOrganization(prevState => ({ ...prevState, [title]: value }));
    };

    const handleDeleteConfirmationClose = () => {
      setOpenDeleteConfirmation(false);
    };

    const handleEditOrganization = () => {
      return new Promise(resolve => {
        axios({
          method: 'PUT',
          url: 'http://localhost:5000/api/users/' + organization.id,
          data: {
            username: organization.username,
            email: organization.email,
            role: organization.role
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

    const handleDeleteOrganization = () => {
      axios({
        method: 'DELETE',
        url: 'http://localhost:5000/api/users/' + organization.id,
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

    const handleGetOrganizations = () => {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/api/users/organizations',
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
          setOrganizations(response.data);
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
      handleEditOrganization().then(() => {
        handleGetOrganizations();
        handleEditClose();
      });
    };

    const isAdmin = localStorage.getItem('role') === 'Admin';

    useEffect(() => {
      if (localStorage.getItem('accessToken') === null) {
        navigate('/questions', { replace: true });
      }

      handleGetOrganizations();
    }, [email]);

    return (
      <>
        <Helmet>
          <title>Organizations | codehunter</title>
        </Helmet>
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Edit organization info</DialogTitle>
          <DialogContent>
            <TextField
              margin='dense'
              name='email'
              label='Email'
              type='email'
              value={organization.email}
              fullWidth
              disabled
            />
            <TextField
              id='username'
              margin='dense'
              label='Username'
              type='text'
              value={organization.username}
              onChange={(e) => {
                handleEditOrganizationChange('username', e.target.value);
              }}
              fullWidth
            />
            <Autocomplete
              id='role'
              style={{ marginTop: 10 }}
              options={['User', 'Organization']}
              fullWidth
              onChange={(e, newValue) => {
                handleEditOrganizationChange('role', newValue);
              }}
              value={organization.role}
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
          <DialogTitle>Are you sure you want to delete this organization ?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              If you delete this account <b>{organization.email}</b> can not be restored!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmationClose} color='success' autoFocus>
              Cancel
            </Button>
            <Button onClick={() => {
              handleDeleteOrganization();
              handleGetOrganizations();
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
                            Org. name
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
                        {organizations.organizations && organizations.organizations.length ? organizations.organizations.map((organization) => (
                          <TableRow
                            hover
                            key={organization.id}
                          >
                            <TableCell>
                              {organization.username}
                            </TableCell>
                            <TableCell>
                              {organization.email}
                            </TableCell>
                            {isAdmin &&
                            <TableCell>
                              {organization.role}
                            </TableCell>}
                            {isAdmin &&
                            <TableCell>
                              {organization.removed.toString()}
                            </TableCell>}
                            <TableCell>
                              {moment(organization.createdAt).format('DD/MM/YYYY hh:mm')}
                            </TableCell>
                            <TableCell>
                              {moment(organization.updatedAt).format('DD/MM/YYYY hh:mm')}
                            </TableCell>
                            {isAdmin &&
                            <TableCell align='center'>
                              <Tooltip title='Edit organization'>
                                <IconButton onClick={() => {
                                  setOrganization(organization);
                                  handleEditOpen();
                                }}>
                                  <EditIcon color='primary' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Delete organization'>
                                <IconButton disabled={organization.removed} onClick={() => {
                                  setOrganization(organization);
                                  handleDeleteConfirmationOpen();
                                }}>
                                  <DeleteIcon color={organization.removed ? 'disabled' : 'error'} />
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
                  count={organizations.count}
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

export default Organizations;
