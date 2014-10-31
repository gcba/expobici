<?php 
	
/////////////////
//
// Fecha: Octubre 2014
// Proyecto: Ecobici 2014
// Autor: Pili Mayora
//
// Output -> Actualizacion de tablas SQL:
// A los recorridos de 2013, les agrega el valor de distancia en metros
// entre la estacion de origen y la estacion de destino
// (informacion guardada en la tabla estaciones_distancia)
//
/////////////////

// Configuracion de MySQL Database y source del JSON 
include 'config.php';

// Abrir conexion a MySQL y seleccionar base de datos
$link = mysql_connect($host, $username, $password);
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
$db_selected = mysql_select_db('bicicletas', $link);
if (!$db_selected) {
    die ('Can\'t use database : ' . mysql_error());
}	

// Join recorridos y distancias entre estaciones
$query = "SELECT recorridos_bici_2013.recorridoid, estaciones_distancia.distancia 
		  FROM recorridos_bici_2013 
		  INNER JOIN estaciones_distancia 
		  ON recorridos_bici_2013.origenestacion = estaciones_distancia.origen_estacion_id 
		  AND recorridos_bici_2013.destinoestacion = estaciones_distancia.destino_estacion_id"; 

$result = mysql_query($query) or die(mysql_error());

// Para cada recorrido, agregar distancia del recorrido a partir del join anterior
while($row = mysql_fetch_array($result)){
	$update_query = "UPDATE recorridos_bici_2013 SET distanciametros = " . $row['distancia'] . " WHERE recorridoid = " . $row['recorridoid'] . ";";
	$update_result = mysql_query($update_query) or die(mysql_error());
	echo "Agregando distancia al recorrido numero {$row['recorridoid']} \n";					 
}

// Cerrar conexion a MySQL
mysql_close($link);
?>