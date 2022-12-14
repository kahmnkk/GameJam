// https://github.com/ilearnio/module-alias
require('module-alias/register');

const config = require('@root/config');
const errors = require('@src/errors');

const service = require('@root/src/core/service');
const ApiService = require('@root/src/core/apiService');

const utils = require('@src/utils/utils');
const logger = require('@src/utils/logger');

async function initApiService() {
    const apiService = new ApiService({
        sessionStore: config.redis.sessionStore,
        port: config.port.api,
    });

    await apiService.init();
    apiService.run();
    service.api = apiService;
}

async function proc(serverType) {
    try {
        logger.init(serverType);

        switch (serverType) {
            case 'api':
                await initApiService();
                break;

            default:
                throw utils.errorHandling(errors.undefinedServer);
        }
    } catch (err) {
        logger.error(err);
    }
}

const commands = process.argv.slice(2);
proc(commands[0]);
