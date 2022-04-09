import {Helmet} from 'react-helmet';
import {
    Box,
    Card, Container, Icon,
    Table, TableBody, TableCell,
    TableHead, TablePagination, TableRow, Typography,
} from '@material-ui/core';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';

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
                    <Container>
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
                                                    {question.solved ? '[SOLVED]' : ''}{question.title}
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
                    </Container>

                    <Container>
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
                                                    {answer.description}
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
                    </Container>
                </Box>
            </>
        );
    }
;

export default Rating;
