import {Helmet} from 'react-helmet';
import {
    Box,
    Card, Grid, Link, Table, TableBody, TableCell,
    TableHead, TableRow, Typography,
} from '@material-ui/core';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import MarkdownPreview from "@uiw/react-markdown-preview";

const Rating = () => {
        const navigate = useNavigate();

        const [rating, setRating] = useState([]);

        const handleGetRating = () => {
            axios({
                method: 'GET',
                url: 'http://localhost:5000/api/rating',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                },
                crossDomain: true
            }).then((response) => {
                if (response.status === 200) {
                    setRating(response.data);
                }
            })
                .catch((error) => {
                    if (error.response.status === 401) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('role');
                        navigate('/questions', {replace: true});
                    }
                });
        };

        useEffect(() => {
            if (localStorage.getItem('accessToken') === null) {
                navigate('/questions', {replace: true});
            }

            handleGetRating();
        }, []);

        return (
            <>
                <Helmet>
                    <title>Rating | codehunter</title>
                </Helmet>
                <Box
                    sx={{
                        backgroundColor: 'background.default',
                        py: 3
                    }}
                >
                    <Grid container direction={"row"} justifyContent={"space-around"}>
                        <Grid item xs margin={1}>
                            <Box sx={{pt: 3}}>
                                <Card>
                                    <Typography marginLeft={3} marginTop={3} variant="h3" component="div">
                                        <EmojiEventsIcon values={"Top 100 users by useful questions"}/> Top 100 users by
                                        useful questions
                                    </Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    No.
                                                </TableCell>
                                                <TableCell>
                                                    Username
                                                </TableCell>
                                                <TableCell>
                                                    Email
                                                </TableCell>
                                                <TableCell>
                                                    Useful Questions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rating.usefulQUsers && rating.usefulQUsers.length ? rating.usefulQUsers.map((user, index) => (
                                                <TableRow
                                                    hover
                                                    key={user.id}
                                                >
                                                    <TableCell>
                                                        #{index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.userName}
                                                    </TableCell>
                                                    <TableCell>
                                                        <a href={"mailto:" + user.email}>{user.email}</a>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.usefulQuestionsCount}
                                                    </TableCell>
                                                </TableRow>
                                            )) : <TableRow>
                                                <TableCell>
                                                    No data :(
                                                </TableCell>
                                            </TableRow>}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </Box>
                        </Grid>
                        <Grid item xs margin={1}>
                            <Box sx={{pt: 3}}>
                                <Card>
                                    <Typography marginLeft={3} marginTop={3} variant="h3" component="div">
                                        <EmojiEventsIcon values={"Top 100 users by useful answers"}/> Top 100 users by
                                        useful answers
                                    </Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    No.
                                                </TableCell>
                                                <TableCell>
                                                    Username
                                                </TableCell>
                                                <TableCell>
                                                    Email
                                                </TableCell>
                                                <TableCell>
                                                    Useful Answers
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rating.usefulAUsers && rating.usefulAUsers.length ? rating.usefulAUsers.map((user, index) => (
                                                <TableRow
                                                    hover
                                                    key={user.id}
                                                >
                                                    <TableCell>
                                                        #{index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.userName}
                                                    </TableCell>
                                                    <TableCell>
                                                        <a href={"mailto:" + user.email}>{user.email}</a>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.usefulAnswersCount}
                                                    </TableCell>
                                                </TableRow>
                                            )) : <TableRow>
                                                <TableCell>
                                                    No data :(
                                                </TableCell>
                                            </TableRow>}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container direction={"row"} justifyContent={"space-around"}>
                        <Grid item xs margin={1}>
                            <Box sx={{pt: 3}}>
                                <Card>
                                    <Typography marginLeft={3} marginTop={3} variant="h3" component="div">
                                        <EmojiEventsIcon values={"Top 100 useful questions"}/> Top 100 useful questions
                                    </Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    No.
                                                </TableCell>
                                                <TableCell>
                                                    Title
                                                </TableCell>
                                                <TableCell>
                                                    Useful
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rating.questions && rating.questions.length ? rating.questions.map((question, index) => (
                                                <TableRow
                                                    hover
                                                    key={question.id}
                                                >
                                                    <TableCell>
                                                        #{index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link href={"/questions/"+question.id} color='inherit'>
                                                            {question.solved ? '[SOLVED]' : ''}{question.title}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        {question.useful}
                                                    </TableCell>
                                                </TableRow>
                                            )) : <TableRow>
                                                <TableCell>
                                                    No data :(
                                                </TableCell>
                                            </TableRow>}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </Box>
                        </Grid>
                        <Grid item xs margin={1}>
                            <Box sx={{pt: 3}}>
                                <Card>
                                    <Typography marginLeft={3} marginTop={3} variant="h3" component="div">
                                        <EmojiEventsIcon values={"Top 100 useful answers"}/> Top 100 useful answers
                                    </Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    No.
                                                </TableCell>
                                                <TableCell>
                                                    Title
                                                </TableCell>
                                                <TableCell>
                                                    Useful
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rating.answers && rating.answers.length ? rating.answers.map((answer, index) => (
                                                <TableRow
                                                    hover
                                                    key={answer.id}
                                                >
                                                    <TableCell>
                                                        #{index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link href={"/questions/"+answer.questionId} color='inherit'>
                                                            <MarkdownPreview style={{fontSize: 15}}
                                                                             source={answer.description}/>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        {answer.useful}
                                                    </TableCell>
                                                </TableRow>
                                            )) : <TableRow>
                                                <TableCell>
                                                    No data :(
                                                </TableCell>
                                            </TableRow>}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </>
        );
    }
;

export default Rating;
