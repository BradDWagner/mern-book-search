import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me {
        me {
            username
            savedBooks {
                authors
                description
                bookId
                image
                link
                title
            }
        }
    }
`