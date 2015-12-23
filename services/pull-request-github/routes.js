'use strict';

import _ from 'lodash';
import { Router as router } from 'express';

import pullRequestHook from './webhooks/pull_request';
import issueCommentHook from './webhooks/issue_comment';

const GITHUB_HEADER_EVENT = 'x-github-event';

export default function (options, imports) {

  const logger = imports.logger;

  const githubRouter = router();

  githubRouter.get('/i', function (req, res) {
    res.send('ok').end();
  });

  githubRouter.post('/webhook', function (req, res) {
    if (!_.isPlainObject(req.body)) {
      res.error('req.body is not a plain object');
      return;
    }

    const reject = (e) => {
      logger.error(e);
      res.error(e);
    };

    const resolve = () => res.ok({ status: 'ok' });

    const eventName = req.headers[GITHUB_HEADER_EVENT];

    switch (eventName) {
      case 'ping':
        res.send('pong').end();
        return;

      case 'pull_request':
        pullRequestHook(req.body, imports)
          .then(resolve, reject);
        break;

      case 'issue_comment':
        issueCommentHook(req.body, imports)
          .then(resolve, reject);
        break;

      default:
        reject(new Error('Unknown event `${eventName}`'));
    }

  });

  return githubRouter;

}
