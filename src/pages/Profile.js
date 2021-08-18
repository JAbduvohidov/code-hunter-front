import { Helmet } from 'react-helmet';
import {
  Box, Button, Card, CardContent, CardHeader,
  Container, Divider,
  Grid, TextField
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Profile = () => {

  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const [user, setUser] = useState({
    id: '',
    username: '',
    email: '',
    role: '',
    createdAt: '',
    updatedAt: ''
  });

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  };

  const handleGetProfile = () => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/api/users/profile',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      },
      crossDomain: true
    }).then((response) => {
      if (response.status === 200) {
        setUser(response.data);
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
          snackbar.enqueueSnackbar('Changes saved', {
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

  useEffect(() => {
    handleGetProfile();
  }, []);

  return (
    <>
      <Helmet>
        <title>Profile | codehunter</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth='lg'>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={8}
              md={6}
              xs={12}
            >
              <form
                autoComplete='off'
                noValidate
              >
                <Card>
                  <CardHeader
                    subheader='The information can be edited'
                    title='Profile'
                  />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          helperText='Please specify a username'
                          label='Username'
                          name='username'
                          onChange={handleChange}
                          required
                          value={user.username}
                          variant='outlined'
                        />
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          label='Email Address'
                          name='email'
                          value={user.email}
                          disabled
                          variant={'standard'}
                        />
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          label='Created at'
                          name='createdAt'
                          value={user.createdAt}
                          disabled
                          variant={'standard'}
                        />
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          label='Updated at'
                          name='updatedAt'
                          value={user.updatedAt}
                          disabled
                          variant={'standard'}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      p: 2
                    }}
                  >
                    <Button
                      color='primary'
                      variant='contained'
                      onClick={() => {
                        handleEditUser().then(() => {
                          handleGetProfile();
                        });
                      }}
                    >
                      Save username
                    </Button>
                  </Box>
                </Card>
              </form>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Profile;
