/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    
    var tpuBuildings = null;
    
    var map = new L.Map('map', {
        layers: [
            new L.TileLayer(
                    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                    }
            )
        ]
    });

    map.setView([56.46, 84.95], 15);
});
