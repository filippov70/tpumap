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

function run () {

    var basestations = L.layerGroup();
    
    var myIcon = L.icon({
        iconUrl: 'http://109.202.24.24/zrp/bs.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [1, -36],
    });
    L.marker([54.721331, 20.495379], {icon: myIcon}).bindPopup('БС').addTo(basestations);

    var zrp = L.tileLayer('http://109.202.24.24/ZRPBS/{z}/{x}/{y}.png', {
		maxZoom: 13 });

    

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
            zrp, 
            basestations
        ]
    });


    map.setView([54.721331, 20.495379], 11);

    var baseMaps = {
        "OpenTopoMap": osm,
        "Falk OSM": falkosm,
        "ESRI Sat": esrisat,
        "ESRI Topo": esritopo
    };


    L.control.layers(baseMaps,
            overlays, 
            {collapsed: false}
    ).addTo(map);
    L.DomUtil.addClass(map._container,'crosshair-cursor-enabled');
    document.getElementById('map').style.color = 'black';
    map.attributionControl._attributions = {};
    map.attributionControl.addAttribution('<a href="http://yandex.ru" title="Yandex">Yandex</a>');
    

    L.control.scale({ position: 'bottomleft', imperial:false, maxWidth:200}).addTo(map);
    
    L.control.mouseCoordinate().addTo(map);
    
    
    // Legend 
    // formatted text
    var color1 = '<span class="fa fa-stop fa-fw"; style="color: red"></span> Текст для иконки</br></br>';
    var color2 = '<span class="fa fa-stop fa-fw"; style="color: green"></span> Текст для иконки</br></br>';
    var color3 = '<span class="fa fa-stop fa-fw"; style="color: blue"></span> Текст для иконки</br></br>';
    
    var legend = L.control.LegendContainer()
              .setContent("<h2>Заголовок легенды</h2><p>Строка 1</p><p>Строка 2</p><p>Строка 3</p><p>Строка 4</p><p>Строка 5</p>"+color1+color2+color3)
              //.close()
              .addTo(map);
      
    var legControl = L.control({position: 'topleft'});
    legControl.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'leaflet-control-locate leaflet-bar leaflet-control');
        var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', div);
        link.title = 'Легенда';
        var icon = L.DomUtil.create('span', 'fa fa-map', link);
        link.onclick = function () {
            legend.open();
        };
        return div;
    };
    legControl.addTo(map);  
};
