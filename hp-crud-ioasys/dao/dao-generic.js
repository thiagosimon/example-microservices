const mongoose = require('mongoose');
const mapStatus = require('../helpers/map-status');

let Collection = null;
let pkNames = [];
let excludedKeysOnResult = [];

var newModule = {
    setCollection: (fileName, collectionName, primaryKey, excludedKeys) => {
        require('../models/'+fileName);
        Collection = mongoose.model(collectionName);
        if (primaryKey){
            pkNames = primaryKey;
        }else{
            pkNames = null;
        }
        if (excludedKeysOnResult){
            excludedKeysOnResult = excludedKeys;
        }else{
            excludedKeysOnResult = null;
        }
    },
    saveOrUpdate: async (oldObj, element, fncSuccess, fncError) => {
        if (!isDbConnected) {
            if (fncError){
                return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});
            }
            throw {error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'};
        }
        let newObj = new Collection({status: mapStatus.ACTIVE});
        if (element && element.status){
            newObj.status = element.status;
        }
        if (oldObj){//in case of edit
            newObj = oldObj;
        } 
        Reflect.ownKeys(element).forEach(key => {
            let value = element[key];
            
            newObj[key] = value;
        });

        pkNames.forEach(function (value) {
            if (value != '_id'){
                newObj[value] = newObj[value].toString().toLowerCase();
            }
        });
        
        try {
            let collection = await newObj.save();

            let copy = JSON.parse(JSON.stringify(collection));
            if (excludedKeysOnResult && excludedKeysOnResult.length>0){
                excludedKeysOnResult.forEach(function (value) {
                    delete copy[value];
                });
            }
            if (fncSuccess)
                return fncSuccess(copy);

            return collection;
        } catch (err) {
            console.log(`caught the error: ${err.stack}`);
            if (fncError)
                return fncError(err.stack);
            
            throw err;
        }
    },
    save: async (element, fncSuccess, fncError) => {
        if (!isDbConnected) {
            if (fncError){
                return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});
            }
            throw {error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'};
        }
        let newObj = new Collection({status: mapStatus.ACTIVE});
        
        Reflect.ownKeys(element).forEach(key => {
            let value = element[key];
           
            newObj[key] = value;
        });
        pkNames.forEach(function (value) {
            if (value != '_id'){
                newObj[value] = newObj[value].toString().toLowerCase();
            }
        });

        try {
            let collection = await newObj.save();

            let copy = JSON.parse(JSON.stringify(collection));
            if (excludedKeysOnResult && excludedKeysOnResult.length>0){
                excludedKeysOnResult.forEach(function (value) {
                    delete copy[value];
                });
            }
            if (fncSuccess){
                return fncSuccess(copy);
            }

            return copy;
        } catch (err) {
            console.log(`caught the error: ${err.stack}`);
            if (fncError)
                return fncError(err.stack);
            
            throw err;
        }
    },
    update: async (element, fncSuccess, fncError) => {
        if (!isDbConnected) {
            if (fncError){
                return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});
            }
            throw {error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'};
        }
        let newValues = {};

        Reflect.ownKeys(element.body).forEach(key => {
            let value = element.body[key];
     
            if (key!="_id")
                newValues[key] = value;
        });

        try {
            let collection = Collection.updateOne(element.params, { $set: newValues });

            if (fncSuccess){
                return fncSuccess(collection);
            }
            return collection;
        } catch (err) {
            console.log(`caught the error: ${err.stack}`);
            if (`${err.name}` == 'CastError' && `${err.kind}` == 'ObjectId'){
                return fncSuccess(null);
            }
            if (fncError)
                return fncError(err.stack);
            
            throw err;
        }
    },
    delete: async (element, fncSuccess, fncError) => {
        if (!isDbConnected) {
            if (fncError)
                return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});

            return {error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'}    
        }

        let params = {};
        pkNames.forEach(function (value) {
            params[value] = element[value];
        });

        try {
            let obj = await Collection.findOne(params);
            if (!obj) {
                if (fncSuccess)
                    return fncSuccess(null);

                return null;    
            }
            obj.remove();

            if (fncSuccess)
                return fncSuccess(obj);

            return obj;
        } catch (err) {
            console.log(`caught the error: ${err.stack}`);

            if (`${err.name}` == 'CastError' && `${err.kind}` == 'ObjectId'){
                return fncSuccess(null);
            }

            if (fncError)
                return fncError(err.stack);
            
            throw err;
        }
    },
    listAllActive: (fncSuccess, fncError) => {
        if (!isDbConnected) return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});
        Collection.find({status: 'ACTIVE'})
        .then(params => {
            fncSuccess(params);
        }).catch((err) => {
            console.log(`caught the error1: ${err.stack}`);
            fncError(err.stack);
        });
    },
    findAll: async (fncSuccess, fncError) => {
        if (!isDbConnected) {
            if (fncError)
                return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});

            return {error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'}    
        }
        let excluded = {};
        if (excludedKeysOnResult){
            excludedKeysOnResult.forEach(function (value) {
                excluded[value] = 0;
            });
        }
        

        try {
            let obj = await Collection.find({}, excluded);

            if (fncSuccess)
                return fncSuccess(obj);

            return obj;
        } catch (err) {
            console.log(`caught the error: ${err.stack}`);
            if (`${err.name}` == 'CastError' && `${err.kind}` == 'ObjectId'){
                return fncSuccess(null);
            }

            if (fncError)
                return fncError(err.stack);
            
            throw err;
        }
    },
    findByPK: async (element, returnAllFields, fncSuccess, fncError) => {
        try {
            let result = await findByPK(element, returnAllFields);
    
            return result;
        } catch (error) {
            if (fncError)
                return fncError(error);
            
            throw error;
        }
    },
    findByPKAllStatus: async (element, returnAllFields, fncSuccess, fncError) => {
        try {
            let result = await findByPK(element, returnAllFields);
        
            if (fncSuccess)
                return fncSuccess(result);
    
            return result;
        } catch (error) {
            if (fncError)
                return fncError(error);
            
            throw error;
        }
    },
    countDocuments: (filters, fncSuccess, fncError) => {
        console.log(Collection);
        Collection.countDocuments(filters)
        .then(result => {
            fncSuccess(result);
        }).catch((err) => {
            console.log(`caught the error1: ${err.stack}`);
            fncError(err.stack);
        });
    }
};



const findByPK = async (element, returnAllFields, fncSuccess, fncError, returnAll) => {
    if (!isDbConnected) {
        if (fncError)
            return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});

        return {error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'}    
    }
    let excluded = {};
    if (!returnAllFields && excludedKeysOnResult){
        excludedKeysOnResult.forEach(function (value) {
            excluded[value] = 0;
        });
    }
    let params = {};
    pkNames.forEach(function (value) {
        params[value] = element[value];
        if (value != '_id'){
            params[value] = params[value].toString().toLowerCase();
        }
    });
    
    if (!returnAll){
        params.status = {$ne: mapStatus.ARCHIVED};
    }

    try {
        let obj = await Collection.findOne(params, excluded);

        return obj;
    } catch (err) {
        if (`${err.name}` == 'CastError' && `${err.kind}` == 'ObjectId'){
            return fncSuccess(null);
        }
        console.log(`caught the error: ${err.stack}`);

        if (fncError)
            return fncError(err.stack);
        
        return err.stack;
    }
}

module.exports = newModule;