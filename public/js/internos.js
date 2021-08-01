function confirmarDelecao(event, form) {
  event.preventDefault();
  var decisao = confirm("Deseja realmente deletar este item?")
  if(decisao){
    return form.submit();
  }
}