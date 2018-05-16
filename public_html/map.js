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


    var basestations = L.layerGroup();
    
    var myIcon = L.icon({
        iconUrl: 'http://109.202.24.24/zrp/bs.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [1, -36],
    });
    L.marker([54.721331, 20.495379], {icon: myIcon}).bindPopup('БС').addTo(basestations);

    var zrp = L.tileLayer('http://109.202.24.24/ZRPBS/{z}/{x}/{y}.png', {
		maxZoom: 13 }).addTo(basestations);

    

    var osm = L.tileLayer('http://a.tile.opentopomap.org/{z}/{x}/{y}.png', {maxZoom: 13}),
            falkosm = L.tileLayer('http://ec2.cdn.ecmaps.de/WmsGateway.ashx.jpg?TileX={x}&TileY={y}&ZoomLevel={z}&Experience=falk&MapStyle=Falk%20OSM', {maxZoom: 13}),
            esrisat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg', {maxZoom: 13}),
            esritopo = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.jpg', {maxZoom: 13});

    var overlays = {
        "Зона радиопокрытия": zrp,
        "БС": basestations

    };

    var map = new L.Map('map', {
        layers: [
            osm,
            falkosm,
            esrisat,
            esritopo
                    //,
                    //yandex
        ]
    });

//    tpuEducations.addTo(map);
//    tpuHostels.addTo(map);
//    tpuInfrastructure.addTo(map);
    //enters.addTo(map);

//    $.getJSON("data/enterstpu.geojson", function (json) {
//        $.each(json.features, function (index, value) {
//            var text = value.properties.Назва;
//            entersArray.push(value);
//            $('#sel1').append(('<option value="' + index + '">' + text + '</options'));
//            $('#sel2').append(('<option value="' + index + '">' + text + '</options'));
//            $('#sel2 :last').attr("selected", "selected");
//        });
//
//    });

    map.setView([54.721331, 20.495379], 13);
//    var fg = L.featureGroup(tpuBuildings);
//    fg.on('click', function (event) {
//        console.log(event);
//    }).addTo(map);
    var baseMaps = {
        "OpenTopoMap": osm,
        "Falk OSM": falkosm,
        "ESRI Sat": esrisat,
        "ESRI Topo": esritopo
    };


    L.control.layers(baseMaps,
            overlays
    ).addTo(map);

    L.control.scale({ position: 'bottomleft', imperial:false, maxWidth:200}).addTo(map);
});
