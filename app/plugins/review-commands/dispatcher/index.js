import _ from 'lodash';

const COMMAND_REGEX = /^\/review\s+/i;

export default function commandsDispatcherCreator(options) {
    var commands = options.commands;

    return function commandsDispatcher(payload) {
        var comment = _.get(payload, ['comment', 'body']),
            cmd;

        if (comment && comment.match(COMMAND_REGEX)) {
            cmd = _.compact(comment.replace(COMMAND_REGEX, '').split(' '));
            cmd = cmd.map(c => c.toLowerCase());

            _.forEach(commands[cmd[0]], (processor) => {
                processor(cmd, payload);
            });
        }
    };
}