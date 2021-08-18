import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button, Card, CardContent,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import { useEffect } from 'react';

const Register = () => {
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
        <title>Register | codehunter</title>
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
            <Container maxWidt='m'>
              <Formik
                initialValues={{
                  email: '',
                  username: '',
                  password: '',
                  confirmPassword: ''
                }}
                validationSchema={
                  Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('email is required'),
                    username: Yup.string().max(255).required('username is required'),
                    password: Yup.string().max(255).required('password is required'),
                    confirmPassword: Yup.string().max(255).required('confirm password is required')
                  })
                }
                onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                  axios({
                    method: 'POST',
                    url: 'http://localhost:5000/api/account/register',
                    data: {
                      username: values.username,
                      email: values.email,
                      password: values.password,
                      confirmPassword: values.confirmPassword
                    },
                    credentials: true
                  }).then((response) => {
                    if (response.status === 200) {
                      setSession(response.data.token, response.data.role);
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
                        Create new account
                      </Typography>
                      <Typography
                        color='textSecondary'
                        gutterBottom
                        variant='body2'
                      >
                        Use your email to create new account
                      </Typography>
                    </Box>
                    <TextField
                      error={Boolean(touched.username && errors.username)}
                      fullWidth
                      helperText={touched.username && errors.username}
                      label='Username'
                      margin='normal'
                      name='username'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      variant='outlined'
                    />
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
                    <TextField
                      error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                      fullWidth
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      label='Confirm Password'
                      margin='normal'
                      name='confirmPassword'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type='password'
                      value={values.confirmPassword}
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
                        Sign up now
                      </Button>
                    </Box>
                    <Typography
                      color='textSecondary'
                      variant='body1'
                    >
                      Have an account?
                      {' '}
                      <Link
                        component={RouterLink}
                        to='/login'
                        variant='h6'
                      >
                        Sign in
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

export default Register;
