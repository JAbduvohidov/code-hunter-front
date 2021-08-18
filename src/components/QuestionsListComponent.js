import { Box, Grid, Link, Typography } from '@material-ui/core';
import moment from 'moment';
import MarkdownPreview from '@uiw/react-markdown-preview';

const QuestionsListComponent = ({ question }) => (
  <div style={{ margin: '15px' }}>
    <Grid container wrap='nowrap' spacing={2}>
      <Grid item>
        <Box maxWidth={45} marginBottom={1}>
          <Typography maxWidth={45} align={'center'} fontSize={14} color={'gray'}>
            {question.votes}
          </Typography>
          <Typography maxWidth={45} align={'center'} fontSize={12} color={'gray'}>
            votes
          </Typography>
        </Box>
        <Box maxWidth={40}>
          <Typography maxWidth={40} align={'center'} fontSize={14} color={'gray'}>
            {question.answersCount}
          </Typography>
          <Typography maxWidth={45} align={'center'} fontSize={12} color={'gray'}>
            answers
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Link href={'questions/' + question.id} color='inherit'>
          <Typography fontSize={16} color={'blue'} marginBottom={1}>
            {question.solved ? '[SOLVED] ': ''} {question.title}
          </Typography>
        </Link>
        <MarkdownPreview style={{fontSize: 14}} source={question.description} />
      </Grid>
    </Grid>
    <Typography fontSize={12} align={'right'}>
      asked: {moment(question.createdAt).format('DD/MM/YYYY hh:mm')}
    < /Typography>
  </div>
);

export default QuestionsListComponent;
