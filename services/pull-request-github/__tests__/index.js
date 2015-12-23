'use strict';

import { PullRequestGitHub } from '../../pull-request-github';

describe('services/pull-request-github', () => {

  let github, model, options, pr;

  beforeEach(() => {
    model = sinon.stub();

    github = sinon.stub();

    options = {
      separator: {
        top: '<div id="top"></div>',
        bottom: '<div id="bottom"></div>'
      }
    };

    pr = new PullRequestGitHub(options, github, model);
  });

  describe('#cleanPullRequestBody', () => {

    it('should be able to clean pull request body from old content', () => {
      const body = `
BODY TEXT
<div id="top"></div>
EXTRA BODY TEXT
<div id="bottom"></div>
`;

      const result = pr.cleanPullRequestBody(body);

      assert.equal(result, 'BODY TEXT');
    });

  });

  describe('#fillPullRequestBody', () => {

    it('should be able to replace pull request body', () => {
      const body = `
BODY TEXT
<div id="top"></div>
<div>EXTRA BODY TEXT</div>
<div id="bottom"></div>
`;

      const pullRequest = {
        body: body,
        section: {
          id1: 'ID1',
          id2: 'ID2'
        }
      };

      pr.fillPullRequestBody(pullRequest);

      const expected = 'BODY TEXT\n' +
                       '<div id="top"></div>' +
                       '<div>ID1</div>' +
                       '<div>ID2</div>' +
                       '<div id="bottom"></div>\n';

      assert.equal(pullRequest.body, expected);
    });

  });

  describe('#buildBodyContent', () => {

    it('should put sections in correct order in body content', () => {
      const sections = {
        id1: 'content 1',
        id2: {
          content: 'content 2',
          position: 1
        },
        id3: {
          content: 'content 3',
          position: 10
        }
      };

      assert.equal(
        pr.buildBodyContent(sections),
        '<div>content 2</div><div>content 3</div><div>content 1</div>'
      );
    });
  });

});
