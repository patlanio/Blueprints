var numJugadores = 1, turno = 0, ronda = 0, dadosJugados = 0;
var cristal = 8, madera = cristal, reciclado = cristal, piedra = cristal;
var dadosRestantes = cristal + madera + reciclado + piedra;
var materiales = ["cristal", "madera", "reciclado", "piedra"];
var valoresDado = [1,2,3,4,5,6];
var colores = ["#336699", "#BF2A47","#80C080", "#E8DA53", "brown", "pink", "silver"];
var planos = [	[2,2,1,1,0,0], [3,1,1,1,0,0], [2,0,2,0,2,0], [1,2,1,0,2,0], [2,3,1,0,0,0], [1,0,3,1,1,0], 
				[2,0,1,1,2,0], [2,2,1,0,1,0], [2,2,2,0,0,0], [2,0,2,1,1,0], [2,1,1,0,2,0], [0,2,1,1,2,0], 
				[0,1,3,1,1,0], [0,2,1,2,1,0], [1,0,3,0,2,0], [2,1,1,2,0,0], [1,1,2,0,2,0], [3,0,1,1,1,0], 
				[0,3,1,1,1,0], [3,0,3,0,0,0], [3,0,1,0,2,0], [3,0,2,0,1,0], [2,1,2,0,1,0], [3,2,1,0,0,0],];

var fueSoltadoEnCasilla = false;
var dadoArrastrado, casillaContenedora = null;

function nuevaConstruccion(){
	var construccion;
	for (var z = 0; z < 6; z++) {
		for (var y = 0; y < 3; y++) {
			for (var x = 0; x < 2; x++) {
				construccion[x][y][z] = ["fantasma"][0];
			}
		}		
	}
	return construccion;
}
$(document).on("ready", main);

function main(){
	$(".iniciar-juego").on("click", asignarNumeroJugadores);
	$(".ver-reglas").on("click", verReglas);
	$(".girar").mouseenter(girar).mouseleave(pausarGiro);
	$(".pantalla").hide();
	$(".principal").show();
	//asignarNumeroJugadores();
}
function iniciarJuego(){
	sacarDadosDesempate();
	sacarPrimerosDados();
	dibujarPlanos(".tablero");
	activarDnD();
	mostrarSoloUnJugador();
}
function asignarNumeroJugadores(){
	switch($(this).text()){
		case "2 Jugadores": numJugadores = 2; break;
		case "3 Jugadores": numJugadores = 3; break;
		case "4 Jugadores": numJugadores = 4; break;
		default: numJugadores = 4;
	}
	$(".principal").hide();
	iniciarJuego();
	$(".juego").fadeIn("slow");
}
function sacarDadosDesempate(){
	var dado1, dado2;
	dado1 = sacarNuevoDado();
	dado2 = sacarNuevoDado();

	while(dado1[0] == dado2[0]){
		dado2 = sacarNuevoDado("desempate");
		//alert("Hubo empate");
	}
	//dadosRestantes -= 2;
	dibujarDado(dado1, ".desempate");
	dibujarDado(dado2, ".desempate");
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
		sacarYDibujarDado(".bolsa");
		contador++;
	}
	//dadosRestantes -= contador;
}
function dibujarPlanos(lugar){
	for (var planosDibujados = 1; planosDibujados <= numJugadores; planosDibujados++) {
		var plano, numPlano = getNumeroAleatorio(0, planos.length - 1);

		plano = '<section id="jugador'+planosDibujados+' " class="jugador girable">'+
					'<div id=plano'+(planosDibujados+ronda*numJugadores)+' class="plano">';
						for (var casilla = 0; casilla < planos[numPlano].length; casilla++) {
							if(planos[numPlano][casilla] === 0){
								plano += '<div class="casilla bloqueada">&nbsp</div>';}
							else{
								plano += '<div id="algo'+(planosDibujados+ronda*numJugadores)+'" class="casilla disponible"><div class="dados-requeridos">'+planos[numPlano][casilla]+'</div></div>';}
								for (var j = 0; j < planos[numPlano][planosDibujados]; j++) {
									//sacarYDibujarDado("#jugador"+planosDibujados+".disponible:nth-child("+j+")");
									//sacarYDibujarDado(".disponible:nth-child("+(planosDibujados-1)+")");
									//alert($(".disponible:nth-child("+(planosDibujados-1)+")").parent().attr("id"));
								}
						}
		plano += '</div></section>';
		$(lugar).append(plano);
	}

	$('.tablero .plano').each(function(indice, plano) {
		$(plano).css("background-color", colores[indice]);
	});
}
function siguienteJugador(){
	if($(".dado").length >= cristal+madera+reciclado+piedra){
		alert("Se acabo el juego");
		$(".dado").attr("draggable", "false");
		$(".juego").fadeOut();
		$("body").css("background-color", colores[0]);
		$(".premiacion").fadeIn();
		calcularPuntuaciones();
	}else{
		if (turno < numJugadores - 1)
			{turno++;}
		else
			{turno = 0;}
		mostrarSoloUnJugador();
		//$(".jugador").hide();
		sacarYDibujarDado(".bolsa");
		hacerDadosArrastrables();
	}
}
function calcularPuntuaciones(){
	for(var numJugador=0; numJugador < numJugadores; numJugador++){
		calcularPuntosCristal("#jugador"+numJugador);
		calcularPuntosMadera("#jugador"+numJugador);
		calcularPuntosReciclado("#jugador"+numJugador);
		calcularPuntosPiedra("#jugador"+numJugador);
	}
}
function calcularPuntosCristal(jugador){
	alert(jugador+"Puntuacion cristal");
}
function calcularPuntosMadera(jugador){
	alert(jugador+"Puntuacion Madera");
}
function calcularPuntosReciclado(jugador){
	alert(jugador+"Puntuacion Reciclado");
}
function calcularPuntosPiedra(jugador){
	alert(jugador+"Puntuacion Piedra");
}
function mostrarSoloUnJugador(){
	$("body").css("background-color", colores[turno]);
	$(".jugador").hide();
	//alert("Es turno del jugador"+(turno+1));
	$(".jugador:nth-child("+(turno+1)+")").fadeIn("slow");
}
function dibujarDado(dado, lugar){
	var nuevoDado ='<div id="dado'+dadosJugados+'" class="dado '+dado[0]+'" draggable="true">'+
						'<div class="cubo">'+
							'<div class="cara-top"><div class="'+dado[0]+'">'+dado[1]+'</div></div>'+
							'<div class="cara-der '+dado[0]+'">'+ dado[1]+'</div>'+
							'<div class="cara-izq '+dado[0]+'">'+ dado[1]+'</div>'+
						'</div>'+
					'</div>';
	$(lugar).append(nuevoDado);
	hacerDadosArrastrables();
	parpadear("#dado"+dadosJugados);
	dadosJugados++;
}
function sacarNuevoDado(especial){
	var material = materiales[getNumeroAleatorio(0, materiales.length - 1)];
	var valor = valoresDado[getNumeroAleatorio(0, valoresDado.length - 1)];
	var dado = [material, valor];

	if(!especial){
		dadosRestantes--;
	}else{
		if (especial == "desempate"){
			//alert("desempate");
		}else{
			//alert("fantasma")
			//dado = ["fantasma", null];
		}
	}

	$(".opciones label").html("Quedan: "+dadosRestantes);
	return dado;
}
function parpadear(objeto){
	$(objeto).fadeOut(150);
	$(objeto).fadeIn(150);
	$(objeto).fadeOut(150);
	$(objeto).fadeIn(150);
	$(objeto).fadeOut(150);
	$(objeto).fadeIn(150);
}
function sacarYDibujarDado(lugar){dibujarDado(sacarNuevoDado(), lugar);}
function getNumeroAleatorio(valorMinimo, valorMaximo){return Math.floor(Math.random() * (valorMaximo - valorMinimo + 1)) + valorMinimo;}
function verReglas(){
	//alert($(this).parents().class("pantalla"));
	$(".pantalla").hide();
	$(".reglas").fadeIn("slow");
}
function pausarGiro(){
	$(".jugador").css("animation-play-state", "paused");
}
function girar(){
	$(".jugador").css("animation-play-state", "running");
}
//FUNCIONES DRAG & DROP_____________________________________
function activarDnD(){
	hacerDadosArrastrables();
	hacerCasillasContenedoras();
	/*var bolsa = $('.bolsa');		//Eventos para el panel origen
	[].forEach.call(bolsa, function(e) {
		e.addEventListener('dragenter', arrastreEntrando, false);
		e.addEventListener('dragover', arrastreSobre, false);
		e.addEventListener('drop', arrastreSoltado, false);
		e.addEventListener('dragleave', arrastreSaliendo, false);
	});	*/
}
function hacerDadosArrastrables(){
	var dados = $('.bolsa').find('.dado');		
	[].forEach.call(dados, function(e) {
		e.addEventListener('dragstart', arrastreIniciado, false);
		e.addEventListener('dragend', arrastreFinalizado, false);
	});
}
function hacerCasillasContenedoras(){
	// Eventos para el panel destino
	var casillasDisponibles = $('.plano').find('.casilla.disponible');
	[].forEach.call(casillasDisponibles, function(e) {
		e.addEventListener('dragenter', arrastreEntrando, false);
		e.addEventListener('dragover', arrastreSobre, false);
		e.addEventListener('drop', arrastreSoltado, false);
		e.addEventListener('dragleave', arrastreSaliendo, false);
	});
}
function arrastreIniciado(e){
	dadoArrastrado = this;					// Guardamos el objeto que es arrastrado
	e.dataTransfer.effectAllowed = 'move';	// Establecemos la operacion que se va a poder realizar
	e.dataTransfer.setData('Data', this);	// Establecemos el dato y su tipo
	$(".casilla.disponible").addClass("animada");
}
function arrastreSoltado(e){
	if(this){
		$(this).prepend(dadoArrastrado);
		fueSoltadoEnCasilla = true;
		//alert($(this).parents().attr("id"));
		//if(lugar == );
	}
	if(e.stopPropagation){e.stopPropagation();}		// Necesario para evitar el redireccionamiento de navegadores
	$(this).removeClass("zonaContenedora");	// Restauramos el contorno del objeto y el color de fondo del contenedor
}
function arrastreFinalizado(e){
	//alert("Juego Finalizado"+$(".bolsa.dado").length); //$("#origen").append('<p>DRAG&DROP</p>');
	$(this).removeClass("zonaContenedora");
	$(dadoArrastrado).css('visibility', 'visible'); // Ocultamos el objeto que se queda estatico

	$(".casilla.disponible").removeClass("animada");
	if(fueSoltadoEnCasilla){
		siguienteJugador();
		$(this).attr("draggable", "false");
		fueSoltadoEnCasilla = false;
	}
	dadoArrastrado = null;
	casillaContenedora = null;
}
function arrastreEntrando(e){
	$(dadoArrastrado).css('visibility', 'hidden'); // Ocultamos el objeto que se queda estatico
	$(this).addClass("zonaContenedora");
}
function arrastreSaliendo(e) {
	$(dadoArrastrado).css('visibility', 'visible');
	$(this).removeClass("zonaContenedora");
}
function arrastreSobre(e){
	casillaContenedora = this;					// Obtenemos el valor objeto del contenedor sobre el que se posa el objeto arrastrable
	e.dataTransfer.dropEffect = 'move';			// El cursor del navegador indica el tipo de operación que se va a realizar
	if(e.preventDefault){e.preventDefault();}	// Necesario para dejar caer el objeto arrastrado
}