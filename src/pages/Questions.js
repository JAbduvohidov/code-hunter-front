import { Helmet } from 'react-helmet';
import {
  Box, Button,
  Card,
  CardContent,
  Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  InputAdornment,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TextField, Tooltip
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Search as SearchIcon } from 'react-feather';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import QuestionsListComponent from '../components/QuestionsListComponent';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MarkdownEditor from '@uiw/react-markdown-editor';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import AddIcon from '@material-ui/icons/Add';

const Questions = () => {

  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [question, setQuestion] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [questions, setQuestions] = useState([]);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const handleDeleteConfirmationOpen = () => {
    setOpenDeleteConfirmation(true);
  };
  const handleDeleteConfirmationClose = () => {
    setOpenDeleteConfirmation(false);
  };

  const isAdmin = localStorage.getItem('role') === 'Admin';
  const isAuthorized = localStorage.getItem('accessToken') !== null;
  const userId = localStorage.getItem('userId');

  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleGetQuestions = () => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/api/questions',
      params: {
        questionTitle: question,
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
        setQuestions(response.data);
      }
    })
      .catch((error) => {
        snackbar.enqueueSnackbar(error.data.error, {
          variant: 'error'
        });
      });
  };

  const handleDeleteQuestion = () => {
    return new Promise(resolve => {
      axios({
        method: 'DELETE',
        url: 'http://localhost:5000/api/questions/' + questionId,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        },
        crossDomain: true
      }).then((response) => {
        if (response.status === 200) {
          snackbar.enqueueSnackbar('Question deleted successfully', {
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

  const handleCreateQuestion = () => {
    return new Promise(resolve => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/api/questions',
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
          snackbar.enqueueSnackbar('Done!', {
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

  const handleToggleVote = (questionId) => {
    return new Promise(resolve => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/api/questions/' + questionId + '/vote',
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

  useEffect(() => {
    handleGetQuestions();
  }, [question]);

  return (
    <>
      <Helmet>
        <title>Questions | codehunter</title>
      </Helmet>
      {isAuthorized ?
        <Container style={{ marginTop: '20px' }}>
          <Box style={{ float: 'right' }}>
            <Button
              variant='contained'
              color={'inherit'}
              startIcon={<AddIcon />}
              onClick={handleCreateOpen}
            >
              Ask Question
            </Button>
          </Box>
        </Container>
        : <></>}
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Dialog fullWidth maxWidth='md' open={createOpen} onClose={handleCreateClose}>
          <DialogTitle>Fill question info</DialogTitle>
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={() => {
              handleCreateQuestion().then(() => {
                handleGetQuestions();
                handleCreateClose();
              });
            }} color='warning'>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Container maxWidth={false}>
          <Box marginTop={4}>
            <Box sx={{ mt: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ maxWidth: 500 }}>
                    <TextField
                      fullWidth
                      onChange={handleQuestionChange}
                      value={question}
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
                      placeholder='Search question'
                      variant='outlined'
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
          <Box sx={{ pt: 3 }}>
            <Dialog fullWidth maxWidth='md' open={editOpen} onClose={handleEditClose}>
              <DialogTitle>Edit question info</DialogTitle>
              <DialogContent>
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
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditClose} color='primary'>
                  Cancel
                </Button>
                <Button onClick={() => {
                  handleEditQuestion().then(() => {
                    handleGetQuestions();
                    handleEditClose();
                  });
                }} color='warning'>
                  Save
                </Button>
              </DialogActions>
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
                  handleDeleteQuestion().then(() => {
                    handleGetQuestions();
                    handleDeleteConfirmationClose();
                  });
                }} color='error'>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
            <Card>
              <PerfectScrollbar>
                <Box sx={{ minWidth: 1050 }}>
                  <Table>
                    <TableBody>
                      {questions.questions && questions.questions.length ? questions.questions.map((question) => (
                        <TableRow
                          hover
                          key={question.id}
                          style={{ borderBottom: '1px dashed gray' }}
                        >
                          <QuestionsListComponent question={question} />
                          {isAuthorized && (isAdmin || question.userId === userId) ? <TableCell align='center'>
                            <Tooltip title='Edit question' onClick={() => {
                              setQuestionId(question.id);
                              setTitle(question.title);
                              setDescription(question.description);
                              handleEditOpen();
                            }
                            }>
                              <IconButton>
                                <EditIcon color='primary' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete question'>
                              <IconButton onClick={() => {
                                setQuestionId(question.id);
                                handleDeleteConfirmationOpen();
                              }}>
                                <DeleteIcon color={'error'} />
                              </IconButton>
                            </Tooltip>
                          </TableCell> : <></>}
                          {isAuthorized && (question.userId !== userId) ?
                            <TableCell align={'center'}>
                              <Tooltip title='Vote' onClick={() => {
                                handleToggleVote(question.id).then(() => {
                                  handleGetQuestions();
                                });
                              }
                              }>
                                <IconButton>
                                  <ThumbUpAltRoundedIcon color='#000000' />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            : <></>}

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
                count={questions.count}
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
};

export default Questions;
