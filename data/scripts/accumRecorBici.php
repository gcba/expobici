<?php 

////////////////
//
// Fecha: Noviembre 2014
// Proyecto: Expo Bici 2014
// Autor: Pili Mayora
// 
// Output -> Archivo CSV con cantidad de viajes por mes
// Cuenta los viajes por mes
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

$anios_bici = array('2010', '2011', '2012', '2013', '2014');
$meses = array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');

// Crear archivo CSV para acumular los km recorridos por mes
$top_row = array("anioMes", "Record_Count", "Acumm");
$file = fopen('../accumRecorBici2014.csv', 'w');
fputcsv($file, $top_row);
$acum_viajes = 0;

// loop anios
foreach ($anios_bici as $anio) {
	// loop meses
	foreach ($meses as $mes) {
		// sumar km por mes
		$query_sum = "SELECT COUNT(*) AS viajes FROM recorridos_bici_{$anio} WHERE origenfecha >= '{$anio}-{$mes}-01 00:00:00' AND origenfecha < '{$anio}-{$mes}-31 23:59:59'";
		$result = mysql_query($query_sum) or die(mysql_error());
		$count = mysql_fetch_array($result);	
		$count_viajes = $count['viajes'];
		if ($count_viajes) {
			$acum_viajes = $acum_viajes + $count_viajes;
			
			echo "Suma en km de {$mes} de {$anio} es {$count_viajes} \n";
			echo "Acum en km de {$mes} de {$anio} es {$acum_viajes} \n";
			
			// Agregar acumulación al archivo CSV
			$row = array("{$anio}-{$mes}", $count_viajes, $acum_viajes);
			fputcsv($file, $row);
		}	
	}				 
}

// Cerrar archivo CSV
fclose($file);

// Cerrar conexion a MySQL
mysql_close($link);

?>