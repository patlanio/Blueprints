function Jugador(nombre, turno){
	this.nombre = nombre;
	this.turno = turno;
	this.plano;
}

function Dado(m, n){
	this.valor = m;
	this.material = n;
}

Dado.prototype.materialAleatorio = function(){
	return "madera";
};

function BolsaDados(numDados){

	this.dados[];

	for (var contador = 0; contador < numDados; contador++){
		this.dados[contador] = new Dado();
	}
}