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

var myStyleDikes = {
    "color": "#000000",
    "weight": 5,
    "opacity": 1.0,
    interactive: false,
};

var myStyleReservoir = {
    "opacity": 0.3,
    interactive: false,
};

var lyrDikes = L.geoJSON(Dikes, {
    style: myStyleDikes,
});

var reservoirOverlay = L.geoJSON(tappsReservoir, {
    style: myStyleReservoir,
});

var POI2022 = L.geoJSON(POI_2022, {
    onEachFeature: onEachFeature2,
})

var POI1911 = L.geoJSON(POI_1911, {
    onEachFeature: onEachFeature2,
});

var POI1900 = L.geoJSON(POI_1900, {
    onEachFeature: onEachFeature2,
});

var historicLakes = L.geoJSON(Lakes2, {
    onEachFeature: onEachFeature,
    opacity: 0.3,
    color: 'blue',
});

var initialStyle = {
    "color": 'blue'
};

var lakeComparison = L.geoJSON(Lakes2, {
    interactive:false,
});

function onEachFeature(feature, layer) {
    var img=("<img src="+feature.properties.Img+" width=400px"+">");
    layer.on('click', function() {
    sidebar.show();
    sidebar.setContent("<h1>"+feature.properties.Name+"</h1>"+img+"<p>"+feature.properties.Caption+"</p>"+"<br></br>"+"<p>"+feature.properties.Description+feature.properties.Description2+feature.properties.Description3+"</p>");
    });
    layer.on('mouseover', function() {
        this.setStyle({
            color: 'white'
        });
    });
    layer.on('mouseout', function() {
        this.setStyle(initialStyle)
    });
}

function onEachFeature2(feature, layer) {
    var Image=("<img src="+feature.properties.Image+" width=400px"+">");
    layer.on('click', function() {
    sidebar.show();
    sidebar.setContent("<h1>"+feature.properties.Name+"</h1>"+Image+"<p>"+feature.properties.Caption+"</p>"+"<br></br>"+"<p>"+feature.properties.Description+feature.properties.Description2+"</p>");
    });
}

var lyrOldTapps = L.imageOverlay('resources/Lake_Tapps_1900-min.png', [[47.5004398, -121.9953424], [46.9971086, -122.5015877]]);

var tapps = L.layerGroup([tiles]).addTo(map);
var tapps1900 = L.layerGroup([tiles, lyrOldTapps, historicLakes, POI1900]);
var tapps1911 = L.layerGroup([tiles, lyrOldTapps, POI1911, lyrDikes, reservoirOverlay])
var tapps2022 = L.layerGroup([tiles, lakeComparison, POI2022]);

var baseMaps = {
    "1900": tapps1900,
    "1911": tapps1911,
    "2022": tapps2022,
};

var overlayMaps = {
    "1900 Map": tapps1900,
};

var layerControl = L.control.layers(baseMaps,null,{collapsed:false}).addTo(map);

map.on('baselayerchange', function(eventLayer) {
    sidebar.show();
    if (eventLayer.layer === tapps1900) {
        map.setView([47.211, -122.175], 14);
        sidebar.setContent("<h1>"+"Lake Tapps: 1900"+"</h1>"+"<p>"+"What happened to the lake? You will recall that in the present day, Lake Tapps is an expansive reservoir, shaped by human hands. However, traveling back more than a century, we can strip away many of the human modifications to see what came before. What you see now is a collection of natural lakes, remnants of the last ice age. In 1900, these were still heavily forested. The few winding roads in the area are composed of "+"<a href=https://en.wikipedia.org/wiki/Corduroy_road target=_blank>dirt and timber</a>"+", serving the handful of remote farmsteads between Sumner and Buckley."+"</p>"+"<p>"+"The four lakes that underly the modern reservoir are Kirtley Lake, Crawford Lake, Church Lake, and the eponymous Lake Tapps. A 5th, smaller body of water appears here at the northwest corner but remains unnamed. Likely, this was a shallow pond or wetland and is not mentioned in historical accounts of the reservoir’s formation. The other small body of water to the southwest is Lake Bonney, the namesake of the modern city of Bonney Lake, incorporated 50 years later."+"</p>"+"<p>"+"Click on a lake to read more about it or view historical imagery if it is available. Select 1911 when you are ready to move on."+"</p>");
    } else if (eventLayer.layer === tapps1911) {
        map.setView([47.211, -122.15], 13);
        sidebar.setContent("<h1>"+"White River Power Project"+"</h1>"+"<img src= https://digitalcollections.lib.washington.edu/digital/api/singleitem/image/ww-swps/356/default.jpg?highlightTerms=lake%20tapps width=400px>");
    } else if (eventLayer.layer === tapps2022) {
        sidebar.setContent("<h1>"+"The Passing of a Century"+"</h1>")
    }
  });
