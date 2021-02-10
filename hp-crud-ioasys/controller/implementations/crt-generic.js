
const dao = require('../../dao/dao-generic');
const mapStatus = require('../../helpers/map-status');

var newModule = {
    methods: {
        saveOrUpdate: async (editing, req, fncResult) => {
            let element = !editing ? req.body : req.params;

            try {
                let result = await dao.findByPKAllStatus(element, false);
                if (!editing && result){
                    if (fncResult)
                        return fncResult(instantiateMessage(500, 'response.already.exists'), result);

                    return instantiateMessage(500, 'response.already.exists');
                }else if (editing){
                    if (!result){
                        if (fncResult)
                            return fncResult(instantiateMessage(404, 'response.not.found'), 'response.not.found');

                        return instantiateMessage(404, 'response.not.found');
                    }
                }

                result = await dao.saveOrUpdate(result, req.body);

                const msg = instantiateMessage(200, 'response.msg.success');
                msg.result = result;
                if (fncResult)
                    return fncResult(msg, false);
                
                return (msg);
            } catch (error) {
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = error;
                if (fncResult)
                    return fncResult(msg, error);
                
                throw error;
            }
        },
        save: async (req, fncResult) => {
            try {
                let result = await dao.save(req.body);
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.result = result;
                if (fncResult)
                    return fncResult(msg, false);
                
                return (msg);
            } catch (error) {
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = error;
                if (fncResult)
                    return fncResult(msg, error);
                
                throw error;
            }
        },
        update: async (req, fncResult) => {
            try {
                let result = await dao.update(req);
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.result = result;
                if (fncResult)
                    return fncResult(msg, false);
                
                return (msg);
            } catch (error) {
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = error;
                if (fncResult)
                    return fncResult(msg, error);
                
                throw error;
            }
        },
        archive: async (req, fncResult) => {
            try {
                let result = await dao.findByPK(req.params, false);
                
                if (result){
                    result.status = mapStatus.ARCHIVED;

                    result = await dao.saveOrUpdate(result, result);

                    const msg = instantiateMessage(200, 'response.msg.success');
                    msg.archived = true;
                    msg.result = result;

                    if (fncResult)
                        return fncResult(msg, false);
                    
                    return ({msg:msg, bool: false});
                }else {
                    if (fncResult)
                        return fncResult(instantiateMessage(404, 'response.not.found'), true);

                    return instantiateMessage(404, 'response.not.found');
                }
            } catch (error) {
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = error;
                if (fncResult)
                    return fncResult(msg, error);
                
                throw ({msg:msg, error:error});
            }
        },
        delete: async (req, fncResult) => {
            try {
                let result = await dao.delete(req.params);

                if (!result || result.lenght==0){
                    
                    if (fncResult)
                        return fncResult(instantiateMessage(404, 'response.not.found'), true);

                    return instantiateMessage(404, 'response.not.found')
                }else {
                    const msg = instantiateMessage(200, 'response.msg.success');
                    msg.deleted = true;
                    msg.result = result;
                    if (fncResult)
                        return fncResult(msg, false);

                    return msg    
                }
            } catch (error) {
                console.log(error);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = error;
                if (fncResult)
                    return fncResult(msg, error);
                
                throw ({msg:msg, error:error});
            }
        },
        listAll: async (fncResult) => {
            try {
                let result = await dao.findAll();
                const msg = instantiateMessage(200, 'response.msg.success');
                msg.results = result;
                if (fncResult)
                    return fncResult(msg, false);
                
                return msg  
            } catch (error) {
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = error;
                if (fncResult)
                    return fncResult(msg, error);
                
                throw ({msg:msg, error:error});
            }
        },
        countDocuments: async (filters, fncResult) => {
            dao.countDocuments(filters, (response) => {
                if (response){
                    const msg = instantiateMessage(200, 'response.msg.success');
                    msg.count = response;
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
        getByPK: async (req, returnAllFields, fncResult) => {
            try {
                let result = await dao.findByPK(req.params, returnAllFields);
                if (!result){
                    if (fncResult)
                        return fncResult(instantiateMessage(404, 'response.not.found'), true);

                    return instantiateMessage(404, 'response.not.found')
                }else {
                    const msg = instantiateMessage(200, 'response.msg.success');
                    msg.result = result;
                    if (fncResult)
                        return fncResult(msg, false);

                    return msg;
                }
            } catch (error) {
                console.log(error);
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = error;
                if (fncResult)
                    return fncResult(msg, error);
                
                throw ({msg:msg, error:error})
            }
        },
        getByPKAllStatus: async (req, returnAllFields,  fncResult) => {
            try {
                let result = await dao.findByPKAllStatus(req.params, returnAllFields);
                if (!result){
                    if (fncResult)
                        return fncResult(instantiateMessage(404, 'response.not.found'), true);

                    return instantiateMessage(404, 'response.not.found')
                }else {
                    const msg = instantiateMessage(200, 'response.msg.success');
                    msg.result = result;
                    if (fncResult)
                        return fncResult(msg, false);

                    throw msg;
                }
            } catch (error) {
                const msg = instantiateMessage(500, 'response.msg.error.generic');
                msg.systemError = error;
                if (fncResult)
                    return fncResult(msg, error);
                
                throw ({msg:msg, error:error})
            }
        }
    }
};

module.exports = newModule;