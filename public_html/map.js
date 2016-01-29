/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {

    var buildingsStyle = {
        'color': 'black',
        'fillOpacity': 0.9,
        'fillColor': '#6EB844',
        'weight': 1.5
    };

    var enters = new L.geoJson(null, {onEachFeature: function (feat, lyr) {
            // вдруг нужно
            lyr.bindPopup(feat.properties.Название);
        }});

    var tpuBuildings = new L.geoJson(null,
            {style: buildingsStyle,
                onEachFeature: function (feat, lyr) {
                    lyr.on('click', function (evt) {
                        // TODO вызов поэтажных планов по id
                       console.log(feat.properties);
                    });
                }
            });

    $.ajax({
        dataType: "json",
        url: "data/buildings.geojson",
        success: function (data) {
            $(data.features).each(function (key, data) {
                tpuBuildings.addData(data);

            });
        }
    }).error(function () {});

    $.ajax({
        dataType: "json",
        url: "data/enterstpu.geojson",
        success: function (data) {
            $(data.features).each(function (key, data) {
                enters.addData(data);
                //console.log(data, key);
            });
        }
    }).error(function () {});

    var osm = new L.TileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                //opacity: 0.7,
                visible: true
            }
    );

    var yandex = new L.Yandex('hybrid', {visible: false});

    var map = new L.Map('map', {
        layers: [
            osm
                    //,
                    //yandex
        ]
    });

    tpuBuildings.addTo(map);
    enters.addTo(map);

    map.setView([56.46, 84.95], 15);
//    var fg = L.featureGroup(tpuBuildings);
//    fg.on('click', function (event) {
//        console.log(event);
//    }).addTo(map);
    var baseMaps = {
        "подложка OSM": osm,
        "подложка Yandex": yandex
    };

//    var overlayMaps = {
//        "Cities": cities
//    };

    L.control.layers(baseMaps, {'Строения': tpuBuildings}).addTo(map);

});
