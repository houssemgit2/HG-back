import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/entities/User';

export const GetUser = createParamDecorator(
  (data, req): User => {
    console.log(req);
    return req.user;
  },
);
