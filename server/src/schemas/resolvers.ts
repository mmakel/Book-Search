import { BookDocument } from '../models/Book.js';
//import { User } from '../models/index.js';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    savedBooks: BookDocument[];
}

interface ProfileArgs {
    userId: string;
}

interface AddProfileArgs {
    input:{
        username: string;
        email: string;
        password: string;
    }
}

interface Context {
    user?: User;
}

const resolvers = {
    Query: {
        users: async (): Promise<User[]> => {
            return await User.find();
        },
        user: async (_parent: any, args: ProfileArgs): Promise<User | null> => {
            return await User.findOne({ _id: args.userId });
        },
        me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
            if(context.user){
                return await User.findOne({ _id: context.user._id });
            }
            throw new Error('Unauthorized');
        },
    },
    Mutation: {
        addUser: async (_parent: any, args: AddProfileArgs): Promise<{ token: string, user: User }> => {
            const user = await User.create(args.input) as User;
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
            //return signToken(user.username, user.email, user._id);
        },
        login: async (_parent: any, args: any): Promise<{ token: string, user: User }> => {
            const user = await User.findOne({ username: args.input.username });
            if (!user) {
              throw new Error('Invalid credentials');
            }
            const correctPw = await user.isCorrectPassword(args.input.password);
            if (!correctPw) {
              throw new Error('Invalid credentials');
            }
            const token = signToken(user.username, user.email, user._id);
            const userExp = user as User;
            return { token, userExp };
          },
        addBook: async (_parent: any, args: any, context: Context): Promise<User | null> => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }
            return await User.findByIdAndUpdate(
                context.user._id,
                { $addToSet: { savedBooks: args.input } },
                { new: true }
            );
            //return updatedUser;
        }
    },
};

export default resolvers;