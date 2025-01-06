declare namespace Express {
  interface Request {
    user: {
      _id: unknown;
      username: string;
    };
    book: {
      bookId: string;
      title: string;
      authors: string[];
      description: string;
      image: string;
      link: string;
    }
  }
}
