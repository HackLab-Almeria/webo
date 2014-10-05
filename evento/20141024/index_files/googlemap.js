function cargarmapas(nombre_archivo) {
    $.getJSON(nombre_archivo, function (datos) {
        //console.log(datos);
        var mapas = new Array();
        var mapasStreetView = new Array();
        var puntos = new Array();
        var posiciones = new Array();
        var icono;
        var infowindow = new Array;
        var comollegar;
        var texto_bocadillo;
        var texto_bocadillo_idiomas = new Array;
        var idioma_punto = "es";
        var altura_bocadillo = 140;

        /* Idiomas de las indicaciones */
        
        texto_bocadillo_idiomas["es"] = new Array("Como llegar: ", "Desde aquí", "Hasta aquí");
        texto_bocadillo_idiomas["cat"] = new Array("Com arribar: ", "Des d'aquí", "Fins aquí");
        texto_bocadillo_idiomas["ar"] = new Array("اتجاهات: ", "من هنا", "حتى الآن");
        texto_bocadillo_idiomas["en"] = new Array("Get directions: ", "From here", "To here");
        texto_bocadillo_idiomas["fr"] = new Array("Itinéraire: ", "Vers ce lieu", "Á partir de ce lieu");
        texto_bocadillo_idiomas["de"] = new Array("Wegbeschreibung: ", "Bis hier", "Von hier aus");
        texto_bocadillo_idiomas["it"] = new Array("Indicazioni: ", "Fino a qui", "Da qui");
        texto_bocadillo_idiomas["ru"] = new Array("Как добраться: ", "Отсюда", "до сих пор");
        texto_bocadillo_idiomas["pt"] = new Array("Como chegar: ", "A partir daqui", "Para Aqui");
        texto_bocadillo_idiomas["sv"] = new Array("Körbeskrivning: ", "Hittills", " Härifrån");
        


        $.each(datos.mapas, function (i, item) {
            mapas[i] = new google.maps.Map(document.getElementById(item.IdCapa), { scaleControl: true });
            mapas[i].setCenter(new google.maps.LatLng(item.CentroLon, item.CentroLat));
            mapas[i].setZoom(item.Zoom);

            switch (item.TipoMapa)
            {
                case "hibrido":
                    mapas[i].setMapTypeId(google.maps.MapTypeId.HYBRID);
                    break;
                case "carreteras":
                    mapas[i].setMapTypeId(google.maps.MapTypeId.ROADMAP);
                    break;
                case "satelite":
                    mapas[i].setMapTypeId(google.maps.MapTypeId.SATELLITE);
                    break;
                case "relieve":
                    mapas[i].setMapTypeId(google.maps.MapTypeId.TERRAIN);
                    break;
                default:
                    mapas[i].setMapTypeId(google.maps.MapTypeId.ROADMAP);
            }
        });

        $.each(datos.puntos, function (i, item) {
            /*
                Si queremos poner un street view no se declara el mapa en el archivo json
                solo se pone el punto y en el "IdMapa" se pone directamente el identificador de la capa del html.
            */
            if ((item.HeadingStreetView != 0) || (item.PitchStreetView != 0)) {
                posiciones[i] = new google.maps.LatLng(item.Lat, item.Lon);
                var panoramaOptions = {
                    position: posiciones[i],
                    pov: {
                        heading: item.HeadingStreetView,
                        pitch: item.PitchStreetView
                    }
                };
                mapasStreetView[i] = new google.maps.StreetViewPanorama(document.getElementById(item.IdMapa), panoramaOptions);
            } else {
                posiciones[i] = new google.maps.LatLng(item.Lat, item.Lon);

                // Se comprueba si tiene icono
                if (item.UrlIcono != "") {
                    icono = {
                        url: item.UrlIcono,
                        size: new google.maps.Size(item.AnchoIcono, item.AltoIcono),
                        origin: new google.maps.Point(item.OrigenIconoX, item.OrigenIconoY),
                        anchor: new google.maps.Point(item.PuntoIconoX, item.PuntoIconoY)
                    };

                    puntos[i] = new google.maps.Marker({
                        map: mapas[item.IdMapa],
                        position: posiciones[i],
                        icon: icono
                    });
                } else {
                    puntos[i] = new google.maps.Marker({
                        map: mapas[item.IdMapa],
                        position: posiciones[i]
                    });
                }

                if (item.Texto != "") {
                    texto_bocadillo = item.Texto;
                    infowindow[i] = new google.maps.InfoWindow();

                    // Se comprueba si el idioma no esta vacio para dejar el valor por defecto
                    if (item.Idioma != "") {
                        idioma_punto = item.Idioma;
                    }
                    // Se comprueba si la altura del bocadillo no esta vacia para dejar el valor por defecto
                    if (item.AlturaBocadillo != 0) {
                        altura_bocadillo = item.AlturaBocadillo;
                    }

                    comollegar = '<span style="font-size: 12px; color:#666;"><br /><br /><strong>' + texto_bocadillo_idiomas[idioma_punto][0] + '</strong><br /> <a class="enlace_maps" target="_blank" href="http://maps.google.es/maps?saddr=' + item.Lat + ',' + item.Lon + '&hl=' + item.Idioma + '&sll=' + item.Lat + ',' + item.Lon + '">' + texto_bocadillo_idiomas[idioma_punto][1] + '</a> - <a class="enlace_maps" target="_blank" href="http://maps.google.es/maps?daddr=' + item.Lat + ',' + item.Lon + '&hl=' + item.Idioma + '&sll=' + item.Lat + ',' + item.Lon + '">' + texto_bocadillo_idiomas[idioma_punto][2] + '</a><span>';
                    infowindow[i].setContent('<div style="height:' + altura_bocadillo + 'px;">' + texto_bocadillo + comollegar + '</div>');

                    google.maps.event.addListener(puntos[i], 'click', function () {
                        infowindow[i].open(mapas[item.IdMapa], puntos[i]);
                    });
                }
            }
        });
    });
}