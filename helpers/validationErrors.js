module.exports = {
  parseErrorMessages: function (errors) {
    return errors.reduce((errObj, err) => {
      errObj[err.path[0]] = err.message;
      return errObj;
    }, {});
  },
};
