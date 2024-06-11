import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = GqlExecutionContext.create(ctx).getContext().req;

    return data ? req.user?.[data] : req.user;
  },
);
