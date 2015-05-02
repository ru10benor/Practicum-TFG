function formulario(f) { 
  var marcado = 'no';
  
  // if(f.param('op_load')){
  //   return true;
  // }

    if (f.nombre.value=='') { 
      alert ('Nombre esta vacío');
      f.nombre.focus();
      return false;
    }
    // else if(f.nombre.size>20) { 
    //   alert ('Nombre demasiado largo');  
    //   f.nombre.focus(); 
    //   return false;
    
    else if (f.apellidos.value=='') { 
      alert ('Apellidos esta vacío'); 
      f.apellidos.focus(); 
      return false;
    
    }else if (f.email.value=='') { 
      alert ('El email esta vacío'); 
      f.email.focus(); 
      return false; 
    }else if(marcado == 'no'){
       for ( var i = 0; i <f.sexo.length; i++ ) {
         if (f.sexo[i].checked) {
           return true;
         }
       }
       alert('Debe marcar su sexo' ) ;
       return false;
    }else
      return true; 

} 

  

