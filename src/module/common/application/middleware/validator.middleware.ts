import { NextFunction, Request, Response } from 'express';
import { BadRequestError, ValidationError } from '@common/domain/error/rest';
import { DependencyService, RoutingValidatorService } from '@common/application/service';

export const createValidatorMiddleware = () => {
  const routingValidator: RoutingValidatorService = DependencyService.instance().resolve(RoutingValidatorService);

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const validations = routingValidator.getValidators(req.method, req.baseUrl + req.route.path);
    const err = new BadRequestError('Invalid validation parameters');

    err.errors = [];


    for (const validation of validations) {
      const result = await validation.run(req, { dryRun: true });

      if (!result.isEmpty()) {
        err.errors.push(
          ...result.context.errors
            .map(exception => new ValidationError(
              exception.type === 'field'
                ? `Error in ${exception.location} at ${exception.path}: ${exception.msg}`
                : 'Error: ' + exception.msg,
            ),
            ),
        );
      }
    }

    if (err.errors.length > 0) {
      return next(err);
    }

    next();
  };
};
