$(function(){

  $('#nextQuestion').click(function(){
 	   var fin=false;
       var parametros={answer: $("input[name='answer']:checked").val()};

       	$.post('/next',parametros, function(data){
       		
         	$('#question').html(data[0]);
         	$('#panel1').html(data[1]);
         	$('#appliClauses').html(data[2].join('\n'));
         	$('#providedAnswer').html(data[3].join('\n'));
  
        });
   	  
       	 // $.get('/results',function(data){
       	 //  	$('#h3').html(data);
       	 // });
   		
  });
});
