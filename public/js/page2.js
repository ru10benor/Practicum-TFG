$(function(){

  $('#nextQuestion').click(function(){
 	   var fin=false;
       var parametros={answer: $("input[name='answer']:checked").val()};

       	$.post('/next',parametros, function(data){
       		
          if(data!='You have completed the evaluation'){
         	  $('#question').html(data[0]);
         	  $('#panel1').html(data[1]);
         	  $('#appliClauses').html(data[2].join('\n'));
         	  $('#providedAnswer').html(data[3].join('\n'));
          }else{
            $('#labelQuestion').text('Message:');
            $('#question').html(data);
            $('#showResults').show(); //mostrar boton de resultados
            $('#nextQuestion').hide(); //ocultar boton nextquestion
            $('#panel2').hide(); //ocultar boton de ayuda
            $('#switch').hide(); //ocultar switch answer
            $('#labelAnswer').hide(); //ocultar el label answer
          }
        });
  });
  $('#showResults').click(function(){
      $.get('/results');
  });
});
