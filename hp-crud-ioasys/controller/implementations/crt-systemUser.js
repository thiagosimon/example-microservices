
const dao = require('../../dao/dao-systemUser');
const mapStatus = require('../../helpers/map-status');

var newModule = {
    methods: {
        findByEmail: (element, exclude, fncResult) => {
            dao.findByEmail(element, exclude, (response) => {
                if (response){
                    const msg = instantiateMessage(200, 'response.msg.success');
                    msg.result = response;
                    fncResult(msg);
                }else {
                    return fncResult(instantiateMessage(404, 'response.not.found'), true);
                }
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        },
        getPKGeneretedBySystem: async (query) => {
            try {
                let response = await dao.getPKGeneretedBySystem(query);

                const msg = instantiateMessage(200, 'response.msg.success');

                msg.result = response;
                return msg;
            } catch (error) {
                console.log(`caught the error: ${error.stack}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = error.stack;
                throw msg;
            }
        },
        updateSystemUser: (obj, params, fncResult) => {
            dao.updateSystemUser(obj, params, (response) => {
                const msg = instantiateMessage(200, 'sportis.msg.success');
                msg.result = response;
                fncResult(msg);
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'sportis.msg.error.generic');
                msg.systemError = err.stack;
                fncResult(msg);
            });
        },
        getPKReturnAll: async (query) => {
            try {
                let response = await dao.getPKReturnAll(query);

                const msg = instantiateMessage(200, 'response.msg.success');

                msg.result = response;
                return msg;
            } catch (error) {
                console.log(`caught the error: ${error.stack}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = error.stack;
                throw msg;
            }
        },
        checkEmail: (element, exclude, fncResult) => {
            dao.checkEmail(element, exclude, (response) => {
                if (response){
                    const msg = instantiateMessage(200, 'response.msg.success');
                    msg.result = response;
                    fncResult(msg);
                }else {
                    return fncResult(instantiateMessage(404, 'response.not.found'), true);
                }
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        },
        findByNickname: (element, exclude, fncResult) => {
            dao.findByNickname(element, exclude, (response) => {
                if (response){
                    const msg = instantiateMessage(200, 'response.msg.success');
                    msg.result = response;
                    fncResult(msg);
                }else {
                    return fncResult(instantiateMessage(404, 'response.not.found'), true);
                }
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        },
        findByName: async (element, fncResult) => {
            try {
                let response = await dao.findByName(element);
    
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.result = response;

                if (fncResult)
                    return fncResult(msg);

                return msg;    
            } catch (err) {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                if (fncResult)
                    return fncResult(msg);

                throw msg;
            }
        },
        findByFacebookId: (element, exclude, fncResult) => {
            dao.findByFacebookId(element, exclude, (response) => {
                if (response){
                    const msg = instantiateMessage(200, 'response.msg.success');
                    msg.result = response;
                    fncResult(msg);
                }else {
                    return fncResult(instantiateMessage(404, 'response.not.found'), true);
                }
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        },
        listAll: (fncResult) => {
            dao.listAll((response) => {
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.results = response;
                fncResult(msg);
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        },

        listAllByType: (query, fncResult) => {
            dao.listAllByType(query, (response) => {
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.results = response;
                fncResult(msg);
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        },
        clearAddrees: (element, fncResult) => {
            dao.clearAddrees(element, (response) => {
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.result = response;
                fncResult(msg);
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        },
        clearCard: (element, fncResult) => {
            dao.clearCard(element, (response) => {
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.result = response;
                fncResult(msg);
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        },
        checkNickname: (query, fncResult) => {
            dao.checkNickname(query, (response) => {
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.results = response;
                fncResult(msg);
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        },
        searchCompanyUsers: (query, fncResult) => {
            dao.searchCompanyUsers(query, (response) => {
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.results = response;
                fncResult(msg);
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        },
        searchCustomerUsers: (query, fncResult) => {
            dao.searchCustomerUsers(query, (response) => {
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.results = response;
                fncResult(msg);
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        },
        searchForApproval: (query, fncResult) => {
            dao.searchForApproval(query, (response) => {
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.results = response;
                fncResult(msg);
            }, (err) => {
                console.log(`caught the error: ${err}`);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = err.stack;
                return fncResult(msg);
            });
        }
    }
};

module.exports = newModule;