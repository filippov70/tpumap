/* 
 * The MIT License
 *
 * Copyright 2014 filippov.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
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
    
    // геолокация
    
    L.control.locate({
        position: 'topleft',
        layer: new L.LayerGroup(), 
        drawCircle: false, 
        follow: false, 
        setView: true, 
        keepCurrentZoomLevel: true, 
        stopFollowingOnDrag: false, 
        remainActive: false, 
        markerClass: L.circleMarker, // L.circleMarker or L.marker
        circleStyle: {}, 
        markerStyle: {},
        followCircleStyle: {}, 
        followMarkerStyle: {},
        icon: 'fa fa-map-marker', 
        iconLoading: 'fa fa-spinner fa-spin', 
        iconElementTag: 'span', // tag for the icon element, span or i
        circlePadding: [0, 0], 
        metric: true, 
        onLocationError: function (err) {
            alert(err.message);
        }, 
        onLocationOutsideMapBounds: function (context) { 
            alert(context.options.strings.outsideMapBoundsMsg);
        },
        showPopup: true,
        strings: {
            title: "Где я?", // title of the locate control
            metersUnit: "метр", // string for metric units
            feetUnit: "feet", // string for imperial units
            popup: "Вы находитесь внутри окружности радиусом {distance} {unit} от этой точки", // text to appear if user clicks on circle
            outsideMapBoundsMsg: "You seem located outside the boundaries of the map" // default message for onLocationOutsideMapBounds
        },
        locateOptions: {}  // define location options e.g enableHighAccuracy: true or maxZoom: 10
    }).addTo(map);

    // Прокладка маршрутов
//    var rcontrol = new L.Routing.control({
//        waypoints: [
//            L.latLng(56.465427, 84.950363),
//            L.latLng(56.462500, 84.957147)
//        ],
//        routeWhileDragging: true
//    }).addTo(map);
    
    var routeControl = L.control({position: 'topleft'});
    
    routeControl.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'leaflet-control-locate leaflet-bar leaflet-control');
        var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', div);
        link.title = 'Как пройти';
        var icon = L.DomUtil.create('span', 'fa fa-arrow-circle-o-up', link);
        link.onclick = function() {
          $('#myModal').modal('toggle');
          //console.log('click');
        };
        return div;
    };
    routeControl.addTo(map);
//    function createButton(label, container) {
//        var btn = L.DomUtil.create('button', 'button', container);
//        btn.setAttribute('type', 'button');
//        btn.innerHTML = label;
//        return btn;
//    };

//    
//    var startBtn, destBtn;
//    map.on('click', function (e) {
//        var container = L.DomUtil.create('div'),
//                startBtn = createButton('Укажите откуда', container),
//                destBtn = createButton('Укажите куда', container);
//
//        L.popup()
//                .setContent(container)
//                .setLatLng(e.latlng)
//                .openOn(map);
//    });
//    L.DomEvent.on(startBtn, 'click', function () {
//        rcontrol.spliceWaypoints(0, 1, e.latlng);
//        map.closePopup();
//    });
//    L.DomEvent.on(destBtn, 'click', function () {
//        rcontrol.spliceWaypoints(rcontrol.getWaypoints().length - 1, 1, e.latlng);
//        map.closePopup();
//    });
});
