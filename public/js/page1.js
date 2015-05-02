$('#submit').click(function() {

            $.ajax({
                url: "/page1",
                type: "POST",
                dataType: "json",
                data: {
                    name: $('#name').val(),
                    description: $('#description').val(),
                },
                contentType: "application/json",
                cache: false,
                timeout: 5000,
                complete: function() {
                  //called when complete
                  console.log('process complete');
                },

                success: function(data) {
                  console.log(data);
                  console.log('process sucess');
               },

                error: function() {
                  console.log('process error');
                },
              });
        })

 $('#submit').on('click',function(){
       $.get('/next', function(data) {
       $('#currentQuestion').html(data);
     });
 });
});

//var aux = require('./app.js'); //no funciona esto

function prueba2(p){

  question = document.getElementById('question');
  question.innerHTML = 'Does the ICT have closed functionality?';

/*  appliClauses = document.getElementById('appliClauses');
  var cla = document.createElement('option')
  cla.innerHTML = aux.prueba[0]
  appliClauses.appendChild(cla)*/

  //providedAns = document.getElementById("providedAns");
  //providedAns.innerHTML = "<option>Modified value</option>";
  
  var min = 12,
    max = 100,
    select1 = document.getElementById("providedAns"),
    select2 = document.getElementById("appliClauses");

for (var i = 0; i<=9; i++){
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = "algo"+i;
    select1.appendChild(opt);
}

for (var i = 0; i<=9; i++){
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = "algo";
    select2.appendChild(opt);
}

}