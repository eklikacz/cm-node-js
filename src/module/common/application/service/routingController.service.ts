import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Logger } from './';
import { HttpMethod } from '@common/domain/enum';

export class RoutingControllerService {
  private readonly router: Router;
  private readonly logger: Logger;

  public constructor (
    private readonly path: string = '/',
  ) {
    this.router = Router();
    this.logger = Logger.instance();
  }

  public register (
    path: string,
    method: HttpMethod,
    handler: (req: Request, res: Response) => any,
    successResultStatus: StatusCodes,
    customMiddlewares: RequestHandler[] = [],
  ): RoutingControllerService {
    customMiddlewares.push((req: Request, res: Response, next: NextFunction) => {
      res.locals.customPath = this.path + path;
      next();
    });

    this.router[method.toLowerCase()](path, ...customMiddlewares, this.prepareHandler(handler, successResultStatus));
    this.logger.debug('Register routing: ' + method + ' ' + this.path + path);

    return this;
  }

  private async finalPromise (result: Promise<any> | any) {
    return result instanceof Promise ? await result : result;
  }

  private prepareHandler (handler: <T> (req: Request, res: Response) => Promise<T> | T, resultCode: StatusCodes) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await this.finalPromise(handler(req, res));

        if (resultCode === StatusCodes.NO_CONTENT) {
          res.status(resultCode).send();

          return next();
        }

        if (result instanceof Response) {
          if (!(<any>result).headersSent) {
            res.status(resultCode).json({});
          }

          return next();
        }

        if (typeof result === 'object') {
          res.status(resultCode).json(result);
        } else {
          res.status(resultCode).send(result);
        }

        return next();
      } catch (err) {
        next(err);
      }
    };
  }

  public static createRouting (path: string = '/', cb: (routing: RoutingControllerService) => RoutingControllerService): [string, Router] {
    const routingController = new RoutingControllerService(path);

    return [path, cb(routingController).router];
  }
}
