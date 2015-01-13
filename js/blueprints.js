var numJugadores = 3, turno = 0, dadosJugados = 0;
var dadosRestantes = 15;
var materiales = ["cristal", "madera", "reciclado", "piedra"];
var valoresDado = [1,2,3,4,5,6];
//var colores = ["#rojo","#amarillo","#verde", "##269 azul"];
var colores = ["#336699", "#BF2A47","brown","#80C080", "red", "brown", "pink", "silver"];
var planos = [	[2,2,1,1,0,0], [3,1,1,1,0,0], [2,0,2,0,2,0], [1,2,1,0,2,0], 
				[2,3,1,0,0,0], [1,0,3,1,1,0], [2,0,1,1,2,0], [2,2,1,0,1,0], 
				[2,2,2,0,0,0], [2,0,2,1,1,0], [2,1,1,0,2,0], [0,2,1,1,2,0], 
				[0,1,3,1,1,0], [0,2,1,2,1,0], [1,0,3,0,2,0], [2,1,1,2,0,0], 
				[1,1,2,0,2,0], [3,0,1,1,1,0], [0,3,1,1,1,0], [3,0,3,0,0,0], 
				[3,0,1,0,2,0], [3,0,2,0,1,0], [2,1,2,0,1,0], [3,2,1,0,0,0], 
			];

$(document).on("ready", main);

function main(){
	$("#iniciarJuego").on("click", iniciarJuego);
	//iniciarJuego();
	//$("#siguienteJugador").on("click", siguienteJugador);
	//$(".mostrarPlano").on("click", mostrarPlanos);
}
function mostrarPlanos(){
	$(".carta").hide();
	$(".plano").show();
	$(".jugador:nth-child("+(turno+1)+")").show();
}

function mostrarCartas(){

}

function iniciarJuego(){
	$(".container").addClass("volteado");
	sacarDadosDesempate();
	sacarPrimerosDados();
	dibujarPlanos();
	mostrarPlanos();
	//$(".plano").hide();
	poderArrastrarElementos();
	//ordenar();
	//hacerInteractuable();	
	//$(".jugador").hide();
	//$(".jugador:nth-child("+(turno+1)+")").show();
}

function siguienteJugador(){
	if (turno < numJugadores - 1)
		{turno++;}
	else
		{turno = 0;}
	
	//$(".jugador").hide();
	//$(".jugador:nth-child("+(turno+1)+")").fadeIn();
	sacarYDibujarDado("#dados-seleccionables");
	hacerDadosArrastrables();
}

function sacarDadosDesempate(){
	var dado1, dado2;
	dado1 = sacarNuevoDado();
	dado2 = sacarNuevoDado();

	while(dado1[0] == dado2[0]){
		dado2 = sacarNuevoDado();
	}
	dadosRestantes -= 2;
	dibujarDado(dado1, "#dados-desempate");
	dibujarDado(dado2, "#dados-desempate");
}

function sacarPrimerosDados(){
	var contador = 0, primerosDados;

	switch(numJugadores){
		case 2: primerosDados = 8; break;
		case 3: primerosDados = 9; break;
		case 4: primerosDados = 7; break;
		case 5: primerosDados = 10; break;
		case 5: primerosDados = 11; break;
		case 7: primerosDados = 12; break;
	}

	while (contador < primerosDados){
		sacarYDibujarDado("#dados-seleccionables");
		contador++;
	}
	dadosRestantes -= contador;
}

function dibujarPlanos(){

	for (var planosDibujados = 0; planosDibujados < numJugadores; planosDibujados++) {
	var plano, numPlano = getNumeroAleatorio(0, planos.length - 1);

		plano = '<section id="jugador'+(planosDibujados+1)+' " class="jugador">';
			//CARA, SIN CASILLAS
			plano += '<div class="carta"><label>Jugador '+(planosDibujados+1)+' - Plano '+numPlano+'</label><button id="voltear-jugador'+(planosDibujados+1)+'" class="mostrarPlano">Voltear</button>--nbsp-</div>';
			//REVERSO, CON CASILLAS
			plano += '<div id=plano'+numPlano+' class="carta plano"><div class="casillas-plano">';
			for (var casilla = 0; casilla < planos[numPlano].length; casilla++) {
				if(planos[numPlano][casilla] === 0){
					plano += '<div class="casilla casilla-bloqueada"></div>';}
				else{
					plano += '<div class="casilla casilla-disponible"> <div class="dados-requeridos">'+planos[numPlano][casilla]+'</div></div>';}
			}
		plano += '</div><div class="plano-por-hacer oculto">';
			for (var i = 0; i < planos[numPlano].length; i++) {
				if(planos[numPlano][i] === 0){
					plano += '<div class="casilla casilla-bloqueada"></div>';}
				else{
					plano += '<div class="casilla casilla-disponible">';
						for (var j = 0; j < planos[numPlano][i]; j++) {
							plano+='<div class="ideal casilla-bloqueada">'+(planos[numPlano][i]- j)+'</div>';
							//plano+= '<div class="top ideal">'+(planos[numPlano][i]- j)+'</div><div class="left ideal">'+(planos[numPlano][i]- j)+'</div><div class="right ideal">'+(planos[numPlano][i]- j)+'</div>';
						}

					plano+= '</div>';
				}
			}
		plano += '</div></div></section>';
		$('#tablero').append(plano);
	}

	$('#tablero .plano').each(function(indice, plano) {
		$(plano).css("background-color", colores[indice]);
	});

}

function sacarYDibujarDado(lugar){
	dibujarDado(sacarNuevoDado(), lugar);
}

function cambiarColorFondo(){
	$(".plano").css("background-color", colores[turno]);
}

function sacarNuevoDado(){
	var material = materiales[getNumeroAleatorio(0, materiales.length - 1)];
	var valor = valoresDado[getNumeroAleatorio(0, valoresDado.length - 1)];
	var dado = [material, valor];
	return dado;
}

function dibujarDado(dadoADibujar, lugar){
	var dadoDibujar = '<div id="dado'+dadosJugados+'" class="dado" draggable="true">';
		dadoDibujar += '<div class="top '+dadoADibujar[0]+'">'+ dadoADibujar[1]+'</div><div class="left '+dadoADibujar[0]+'">'+ dadoADibujar[1]+'</div><div class="right '+dadoADibujar[0]+'">'+ dadoADibujar[1]+'</div>';
	dadoDibujar += '</div>';
	$(lugar).append(dadoDibujar);
	//dadoDibujar.insertAfter("#prim");
	parpadear("#dado"+dadosJugados);
	dadosJugados++;
	//if (lugar == "#dados-seleccionables")
	//ordenar($("#dado"+dadosJugados));
}

function ordenar(dadoOrdenar){
    $('#dados-seleccionables .dado').each(function(indice, dadoArray) {
		alert(dadoOrdenar.attr("class"));
		if(parseInt(dadoOrdenar.text()) < $(dadoArray).text()){
			alert("El dado de "+dadoOrdenar.attr("class")+" con valor "+dadoOrdenar.text()+" es menor que el dado de "+$(dadoArray).attr("class")+" con valor "+$(dadoArray).text());
	    	dadoOrdenar.insertBefore($(dadoArray));
	    	parpadear(dadoOrdenar);
    	}
    		/*
				else{
    			alert("El dado de "+dadoOrdenar.attr("class")+" con valor "+dadoOrdenar.text()+" no es menor que el dado de "+$(dadoArray).attr("class")+" con valor "+$(dadoArray).text());
    			dadoOrdenar.insertAfter($(dadoArray));
    			 
		    	//indice = dadoOrdenar.text();
    		}
    		*/
    	

		//alert('El dado con el índice '+indice+' contiene '+$(dadoArray).text());
	});
}
function parpadear(objeto){
	$(objeto).fadeOut(150);
	$(objeto).fadeIn(150);
	$(objeto).fadeOut(150);
	$(objeto).fadeIn(150);
	$(objeto).fadeOut(150);
	$(objeto).fadeIn(150);
}
function getNumeroAleatorio(valorMinimo, valorMaximo){
    return Math.floor(Math.random() * (valorMaximo - valorMinimo + 1)) + valorMinimo;
}


//______________________________________________________________________________________
	// Valores iniciales de objetos
	var objArrastrado, objContenedor = null;

	function hacerDadosArrastrables(){
		var dados = $('#dados-seleccionables').find('.dado');
		[].forEach.call(dados, function(e) {
			e.addEventListener('dragstart', arrastreIniciado, false);
			e.addEventListener('dragend', arrastreFinalizado, false);
		});
	}

	function poderArrastrarElementos(){
		// Eventos para el objeto arrastrable
		hacerDadosArrastrables();

		// Eventos para el panel origen
		/*

		var bolsa = $('#dados-seleccionables');
		[].forEach.call(bolsa, function(e) {
			e.addEventListener('dragenter', arrastreEntrando, false);
			e.addEventListener('dragover', arrastreSobre, false);
			e.addEventListener('drop', arrastreSoltado, false);
			e.addEventListener('dragleave', arrastreSaliendo, false);
		});
		*/

		// Eventos para el panel destino
		var casillasDisponibles = $('.casillas-plano').find('.casilla-disponible');
		[].forEach.call(casillasDisponibles, function(e) {
			e.addEventListener('dragenter', arrastreEntrando, false);
			e.addEventListener('dragover', arrastreSobre, false);
			e.addEventListener('drop', arrastreSoltado, false);
			e.addEventListener('dragleave', arrastreSaliendo, false);
		});
	}

	/* El objeto 'comienza' a ser arrastrado */
	function arrastreIniciado(e) {

		// Guardamos el objeto que es arrastrado
		objArrastrado = this;
		
		// Establecemos la operacion que se va a poder realizar
		e.dataTransfer.effectAllowed = 'move';
		// Establecemos el dato y su tipo
		e.dataTransfer.setData('Data', this);
		// Centramos el objeto al cogerlo en las coord. x e y
//e.dataTransfer.setDragImage(this, 50, 50);

		// Resaltamos el objeto arrastrado
		$(objArrastrado).css('border', '2px dashed');
		$(".casillas-plano .casilla-disponible").addClass("animada");

		// Creamos un elemento 'img' para añadir una imagen fantasma
		//var dragIcon = document.createElement('img');
		//dragIcon.src = "http://pilas.readthedocs.org/en/latest/_images/explosion.png";
		//dragIcon.width = 10;
		//e.dataTransfer.setDragImage(dragIcon, 35, 35);
	}

	/* Estamos 'entrando' en el area donde se puede dejar un objeto arrastrable */
	function arrastreEntrando(e) {

		// Ocultamos el objeto que se queda estatico
//$(objArrastrado).css('visibility', 'hidden');

		// Cambiamos el contorno y fondo del contenedor
		$(this).css({
			'background-color': 'rgba(123, 51, 242, 0.5)',
			'border-style': 'dashed'
		});
	}

	/* Situados 'encima' del area donde se puede dejar un objeto arrastrable */
	function arrastreSobre(e) {
		// Obtenemos el valor objeto del contenedor sobre el que se posa el objeto arrastrable
		objContenedor = this;

		// El cursor del navegador indica el tipo de operación que se va a realizar
		e.dataTransfer.dropEffect = 'move';

		// Necesario para dejar caer el objeto arrastrado
		if(e.preventDefault)
			e.preventDefault();
	}

	var exito = false;
	/* Estamos 'soltando' un objeto arrastrable */
	function arrastreSoltado(e) {

		// Agregamos el objeto 'arrastrable' en el contenedor actual
		if(this){
			$(this).prepend(objArrastrado);
			exito = true;
		}

		// Necesario para evitar el redireccionamiento de navegadores
		if(e.stopPropagation)
			e.stopPropagation();

		// Restauramos el contorno del objeto y el color de fondo del contenedor
		$(this).css({
			'background-color': '',
			'border-style': 'solid'
		});
	}

	/* Estamos 'saliendo' del area donde se puede dejar un objeto arrastrable */
	function arrastreSaliendo(e) {

		// Cambiamos el fondo del objeto contenedor
		$(this).css({
			'background-color': '',
			'border-style': 'solid'
		});
	}

	/* El objeto 'termina' de ser arrastrado */
	function arrastreFinalizado(e) {/*
		// Si no hay elemento en el contenedor mostramos el texto
		if($("#destino div").length === 0)
			$("#destino").append('<p>DRAG&DROP</p>');

		// Si no hay elemento en el contenedor mostramos el texto
		if($("#origen div").length === 0)
			$("#origen").append('<p>DRAG&DROP</p>');
		*/
		// Reseteamos valores modificados para inicializarlos 
		$(this).css({
			'background-color': '',
			'border-style': 'solid'
		});

		// Mostramos el objeto arrastrado previamente ocultado
		$(".casillas-plano .casilla-disponible").removeClass("animada");
		//alert(this);
		//$(".casillas-plano .casilla-disponible .dado").css("color", "red");
		if(exito){
			siguienteJugador();
			$(this).attr("draggable", "false");
			exito = false;
		}
		objArrastrado = null;
		objContenedor = null;
		//sacarYDibujarDado("#dados-seleccionables");
//$(objArrastrado).css('visibility', 'visible');

	}
//______________________________________________________________________________________

function hacerInteractuable(){
	interact('.casilla-disponible')
    // enable draggables to be dropped into this
    .dropzone(true)
    // only accept elements matching this CSS selector
    .accept('.dado')
    // listen for drop related events
    .on('dragenter', function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
        //draggableElement.textContent = 'Dragged in';
    })
    .on('dragleave', function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        //event.relatedTarget.textContent = 'Dragged out';
    })
    .on('drop', function (event) {
        event.relatedTarget.classList.remove('can-drop');
        //event.relatedTarget.textContent = 'Dropped';
    });

    interact('.dado')
    .draggable({
        onmove: function (event) {
            var target = event.target;

            target.x = (target.x|0) + event.dx;
            target.y = (target.y|0) + event.dy;

            target.style.webkitTransform = target.style.transform =
                'translate(' + target.x + 'px, ' + target.y + 'px)';
        }
    })
    .inertia(true).restrict({ drag: '.casilla-disponible', endOnly: true });
}