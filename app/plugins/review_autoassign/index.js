import _ from 'lodash';

import logger from 'app/core/logger';
import review from 'app/core/review/review';
import saveReview from 'app/core/review/actions/save';

import github from 'app/core/github/api';
import badges from 'app/core/badges';
import events ftom 'app/core/events'

/**
 * Plugin for auto assign reviewers for pull request.
 *
 * @param {{ PullRequest }} pullRequest
 */
function reviewAutoStart({ pullRequest }) {
    logger.info(`Autostart review for pull "${pullRequest.id} — ${pullRequest.title}"`);

    // if (!_.isEmpty(pullRequest.review.reviewrs)) return;

    review(pullRequest.id)
        .then(resultReview => saveReview({ reviewers: resultReview.team}, pullRequest.id))
        .then((pullRequest) => {
            github.setBodyContent(
                pullRequest.id,
                'review:reviewers_badge',
                badges.create('review_status', pullRequest.review) +
                    pullRequest.review.reviewers.map((item) => {
                        return badges.create('reviewer', item);
                    }).join(' ')
            );
        }, ::logger.error);
};

/**
 * Creates review autoassign plugin.
 */
export default function reviewAutoAssignCreator() {
    events.on('github:pull_request:opened', reviewAutoStart);
}
