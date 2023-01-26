import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries'
import { useQuery, useMutation } from '@apollo/client';

import { deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {

  // const { loading, data } = useQuery(GET_ME);
  // const myData = data?.me
  // const [removeBook, {error }] = useMutation(REMOVE_BOOK)

  // const [userData, setUserData] = useState({});

  // setUserData(myData)

  const { loading, data } = useQuery(GET_ME);
  let userData = data?.me
  const [removeBook, {error }] = useMutation(REMOVE_BOOK)

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    console.log("bookId is " + bookId)
    try {
      const { data } = await removeBook({
        variables: {
          bookId: bookId
        }
      })

      if (!data) {
        throw new Error('something went wrong!');
      }
      console.log(data.removeBook);
      userData = data.removeBook
      // const updatedUser = data?.removeBook
      // setUserData(updatedUser);

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return((<h2>LOADING...</h2>) )
  } 


  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
        <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
      
    </>
  );
};

export default SavedBooks;
