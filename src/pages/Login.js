import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button, Card, CardContent,
  Container, FormHelperText,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import axios from 'axios';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();

  const setSession = (accessToken, role, userId) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/questions', { replace: true });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Login | codehunter</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Card style={{margin: 'auto'}}>
          <CardContent>
            <Container maxWidth='sm'>
              <Formik
                initialValues={{
                  email: '',
                  password: ''
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                  password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                  axios({
                    method: 'POST',
                    url: 'http://localhost:5000/api/account/login',
                    data: {
                      username: values.username,
                      email: values.email,
                      password: values.password,
                      confirmPassword: values.confirmPassword
                    },
                    credentials: true
                  }).then((response) => {
                    if (response.status === 200) {
                      setSession(response.data.token, response.data.role, response.data.userId);
                      navigate('/questions', { replace: true });
                    }
                  })
                    .catch((error) => {
                      if (!error.response.data.success) {
                        setStatus({ success: false });
                        setErrors({ submit: error.response.data.errors });
                        setSubmitting(false);
                      }
                    });
                }}
              >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values
                  }) => (
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        color='textPrimary'
                        variant='h2'
                      >
                        Sign in
                      </Typography>
                      <Typography
                        color='textSecondary'
                        gutterBottom
                        variant='body2'
                      >
                        Sign in on the internal platform
                      </Typography>
                    </Box>
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label='Email Address'
                      margin='normal'
                      name='email'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type='email'
                      value={values.email}
                      variant='outlined'
                    />
                    <TextField
                      error={Boolean(touched.password && errors.password)}
                      fullWidth
                      helperText={touched.password && errors.password}
                      label='Password'
                      margin='normal'
                      name='password'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type='password'
                      value={values.password}
                      variant='outlined'
                    />
                    {errors.submit && (
                      <Box mt={3}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                      </Box>
                    )}
                    <Box sx={{ py: 2 }}>
                      <Button
                        color='primary'
                        disabled={isSubmitting}
                        fullWidth
                        size='large'
                        type='submit'
                        variant='contained'
                      >
                        Sign in now
                      </Button>
                    </Box>
                    <Typography
                      color='textSecondary'
                      variant='body1'
                    >
                      Don&apos;t have an account?
                      {' '}
                      <Link
                        component={RouterLink}
                        to='/register'
                        variant='h6'
                      >
                        Sign up
                      </Link>
                    </Typography>
                  </form>
                )}
              </Formik>
            </Container>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Login;
