import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($author: [String], $description: String, $title: String, $bookId: Int, $image: String, $link: String){
        saveBook($author: [String], $description: String, $title: String, $bookId: Int, $image: String, $link: String){
            user {
                _id
                username
                savedBooks {
                    bookId
                    authors
                    descripiton
                    title
                    image
                    link
                }
            }
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: Int) {
        removeBook($bookId: Int){
            user {
                _id
                username
                savedBooks {
                    bookId
                    authors
                    descripiton
                    title
                    image
                    link
                }
            }
        }
    }
`;