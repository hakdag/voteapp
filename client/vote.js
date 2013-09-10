Vote = function (pollId, vote, ip, userAgent, cookie) {
    var self = {
        timestamp: new Date().getTime(),
        poll: pollId,
        vote: vote,
        ip: ip,
        useragent: userAgent,
        cookie: cookie,
        hash: ""
    };
    return self;
};