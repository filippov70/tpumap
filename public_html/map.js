/* 
 * The MIT License
 *
 * Copyright 2016 filippov.
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

    var educationsStyle = {
        'color': 'black',
        'fillOpacity': 0.6,
        'fillColor': '#4dc436',
        'weight': 1.5
    };
    var infrastructureStyle = {
        'color': 'black',
        'fillOpacity': 0.6,
        'fillColor': '#f07400',
        'weight': 1.5
    };
    var hostelsStyle = {
        'color': 'black',
        'fillOpacity': 0.6,
        'fillColor': '#1e45f6',
        'weight': 1.5
    };

    var entersStyle = {
        'radius': '0',
        'opacity': '0'
    };
    
    var locale = ['ru', 'en', 'cn'];
    
    var tpuHostels = new L.geoJson(null,
            {style: hostelsStyle,
                onEachFeature: function (feat, lyr) {
                    lyr.on('click', function (evt) {
                        // TODO вызов поэтажных планов по id
                        console.log(feat.properties);
                    });
                }
            });

    $.ajax({
        dataType: "json",
        url: "data/hostels.geojson",
        success: function (data) {
            $(data.features).each(function (key, data) {
                tpuHostels.addData(data);

            });
        }
    }).error(function () {});

    var tpuInfrastructure = new L.geoJson(null,
            {style: infrastructureStyle,
                onEachFeature: function (feat, lyr) {
                    lyr.on('click', function (evt) {
                        // TODO вызов поэтажных планов по id
                        console.log(feat.properties);
                    });
                }
            });

    $.ajax({
        dataType: "json",
        url: "data/infrastructure.geojson",
        success: function (data) {
            $(data.features).each(function (key, data) {
                tpuInfrastructure.addData(data);

            });
        }
    }).error(function () {});

    var tpuEducations = new L.geoJson(null,
            {style: educationsStyle,
                onEachFeature: function (feat, lyr) {
                    lyr.on('click', function (evt) {
                        // TODO вызов поэтажных планов по id
                        console.log(feat.properties);
                    });
                }
            });

    $.ajax({
        dataType: "json",
        url: "data/educations.geojson",
        success: function (data) {
            $(data.features).each(function (key, data) {
                tpuEducations.addData(data);

            });
        }
    }).error(function () {});

    var entersArray = [];

    var enters = new L.geoJson(null, {style: entersStyle,
        onEachFeature: function (feat, lyr) {
            // вдруг нужно будет
            //lyr.bindPopup(feat.properties.Назва);
        }});

    $.ajax({
        dataType: "json",
        url: "data/enterstpu.geojson",
        success: function (data) {
            $(data.features).each(function (key, data) {
                enters.addData(data);
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
    
    // Possible types: map, satellite, hybrid, publicMap, publicMapHybrid
    var yandex = new L.Yandex('map', {visible: false});
    // Possible types: SATELLITE, ROADMAP, HYBRID, TERRAIN
    var ggl = new L.Google('ROADMAP');
    
    var map = new L.Map('map', {
        layers: [
            osm
            //,
            //yandex
        ]
    });

    tpuEducations.addTo(map);
    tpuHostels.addTo(map);
    tpuInfrastructure.addTo(map);
    //enters.addTo(map);

    $.getJSON("data/enterstpu.geojson", function (json) {
        $.each(json.features, function (index, value) {
            var text = value.properties.Назва;
            entersArray.push(value);
            $('#sel1').append(('<option value="' + index + '">' + text + '</options'));
            $('#sel2').append(('<option value="' + index + '">' + text + '</options'));
            $('#sel2 :last').attr("selected", "selected");
        });

    });

    map.setView([56.46, 84.95], 15);
//    var fg = L.featureGroup(tpuBuildings);
//    fg.on('click', function (event) {
//        console.log(event);
//    }).addTo(map);
    var baseMaps = {
        "подложка OSM": osm,
        "подложка Yandex": yandex,
        "подложка Google": ggl
    };

//    var overlayMaps = {
//        "Cities": cities
//    };

    L.control.layers(baseMaps,
            {
                'Учебные': tpuEducations,
                'Общежития': tpuHostels,
                'Соц.объекты': tpuInfrastructure
            }
    ).addTo(map);

    // геолокация

    L.control.locate({
        position: 'topleft',
        layer: new L.LayerGroup(),
        drawCircle: false,
        follow: true,
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

    var routeControl = L.control({position: 'topleft'});
    var from, to;

    routeControl.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'leaflet-control-locate leaflet-bar leaflet-control');
        var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', div);
        link.title = 'Как проехать';
        var icon = L.DomUtil.create('span', 'fa fa-arrow-circle-o-up', link);
        link.onclick = function () {
            $('#myModal').modal('toggle');
            from = null;
            to = null;
        };
        return div;
    };
    routeControl.addTo(map);
    var rcontrol;
    $('#route').click(function () {
        from = $('#sel1').val();
        to = $('#sel2').val();
        fromCoord = entersArray[from].geometry.coordinates;
        toCoord = entersArray[to].geometry.coordinates;
        if (rcontrol) {
            rcontrol.removeFrom(map);
        }
        rcontrol = new L.Routing.control({
            waypoints: [
                L.latLng(fromCoord[1], fromCoord[0]),
                L.latLng(toCoord[1], toCoord[0])
            ],
            routeWhileDragging: true,
            formatter: new L.Routing.Formatter({
                language: locale[0], // 'en'
                units: 'metric'
            }),
            collapsible: true
            //showAlternatives: true
        }).addTo(map);
    });

});
