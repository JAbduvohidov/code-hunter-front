import { Helmet } from 'react-helmet';
import {
  AppBar,
  Box,
  Button,
  Card, CardHeader,
  Container,
  Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  Grid, Menu, MenuItem,
  TableCell,
  TextField, Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import MarkdownPreview from '@uiw/react-markdown-preview';
import EditIcon from '@material-ui/icons/Edit';
import MarkdownEditor from '@uiw/react-markdown-editor';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const QuestionById = () => {

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { questionId } = useParams();

  const [question, setQuestion] = useState({});

  const isAdmin = localStorage.getItem('role') === 'Admin';
  const isAuthorized = localStorage.getItem('accessToken') !== null;
  const userId = localStorage.getItem('userId');

  const [questionEditOpen, setQuestionEditOpen] = useState(false);
  const [answerEditOpen, setAnswerEditOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newAnswerDescription, setNewAnswerDescription] = useState('');
  const [answerDescription, setAnswerDescription] = useState('');
  const [answerId, setAnswerId] = useState('');

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const handleDeleteConfirmationOpen = () => {
    setOpenDeleteConfirmation(true);
  };
  const handleDeleteConfirmationClose = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleQuestionEditOpen = () => {
    setQuestionEditOpen(true);
  };

  const handleQuestionEditClose = () => {
    setQuestionEditOpen(false);
  };

  const handleAnswerEditOpen = () => {
    setAnswerEditOpen(true);
  };

  const handleAnswerEditClose = () => {
    setAnswerEditOpen(false);
  };

  const handleEditQuestion = () => {
    return new Promise(resolve => {
      axios({
        method: 'PUT',
        url: 'http://localhost:5000/api/questions/' + questionId,
        data: {
          title: title,
          description: description
        },
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then((response) => {
        if (response.status === 200) {
          snackbar.enqueueSnackbar('Question edited successfully', {
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

  const handleToggleQuestionSolved = () => {
    return new Promise(resolve => {
      axios({
        method: 'PUT',
        url: 'http://localhost:5000/api/questions/' + questionId + '/solved',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then((response) => {
        if (response.status === 200) {
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

  const handleEditAnswer = () => {
    return new Promise(resolve => {
      axios({
        method: 'PUT',
        url: 'http://localhost:5000/api/questions/' + questionId + '/answers/' + answerId,
        data: {
          description: answerDescription
        },
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then((response) => {
        if (response.status === 200) {
          snackbar.enqueueSnackbar('Answer edited successfully', {
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

  const handleGetQuestionById = () => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/api/questions/' + questionId,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      },
      crossDomain: true
    }).then((response) => {
      if (response.status === 200) {
        setQuestion(response.data);
      }
    })
      .catch((error) => {
        snackbar.enqueueSnackbar(error.data.error, {
          variant: 'error'
        });
      });
  };

  const handleQuestionUseful = () => {
    return new Promise(resolve => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/api/questions/' + questionId + '/useful',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then(() => {
        resolve();
      })
        .catch((error) => {
          snackbar.enqueueSnackbar(error.data.error, {
            variant: 'error'
          });
        });
    });
  };

  const handleQuestionUnuseful = () => {
    return new Promise(resolve => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/api/questions/' + questionId + '/unuseful',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then(() => {
        resolve();
      })
        .catch((error) => {
          snackbar.enqueueSnackbar(error.data.error, {
            variant: 'error'
          });
        });
    });
  };

  const handleAnswerUseful = (answerId) => {
    return new Promise(resolve => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/api/questions/' + questionId + '/answers/' + answerId + '/useful',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then(() => {
        resolve();
      })
        .catch((error) => {
          snackbar.enqueueSnackbar(error.data.error, {
            variant: 'error'
          });
        });
    });
  };

  const handleAnswerUnuseful = (answerId) => {
    return new Promise(resolve => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/api/questions/' + questionId + '/answers/' + answerId + '/unuseful',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then(() => {
        resolve();
      })
        .catch((error) => {
          snackbar.enqueueSnackbar(error.data.error, {
            variant: 'error'
          });
        });
    });
  };

  const handleDeleteAnswer = () => {
    return new Promise(resolve => {
      axios({
        method: 'DELETE',
        url: 'http://localhost:5000/api/questions/' + questionId + '/answers/' + answerId,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then((response) => {
        if (response.status === 200) {
          snackbar.enqueueSnackbar('Answer deleted successfully', {
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

  const handleCreateAnswer = () => {
    return new Promise(resolve => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/api/questions/' + questionId + '/answers',
        data: {
          description: newAnswerDescription
        },
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then((response) => {
        if (response.status === 200) {
          snackbar.enqueueSnackbar('Answer posted successfully', {
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
    handleGetQuestionById();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <Helmet>
        <title>Question {questionId} | codehunter</title>
      </Helmet>
      <Container maxWidth={false}>
        <Dialog fullScreen open={questionEditOpen} onClose={handleQuestionEditClose}>
          <AppBar style={{ position: 'relative', backgroundColor: 'darkslategray' }}>
            <Toolbar>
              <IconButton edge='start' color='inherit' onClick={handleQuestionEditClose} aria-label='close'>
                <CloseIcon />
              </IconButton>
              <Typography variant='h6' style={{ marginLeft: 20, flex: 1 }}>
                Edit question
              </Typography>
              <Button autoFocus color='inherit' onClick={() => {
                handleEditQuestion().then(() => {
                  handleGetQuestionById();
                  handleQuestionEditClose();
                });
              }}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <Container style={{ marginTop: 10 }}>
            <TextField
              margin='dense'
              label='Title'
              value={title}
              required
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              fullWidth
            />
            <MarkdownEditor
              height={200}
              value={description}
              onChange={(editor, data, value) => setDescription(value)}
            />
          </Container>
        </Dialog>
        <Dialog fullScreen open={answerEditOpen} onClose={handleAnswerEditClose}>
          <AppBar style={{ position: 'relative', backgroundColor: 'darkslategray' }}>
            <Toolbar>
              <IconButton edge='start' color='inherit' onClick={handleAnswerEditClose} aria-label='close'>
                <CloseIcon />
              </IconButton>
              <Typography variant='h6' style={{ marginLeft: 20, flex: 1 }}>
                Edit answer
              </Typography>
              <Button autoFocus color='inherit' onClick={() => {
                handleEditAnswer().then(() => {
                  handleGetQuestionById();
                  handleAnswerEditClose();
                });
              }}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <Container style={{ marginTop: 10 }}>
            <MarkdownEditor
              height={200}
              value={answerDescription}
              onChange={(editor, data, value) => setAnswerDescription(value)}
            />
          </Container>
        </Dialog>
        <Dialog
          open={openDeleteConfirmation}
          onClose={handleDeleteConfirmationClose}
        >
          <DialogTitle>Are you sure you want to delete this question ?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              If you delete this question, it can not be restored!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmationClose} color='success' autoFocus>
              Cancel
            </Button>
            <Button onClick={() => {
              handleDeleteAnswer().then(() => {
                handleGetQuestionById();
                handleDeleteConfirmationClose();
              });
            }} color='error'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Box sx={{ pt: 3 }}>
          <Card>
            <div style={{ margin: '10px' }}>
              {isAuthorized && (isAdmin || userId === question.userId) ?
                  <Tooltip title={question.solved ? 'Mark unsolved' : 'Mark solved'}>
                    <IconButton size='small' onClick={() => {
                      handleToggleQuestionSolved().then(() => {
                        handleGetQuestionById();
                      });
                    }}>
                      <DoneAllIcon fontSize='inherit' />
                    </IconButton>
                  </Tooltip>
                  :
                  <></>}
              <Grid container direction={'row-reverse'} justifyContent={"space-between"} >
                <Grid item>
                  <Tooltip title='Search in...' onClick={handleMenuClick}>
                    <IconButton>
                      <MoreVertIcon color='primary' />
                    </IconButton>
                  </Tooltip>
                  <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleMenuClose}
                  >
                        <MenuItem key={'Stack Overflow'} onClick={handleMenuClose}>
                          <a href={"https://stackoverflow.com/search?q="+question.title} target="_blank" rel="noreferrer noopener">
                            Stack Overflow
                          </a>
                        </MenuItem>
                        <MenuItem key={'DuckDuckGo'} onClick={handleMenuClose}>
                          <a href={"https://duckduckgo.com/?q="+question.title} target="_blank" rel="noreferrer noopener">
                            DuckDuckGo
                          </a>
                        </MenuItem>
                        <MenuItem key={'Google'} onClick={handleMenuClose}>
                          <a href={"https://www.google.com/search?q="+question.title} target="_blank" rel="noreferrer noopener">
                            Google
                          </a>
                        </MenuItem>
                  </Menu>
                </Grid>
                <Grid item>
                  <Typography variant={'h3'} marginBottom={1}>
                    {question.solved ? '[SOLVED] ' : ''}{question.title}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction='row'
                justify='flex-start'
                alignItems='flex-start'>
                <Grid item marginRight={2}>
                  <Typography fontSize={14} color={'gray'}>
                    Asked: <b>{moment(question.createdAt).format('DD/MM/YYYY hh:mm')}</b>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography fontSize={14} color={'gray'}>
                    By: {question.username}
                  </Typography>
                </Grid>
              </Grid>
              <hr style={{ height: 1, borderWidth: 0, backgroundColor: '#c6c6c6' }} />
              <Grid
                container
                wrap={'nowrap'}
              >
                <Grid container
                      item
                      direction='column'
                      justify='flex-start'
                      alignItems='flex-start'
                      maxWidth={46}>
                  <Grid item>
                    <Tooltip title={'Useful'}>
                      <IconButton disabled={!isAuthorized} onClick={() => {
                        handleQuestionUseful().then(() => {
                          handleGetQuestionById();
                        });
                      }}>
                        <KeyboardArrowUpIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Typography width={46} align={'center'} variant={'h4'} fontWeight={'normal'} color={'gray'}>
                      {question.useful - question.notUseful}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Tooltip title={'Unuseful'}>
                      <IconButton disabled={!isAuthorized} onClick={() => {
                        handleQuestionUnuseful().then(() => {
                          handleGetQuestionById();
                        });
                      }}>
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Grid container item marginTop={2}>
                  <MarkdownPreview style={{ fontSize: 15 }} source={question.description} />
                </Grid>
                {isAuthorized && (isAdmin || question.userId === userId) ?
                  <TableCell align='center' style={{ borderBottom: 'none' }}>
                    <Tooltip title='Edit question' onClick={() => {
                      setTitle(question.title);
                      setDescription(question.description);
                      handleQuestionEditOpen();
                    }
                    }>
                      <IconButton>
                        <EditIcon color='primary' />
                      </IconButton>
                    </Tooltip>
                  </TableCell> : <></>}
              </Grid>
            </div>

            {/*<br />*/}
            {/*<hr style={{ border: 'none', background: 'none', height: '1px', borderBottom: '1px dotted gray' }} />*/}
            {/*<br />*/}

            <Typography variant={'subtitle1'} fontSize={20} marginLeft={1}>
              {question.answers && (question.answers.length > 1 ? question.answers.length + ' Answers' : question.answers.length + ' Answer')}
            </Typography>

            {question.answers && question.answers.map((answer) => (
              <div style={{ margin: '10px', marginTop: 0 }}>
                <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='flex-start'>
                  <Grid item marginRight={2}>
                    <Typography fontSize={14} color={'gray'}>
                      Solution by: {answer.username}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography fontSize={14} color={'gray'}>
                      at: <b>{moment(answer.createdAt).format('DD/MM/YYYY hh:mm')}</b>
                    </Typography>
                  </Grid>
                </Grid>
                <hr style={{ height: 1, borderWidth: 0, backgroundColor: '#c6c6c6' }} />
                <Grid
                  container
                  wrap={'nowrap'}
                >
                  <Grid container
                        item
                        direction='column'
                        justify='flex-start'
                        alignItems='flex-start'
                        maxWidth={46}>
                    <Grid item>
                      <Tooltip title={'Useful'}>
                        <IconButton disabled={!isAuthorized} onClick={() => {
                          handleAnswerUseful(answer.id).then(() => {
                            handleGetQuestionById();
                          });
                        }}>
                          <KeyboardArrowUpIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Typography width={46} align={'center'} variant={'h4'} fontWeight={'normal'} color={'gray'}>
                        {answer.useful - answer.notUseful}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Tooltip title={'Unuseful'}>
                        <IconButton disabled={!isAuthorized} onClick={() => {
                          handleAnswerUnuseful(answer.id).then(() => {
                            handleGetQuestionById();
                          });
                        }}>
                          <KeyboardArrowDownIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Grid container item marginTop={2}>
                    <MarkdownPreview style={{ fontSize: 15 }} source={answer.description} />
                  </Grid>
                  {isAuthorized && (isAdmin || answer.userId === userId) ?
                    <TableCell align='center' style={{ borderBottom: 'none' }}>
                      <Tooltip title='Edit answer' onClick={() => {
                        setAnswerDescription(answer.description);
                        setAnswerId(answer.id);
                        handleAnswerEditOpen();
                      }
                      }>
                        <IconButton>
                          <EditIcon color='primary' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete answer'>
                        <IconButton onClick={() => {
                          setAnswerId(answer.id);
                          handleDeleteConfirmationOpen();
                        }}>
                          <DeleteIcon color={'error'} />
                        </IconButton>
                      </Tooltip>
                    </TableCell> : <></>}
                </Grid>
              </div>
            ))}
          </Card>
        </Box>
        {isAuthorized ?
          <>
            <Box marginTop={5} marginBottom={2}>
              <Card>
                <CardHeader title='Your answer' />
                <MarkdownEditor
                  height={200}
                  value={newAnswerDescription}
                  onChange={(editor, data, value) => setNewAnswerDescription(value)}
                />
              </Card>
            </Box>
            <Button
              style={{ marginBottom: 10 }}
              variant='contained'
              color={'inherit'}
              onClick={() => {
                handleCreateAnswer().then(() => {
                  setNewAnswerDescription('');
                  handleGetQuestionById();
                });
              }}
            >
              Post your answer
            </Button>
          </>
          : <></>}
      </Container>
    </>
  );
};

export default QuestionById;
