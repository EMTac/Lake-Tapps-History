const map = L.map('map').setView([47.22, -122.17], 14);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([51.2, 7]).addTo(map);

var sidebar = L.control.sidebar('sidebar', {
        closeButton: true,
        position: 'left'
    });

sidebar.addTo(map);

map.addControl(sidebar);

setTimeout(function () {
    sidebar.show();
}, 500);

// map.on('click', function () {
//     sidebar.hide();
// })

// L.geoJSON(POI).addTo(map).on('click', function(e){
//     sidebar.toggle()
// });

var POI = L.geoJSON(POI, {
    onEachFeature: onEachFeature2
});

var historicLakes = L.geoJSON(Lakes, {
    onEachFeature: onEachFeature,
    opacity: 0.3,
});

var lakeComparison = L.geoJSON(Lakes, {
    onEachFeature: onEachFeature,
});

function onEachFeature(feature, layer) {
    layer.on('click', function() {
    sidebar.show();
    sidebar.setContent(feature.properties.Name);
    });
}

function onEachFeature2(feature, layer) {
    layer.on('click', function() {
    sidebar.show();
    sidebar.setContent(feature.properties.OBJECTID);
    });
}



var lyrOldTapps = L.imageOverlay('resources/Lake_Tapps_1900.png', [[47.5004398, -121.9953424], [46.9971086, -122.5015877]]);

var tapps1900 = L.layerGroup([tiles, lyrOldTapps, historicLakes]).addTo(map);
var tapps2022 = L.layerGroup([tiles, lakeComparison, POI]);

var baseMaps = {
    "1900": tapps1900,
    "2022": tapps2022,
};

var overlayMaps = {
    "1900 Map": tapps1900,
};

var layerControl = L.control.layers(baseMaps,null,{collapsed:false}).addTo(map);
