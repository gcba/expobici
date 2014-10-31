<?php 

/////////////////
//
// Fecha: Octubre 2014
// Proyecto: Ecobici 2014
// Autor: Pili Mayora
//
// Output -> un archivo CSV con: 
// estacion de origen, estacion de destino, y distancia entre ellas en metros
//
// Utiliza dos endpoints de la API de la USIG para:
// 1. Los datos de coordenadas de las estaciones
// 2. La distancia en metros entre dos puntos con coordenadas (x,y)
//
/////////////////

$fileEstaciones = fopen('../EstacionesUsigId.csv', 'r');
$estacionesXY = array();

// Skip first line
fgetcsv($fileEstaciones);
while(! feof($fileEstaciones)) {  
  	$line = fgetcsv($fileEstaciones);
  	$usigId = $line[0];  
  	$id = $line[1];
  
	// Access API de la usig para obtener x e y
	$usigUrl = 'http://epok.buenosaires.gob.ar/getObjectContent/?id=estaciones_de_bicicletas|' . $usigId;
	$usigJson = file_get_contents($usigUrl);
	$jsonParsed = json_decode($usigJson, true);
	$centroide = $jsonParsed['ubicacion']['centroide'];
	
	if ($centroide) {
		// Parse centroide para encontrar x e y
		$parseCentroide = preg_split("/[\s()]+/", $centroide);
		$usigX = $parseCentroide[1];
		$usigY = $parseCentroide[2];

		// Agregar estacion a lista de estaciones		
		$estacionXY = array($id, $usigX, $usigY);
		array_push($estacionesXY, $estacionXY);
	}
}

// Cerrar estaciones
fclose($fileEstaciones);

// Crear archivo CSV en donde guardar las distancias
$topRowEstacionesKms = array("origen_estacion_id","destino_estacion_id","distancia");
$fileKm = fopen('../estaciones_distancia.csv', 'w');
fputcsv($fileKm, $topRowEstacionesKms);

// loop nˆ2 por las estaciones para calcular distancias
for ($i = 0; $i < sizeof($estacionesXY); $i++) {
	for ($j = 0; $j < sizeof($estacionesXY); $j++) {
		$distanciaUrl = 'http://recorridos.usig.buenosaires.gob.ar/2.0/consultar_recorridos?tipo=bici&origen=' . 
						$estacionesXY[$i][1] . 
						'%2C' .
						$estacionesXY[$i][2] .
						'&destino=' .
						$estacionesXY[$j][1] .
						'%2C' .
						$estacionesXY[$j][2];
		$json = file_get_contents($distanciaUrl);
		$jsonParsed = json_decode($json, true);
		$planningJson = $jsonParsed['planning'][0];
		$planningParsed = json_decode($planningJson, true);
		$traveledDistance = $planningParsed['traveled_distance'];

		// Agregar recorrido al archivo CSV
		$row = array($estacionesXY[$i][0], $estacionesXY[$j][0], $traveledDistance);
		fputcsv($fileKm, $row);
	}
}

// Cerrar recorridos
fclose($fileKm);
?>