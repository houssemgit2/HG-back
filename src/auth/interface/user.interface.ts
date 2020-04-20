// todo use this until you fixe the get user Decorator src/auth/get-user.decorator.ts
import { Request } from 'express';
import { User } from '../../entities/User';

// import this to use req.user
export interface ReqWithUser extends Request {
  user: User; // or any other type
}
