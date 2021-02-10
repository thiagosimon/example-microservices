const bcrypt = require("bcryptjs");
const crud = require("hp-crud-ioasys");
const mapType = require("../helpers/map-types");
const jwt = require("jsonwebtoken");
const configAuth = require("../config/auth");

let fileName = "SystemUsers",
  collectionName = "system-users",
  primaryKey = ["_id"],
  excludedKeys = ["password", "__v"];

  var newModule = {
    saveOrUpdate: (editing, req, fncResult) => {
      if (!isDbConnected) return fncResult(instantiateMessage(500, "response.msg.error.database.connection"));
      let errors = checkFields(req.body, editing); 

      if (errors.length > 0){
          const msg = instantiateMessage(400, "response.msg.error.empty.fields");
          msg.errors = errors;
          return fncResult(msg);
      }
      if (req.body.password == null){
          delete req.body.password;
      }

      if(req.body.primaryPhone){
          req.body.primaryPhone = req.body.primaryPhone.replace(/\(/g, '').replace(/\)/g, '').replace(/\-/g, '').replace(/\ /g, '');
      }
      
      if(!req.body.email || (req.body.email && req.body.email.length ==0) ){
          if(req.body.type == 'USER-CUSTOMER'){
              req.body.email = req.body.primaryPhone;
          }
      }

      if (req.body.password && req.body.password!=null){
          bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.password, salt, (err, hash) => {
                  if (err) {
                      console.log(err);
                      const msg = instantiateMessage(500, "response.msg.error.generic");
                      msg.type = 'bcrypt';
                      msg.systemError = err.stack;
                      return fncResult(msg);
                  };

                  req.body.password = hash;
                  saveupdate();
              });
          });
      }else{
          saveupdate();
      }
      function saveupdate(){
          crud.setCollection(fileName, collectionName, primaryKey, excludedKeys);
          if (editing){

              crud.generic.getByPK(req, false, (responseUser) => {
                  save(responseUser.result);
              });
          }else{
              save();
          }

          function save(systemUser){
              if (req.body.type == mapType.customer){

                  let element = {
                      body: req.body.customerUser,
                      params: editing ? {_id: systemUser.customerUser} : req.params
                  }
                 
                  crud.setCollection("CustomerUsers", "customer-users", ["_id"], ["__v"]);
                  insert(element, editing, (responseCustomer)=>{
                      if (responseCustomer.status != 200){
                          return fncResult(responseCustomer);
                      }
                      req.body.customerUser = responseCustomer.result._id;
                      crud.setCollection(fileName, collectionName, primaryKey, excludedKeys);
                      crud.generic.saveOrUpdate(editing, req, (response, error)=>{
                          if (response.status != 200){
                              crud.setCollection("CustomerUsers", "customer-users", ["_id"], ["__v"]);

                              crud.generic.delete({params: {_id:responseCustomer.result._id}}, (responseDelete) => {
                                  return fncResult(response);
                              });
                          }
                          return fncResult(response);
                      });
                  });
              }
          }
      }
  },
    archive: (req, fncResult) => {
        crud.setCollection(fileName, collectionName, primaryKey, excludedKeys);
        if (!isDbConnected) return fncResult(instantiateMessage(500, "response.msg.error.database.connection"));
        crud.generic.archive(req, (response) => {
            if (response && response.status==200){
                if (response.result.type == mapType.customer){//Company User
                    let element = {
                        params: {_id: response.result.customerUser}
                    }
                    crud.setCollection("CustomerUsers", "customer-users", ["_id"], []);
                    crud.generic.archive(element, () => {
                        return fncResult(response);
                    },(error)=>{
                        return fncResult(error);
                    });
                }
            }else {
                return fncResult(response);
            }
        });
    },
    delete: (req, fncResult) => {
        crud.setCollection(fileName, collectionName, primaryKey, excludedKeys);
        if (!isDbConnected) return fncResult(instantiateMessage(500, "response.msg.error.database.connection"));
        crud.generic.delete(req, (response) => {
            if (response && response.status==200){
                if (response.result.type == mapType.customer){//Company User
                    let element = {
                        params: {_id: response.result.customerUser}
                    }
                    crud.setCollection("CustomerUsers", "customer-users", ["_id"], []);
                    crud.generic.delete(element, () => {
                        return fncResult(response);
                    },(error)=>{
                        return fncResult(error);
                    });
                }
            }else {
                return fncResult(response);
            }
        });
    },
    listAll: (req, fncResult) => {
        crud.setCollection(fileName, collectionName, primaryKey, excludedKeys);
        if (!isDbConnected) return fncResult(instantiateMessage(500, "response.msg.error.database.connection"));
        crud.systemuser.listAll((result)=>{
            fncResult(result);
        });
    },
    listAllByType: (req, fncResult) => {
        crud.setCollection(fileName, collectionName, primaryKey, excludedKeys);
        if (!isDbConnected) return fncResult(instantiateMessage(500, "response.msg.error.database.connection"));
        crud.systemuser.listAllByType(req.body, (result)=>{
            fncResult(result);
        });
    },
    getByEmail: (req, fncResult) => {
        crud.setCollection(fileName, collectionName, primaryKey, excludedKeys);
        if (!isDbConnected) return fncResult(instantiateMessage(500, "response.msg.error.database.connection"));
        crud.systemuser.findByEmail({email: req.params.email}, ["password"], (response) => {
            fncResult(response);
        });
    },
    login: (req, fncResult) => {
      crud.setCollection(fileName, collectionName, primaryKey, [excludedKeys]);
      if (!isDbConnected)
        return fncResult(
          instantiateMessage(500, "response.msg.error.database.connection")
        );

      req.body.email = req.body.email.toLowerCase();
      crud.systemuser.findByEmail(
        req.body,
        [],
        response => {
          if (!response || response.status != 200 || !req.body.password) {
            return fncResult(
              instantiateMessage(500, "response.user.password.incorrect")
            );
          } else {
            bcrypt.compare(
              req.body.password,
              response.result.password,
              (err, isMatch) => {
                if (err) {
                  console.log(err);
                  return fncResult(
                    instantiateMessage(500, "response.user.password.incorrect")
                  );
                }

                if (isMatch) {
                  let copy = JSON.parse(JSON.stringify(response.result));
                  delete copy["password"];
                  const msg = instantiateMessage(200, "response.msg.success");

                  var token = jwt.sign(
                    {
                      user: copy
                    },
                    configAuth.secret,
                    {
                      expiresIn: "150 days"
                    }
                  );

                  msg.token = token;
                  msg.result = copy;

                  return fncResult(msg);
                } else {
                  return fncResult(
                    instantiateMessage(500, "response.user.password.incorrect")
                  );
                }
              }
            );
          }
        },
        error => {
          console.log(error);
          const msg = instantiateMessage(500, "response.msg.error.generic");
          msg.systemError = error;
          return fncResult(msg);
        }
      );
    },
    getUserLogged: (req, fncResult) => {
      crud.setCollection(fileName, collectionName, primaryKey, excludedKeys);
      if (!isDbConnected)
        return fncResult(
          instantiateMessage(500, "response.msg.error.database.connection")
        );

      let userlogged = JSON.parse(req.headers["jwtdecoded"]);
      if (!userlogged) {
        return fncResult(instantiateMessage(401, "response.invalid.token"));
      }

      crud.systemuser.findByEmail({  email: userlogged.user.email },["password"], (response) => {
        fncResult(response);
      });
    },
    update: (req, fncResult) => {
      crud.setCollection(fileName, collectionName, primaryKey, excludedKeys);
      if (!isDbConnected)
        return fncResult(
          instantiateMessage(500, "response.msg.error.database.connection")
        );

      crud.generic.update(req, (result, error) => {
        return fncResult(result);
      });
    }
};

const checkFields = (element, isEdit) => {
  let errors = [];

  if (!element.firstName || element.firstName.length == 0) {
    let str = "response.user.register.firstname.required";
    errors.push({ id: str, text: msgI18n(str) });
  }

  if (!element.lastName || element.lastName.length == 0) {
    let str = "response.user.register.lastname.required";
    errors.push({ id: str, text: msgI18n(str) });
  }

  
  if ( !isEdit && (!element.password || element.password.length < 5)) {
    let str = "response.user.register.password.required";
    errors.push({ id: str, text: msgI18n(str) });
  }

  if (!element.customerUser) {
    let str = "response.user.register.customerUser.required";
    errors.push({ id: str, text: msgI18n(str) });
  }

  if (!element.type || element.type.length == 0) {
    let str = "response.user.register.type.required";
    errors.push({ id: str, text: msgI18n(str) });
  } 

  return errors;
};

const insert = (req, editing, fncResult) => {
  req.body.type = mapType[req.body.type];
  crud.generic.saveOrUpdate(editing, req, (response2, error) => {
    if (!error) {
      fncResult(response2);
    } else {
      console.log(error);
      const msg = instantiateMessage(500, "response.msg.error.generic");
      msg.systemError = error.stack;
      fncResult(msg);
    }
  });
};

const update = (req, fncResult) => {
  req.body.type = mapType[req.body.type];
  crud.generic.update(req, (response2, error) => {
    if (!error) {
      fncResult(response2);
    } else {
      const msg = instantiateMessage(500, "response.msg.error.generic");
      msg.systemError = error;
      fncResult(msg);
    }
  });
};

module.exports = newModule;