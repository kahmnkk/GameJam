// Modules
const express = require('express');
const router = express.Router();

// Common
const errors = require('@src/errors');
const dbMgr = require('@src/database/dbMgr');

// Api
const SessionMgr = require('@src/api/sessionMgr');

// Utils
const utils = require('@src/utils/utils');
const time = require('@src/utils/time');

const timePrefix = 10000000000;

async function endGame(req, res) {
    const reqKeys = {
        name: 'name',
        score: 'score',
    };
    const resKeys = {
        result: 'result',
    };

    const session = new SessionMgr(req, res);
    const body = session.body;

    try {
        let response = {};

        const name = body[reqKeys.name];
        const score = body[reqKeys.score];
        if (name == null || score == null) {
            throw utils.errorHandling(errors.invalidResponseData);
        }

        const userIdx = await dbMgr.redis.gen.client.incrby('userIdx', 1);

        await dbMgr.redis.user.client.set(userIdx, name);

        const nowTimestamp = time.nowTimestamp();
        const rankingTimeStr = timePrefix - nowTimestamp + '';
        const saveScore = score + rankingTimeStr;

        await dbMgr.redis.user.client.zadd('ranking', Number(saveScore), userIdx);

        response[resKeys.result] = true;
        session.send(response);
    } catch (err) {
        session.error(err);
    }
}

async function list(req, res) {
    const reqKeys = {};
    const resKeys = {
        list: 'list',
    };

    const session = new SessionMgr(req, res);
    const body = session.body;

    try {
        let response = {};

        const list = await dbMgr.redis.user.client.zrevrange('ranking', 0, 4, 'WITHSCORES');

        let rankingResponse = [];

        for (let i = 0; i < list.length; i += 2) {
            let item = {
                name: '',
                score: 0,
            };

            item.name = await dbMgr.redis.user.client.get(list[i]);
            item.score = Math.floor(list[i + 1] / timePrefix);

            rankingResponse.push(item);
        }

        response[resKeys.list] = rankingResponse;
        session.send(response);
    } catch (err) {
        session.error(err);
    }
}

utils.setRoute(router, '/end', endGame);
utils.setRoute(router, '/list', list);

module.exports = router;
