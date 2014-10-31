import time
import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0

###########
#
# Fecha: Octubre 2014
# Proyecto: Ecobici 2014
# Autor: Pili Mayora
#
# Selenium script para obtener las distancias de los recorridos de las bicicletas
# Hace scraping de los resultados desde la página de ecobici
# NOTA: No terminé utilizando este script. Usé estacionesKms.php. 
# El motivo es que la página no podía soportar las 900 requests que le hacía el script de Selenium 
#
############

with open("../EstacionesF.csv", "rb") as f:
    reader = csv.reader(f)
    next(reader, None)  # skip the headers
    estaciones = []
    for row in reader:
    	if row[1] == "PLAZA G\xc3\x9cEMES":
    		estaciones.append("PLAZA GUEMES")
    	else:
    		estaciones.append(row[1]) 

# Create a new instance of the Chrome driver
driver = webdriver.Chrome('/usr/local/chromedriver')

for estacionOrigen in estaciones:
	for estacionDestino in estaciones:

		# go to the ecobici home page
		driver.get("http://transito.buenosaires.gob.ar/contadoremisiones/")

		# find the "Carga tu recorrido" boton
		botonCargarRecorrido = driver.find_element(By.ID, 'btnCargarRecorrido')

		# click boton
		botonCargarRecorrido.click()

		# find campos de origen y destino
		inputOrigen = driver.find_element(By.ID, 'txtOrigen')
		inputDestino = driver.find_element(By.ID, 'txtDestino')

		# hack para esperar a que los campos aparezcan bien en la pagina
		time.sleep(1)

		inputOrigen.send_keys(estacionOrigen + " bicicletas")

		# esperar a que aparezca el dropdown con las opciones
		opcionEstacionOrigen = WebDriverWait(driver, 10).until(
		        EC.presence_of_element_located((By.NAME, 'usig_acv_txtOrigen0'))
		    )

		opcionEstacionOrigen.click()

		inputDestino.send_keys(estacionDestino + " bicicletas")

		opcionEstacionDestino = WebDriverWait(driver, 10).until(
		        EC.presence_of_element_located((By.NAME, 'usig_acv_txtDestino0'))
		    )

		opcionEstacionDestino.click()

		# seleccionar actividad a realizar
		opcionActividad = driver.find_element(By.CSS_SELECTOR, '#panelDESTINO > div:nth-child(2) > center > img:nth-child(1)')
		opcionActividad.click()

		# seleccionar medio de transporte
		opcionTransporte = driver.find_element(By.CSS_SELECTOR, '#panelTRANSPORTE > div:nth-child(2) > center > img:nth-child(1)')
		opcionTransporte.click()

		# cargar recorrido
		botonCargarRecorrido = driver.find_element(By.ID, 'btnCargarRecorrido')
		botonCargarRecorrido.click()

		kilometros = WebDriverWait(driver, 60).until(
			EC.presence_of_element_located((By.ID, 'lblItemRecorrido_0_Distancia'))
		)  
		print kilometros.text

driver.quit()