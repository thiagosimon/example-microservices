const mongoose = require('mongoose');

// Load Model
require('../models/SystemUsers');
require('../models/CustomerUsers');

const Collection = mongoose.model('system-users');
const CollectionCustomer = mongoose.model('customer-users');
var newModule = {
    findByEmail:(element, excludedKeysOnResult, fncSuccess, fncError) => {
        if (!isDbConnected) return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});
        let excluded = {};
        excludedKeysOnResult.forEach(function (value) {
            excluded[value] = 0;
        });
        Collection.findOne({email: element.email}, excluded)
        .populate('customerUser')
        .then(params => {
            fncSuccess(params);
        }).catch((err) => {
            console.log(`caught the error1: ${err.stack}`);
            fncError(err.stack);
        });
    },
    checkEmail:(element, excludedKeysOnResult, fncSuccess, fncError) => {
        if (!isDbConnected) return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});
        let excluded = {};
        excludedKeysOnResult.forEach(function (value) {
            excluded[value] = 0;
        });
        Collection.findOne({email: element.email}, excluded)
        .then(obj => {
            fncSuccess(obj);
        }).catch(err => {
            console.log(`caught the error: ${err}`);
            if (`${err.name}` == 'CastError' && `${err.kind}` == 'ObjectId'){
                return fncSuccess(null);
            }
            fncSuccess(err.stack);
        });
    },
    listAll: (fncSuccess, fncError) => {
        if (!isDbConnected) return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});
        let exclude = {
            password: 0
        }
        Collection.find({}, exclude)
        .populate({
            path: 'customerUser'
        })
        .then(params => {
            fncSuccess(params);
        }).catch((err) => {
            console.log(`caught the error1: ${err.stack}`);
            fncError(err.stack);
        });
    },
    listAllByType: (query, fncSuccess, fncError) => {
        if (!isDbConnected) return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});
        let exclude = {
            password: 0
        }

        let filter = {};
        if (query.type){
            filter.type = query.type;
        }
        
        Collection.find(filter, exclude)
        .populate({
            path: 'customerUser'
        })
        .then(params => {
            fncSuccess(params);
        }).catch((err) => {
            console.log(`caught the error1: ${err.stack}`);
            fncError(err.stack);
        });
    },
    searchCustomerUsers: (query, fncSuccess) => {

        if (!isDbConnected) return fncError({error: '## CRUD ERROR TO CONNECT TO DATABASE!!!!!'});

        let params = [];
        let paramsUser = [];
        let search = [];
        paramsUser.push({ $eq: [ "$_id", "$$idCustomerUser" ] });

        if (query.status){
            params.push({ status: query.status });
        }

        if (!query.name){
            query.name = '';
        }else{
            query.name = query.name.toLowerCase();
            query.name = query.name.replace(' ','').replace(' ','').replace(' ','');
        }
        
        params.push({ customerUser : { $ne: null } });
        params.push({ customerUser : { $ne: [] } });

        
        function diacriticSensitiveRegex(string = '') {
            return string.replace(/a/g, '[a,á,à,ä,ã,â]')
               .replace(/e/g, '[e,é,ë,ê]')
               .replace(/i/g, '[i,í,ï,î]')
               .replace(/c/g, '[c,ç]')
               .replace(/o/g, '[o,ó,ö,ò,õ,ô]')
               .replace(/u/g, '[u,ü,ú,ù,û]');
       }

        let paramsName = [];
        paramsName.push({
            $or:[{
                    $or:[{
                        firstName: {
                            $regex:  diacriticSensitiveRegex(query.name.toLowerCase()), $options: "i", 
                        }
                    }]
                },
                {
                    $or:[{
                        lastName: {
                            $regex:  diacriticSensitiveRegex(query.name.toLowerCase()), $options: "i", 
                        }
                    }]
                }
            ]
        });


        search = [
            {
                $lookup: {
                    from: 'customer-users',
                    let: {
                        idCustomerUser: '$$CURRENT.customerUser'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr:{
                                    $and: paramsUser
                                }
                            }
                        },
                    ],
                    as: 'customerUser'
                }
            },
            {
                $unwind:{
                    "path": "$customerUser",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                $match: { 
                    $and: params
                }
            },
            {
                $match:{
                    $and: paramsName
                }
            }
        ]

        if (query.limit!=null && query.skip!=null){
            search.push({
                $facet: {
                    paginatedResults: [{ $skip: query.skip }, { $limit: query.limit }],
                        totalCount: [{
                            $count: 'count'
                        }
                    ]
                }
            });
        }
    
        Collection.aggregate (search)
        .then(obj => {
            fncSuccess(obj);
        }).catch(err => {
            console.log(`caught the error: ${err}`);
            if (`${err.name}` == 'CastError' && `${err.kind}` == 'ObjectId'){
                return fncSuccess(null);
            }
            fncSuccess(err.stack);
        });
    },
};

module.exports = newModule;