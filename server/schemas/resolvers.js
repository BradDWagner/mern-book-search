const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, { user = null, params }) => {
            const me = await User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
            })
            return me;
        },
        getAll: async () =>{
            return User.find({})
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user found with this email address');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },
          addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },
          saveBook: async (parent, { book }, context) => {
            console.log( context + book )
            if (context.user) {
              return User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: {...book}}},
                { new: true, runValidators: true }
              )
             }
             throw new AuthenticationError('You need to be logged in!');
          },
          removeBook: async (parent, { userId, book }) => {
            return User.findOneAndUpdate(
                {_id: userId },
                { $pull: { savedBooks: { bookId: book } } },
                { new: true }
            )
          }
    }
}

module.exports = resolvers;