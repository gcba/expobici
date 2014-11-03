<?php 

////////////////
//
// Fecha: Noviembre 2014
// Proyecto: Expo Bici 2014
// Autor: Pili Mayora
// 
// Output -> Archivo CSV con kilómetros acumulados por mes
// Suma kilómetros por mes de recorridos
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
$top_row_acum_km = array("aniomes", "traveledDistance_Sum", "trDistance_Accum");
$file = fopen('../biciKmMes2014.csv', 'w');
fputcsv($file, $top_row_acum_km);
$acum_km = 0;

// loop anios
foreach ($anios_bici as $anio) {
	// loop meses
	foreach ($meses as $mes) {
		// sumar km por mes
		$query_sum = "SELECT SUM(distanciametros) AS suma_metros FROM recorridos_bici_{$anio} WHERE origenfecha >= '{$anio}-{$mes}-01 00:00:00' AND origenfecha < '{$anio}-{$mes}-31 23:59:59'";
		$result = mysql_query($query_sum) or die(mysql_error());
		$sum = mysql_fetch_array($result);	
		$suma_km = $sum['suma_metros']/1000;
		if ($suma_km) {
			$acum_km = $acum_km + $suma_km;
			
			echo "Suma en km de {$mes} de {$anio} es {$suma_km} \n";
			echo "Acum en km de {$mes} de {$anio} es {$acum_km} \n";
			
			// Agregar acumulación al archivo CSV
			$row = array("{$anio}-{$mes}", $suma_km, $acum_km);
			fputcsv($file, $row);
		}	
	}				 
}

// Cerrar archivo CSV
fclose($file);

// Cerrar conexion a MySQL
mysql_close($link);

?>