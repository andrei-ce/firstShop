module.exports = (err, next) => {
  const sentError = new Error(err);
  sentError.httpStatusCode = 500;
  //this calls a special middleware in express (app.use((error,res,req,next)=>{}))
  return next(sentError);
};
