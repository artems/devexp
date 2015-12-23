import pullRequestMock from './pull_request';

export default function () {
  const getStub = sinon.stub();

  getStub.withArgs('pull_request').returns(PullRequestMock());

  return { get: getStub };
}

export function PullRequestMock() {

  const stub = function () {
    return pullRequestMock();
  };

  stub.findById = sinon.stub(),
  stub.findByOwner = sinon.stub(),
  stub.findByReviewer = sinon.stub(),
  stub.findByRepositoryAndNumber = sinon.stub(),
  stub.findInReviewByReviewer = sinon.stub()

  return stub;

};
