db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {

      console.log('erro na persistencia');
    } else if (err.code == 'unimplemented') {

      console.log('persistencia não implementada');
    }
  });


