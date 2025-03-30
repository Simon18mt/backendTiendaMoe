// /lib/init-middleware.js

export default function initMiddleware(middleware) {
    return function (req, res) {
      return new Promise((resolve, reject) => {
        middleware(req, res, (result) => {
          if (result instanceof Error) {
            return reject(result);
          }
          return resolve(result);
        });
      });
    };
  }
  