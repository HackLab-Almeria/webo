//funcion contra el spam
function antispam(cuenta,clase)
{
	var dominio = "hackal.es";
	document.write("<a class='"+ clase +"' href=\"mailto:" + cuenta + "@" + dominio + "\">" + cuenta + "@" + dominio + "</a>");
}