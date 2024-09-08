declare namespace Express {
  interface Request {
    user: {
      id: string;
      name: string;
      userName: string;
      email: string;
      picture: string;
      createdAt: string;
      updatedAt: string;
      jwtId: string;
    };
  }
}
