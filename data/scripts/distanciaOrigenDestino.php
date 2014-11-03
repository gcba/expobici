<?php 

////////////////
//
// Fecha: Octubre 2014
// Proyecto: Expo Bici 2014
// Autor: Pili Mayora
// 
// Output -> Actualizacion de tablas SQL:
// Modifica recorridos de 2010 a 2014.
// Si la estacion de origen y la estacion de destino son las mismas,
// Calcula la distancia en base a la velocidad promedio y el tiempo.
//
////////////////

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

$anios_bici = array ('2010', '2011', '2012', '2013', '2014');

foreach ($anios_bici as $anio) {
	// Calcular velocidad promedio
	$query_avg = "SELECT AVG(`distanciametros`/(`tiempouso`/60)) AS average FROM `recorridos_bici_{$anio}`";
	$result = mysql_query($query_avg) or die(mysql_error());
	$avg = mysql_fetch_array($result);
	echo "Velocidad promedio en metros/hora en {$anio} es {$avg['average']} \n";

	// Actualizar distancias usando: velocidad promedio * tiempo
	$update_query = "UPDATE recorridos_bici_{$anio} SET distanciametros = (tiempouso/60)*{$avg['average']} WHERE origenestacion = destinoestacion";
	$update_result = mysql_query($update_query) or die(mysql_error());
	echo "Agregamos distancia a los recorridos del {$anio} que arrancan y terminan en la misma estacion \n";					 
}

// Cerrar conexion a MySQL
mysql_close($link);
?>