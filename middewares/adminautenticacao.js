function adminautenticacao( request, response, next ) {
  if (request.session.user !== undefined){
    next();
  }else{
    response.redirect("/login")
  }
}

module.exports = adminautenticacao