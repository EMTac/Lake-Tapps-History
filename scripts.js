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

var legend = L.control.Legend({
    position: "bottomright",
    title: "Reservoir Features",
    opacity: 1.0,
    legends: [
        {
            label: "Embankment",
            type: "polyline",
            layers: lyrDikes,
            color: "black",
            weight: 5
        },
        {
            label: "Planned Reservoir Extent",
            type: "rectangle",
            layers: reservoirOverlay,
            color: '#aecff2',
            fill: true,
            fillOpacity: 0.4,
        },
]
});

var legend2 = L.control.Legend({
    position: "bottomright",
    title: "Reservoir Features",
    opacity: 1.0,
    legends: [
        {
            label: "Embankment",
            type: "polyline",
            layers: lyrDikes,
            color: "black",
            weight: 5
        },
        {
            label: "Historic Lakes",
            type: "rectangle",
            layers: historicLakes,
            color: '#5183ee',
            fill: true,
            fillOpacity: 0.4,
        },
]
});

function createCustomIcon (feature, latlng) {
    let myIcon = L.icon({
      iconUrl: 'resources/red-marker.png',
      shadowUrl: 'resources/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
    return L.marker(latlng, { icon: myIcon })
  }

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
    pointToLayer: createCustomIcon,
    onEachFeature: onEachFeature2,
})

var POI1911 = L.geoJSON(POI_1911, {
    pointToLayer: createCustomIcon,
    onEachFeature: onEachFeature2,
});

var POI1900 = L.geoJSON(POI_1900, {
    pointToLayer: createCustomIcon,
    onEachFeature: onEachFeature2,
});

var historicLakes = L.geoJSON(Lakes2, {
    onEachFeature: onEachFeature,
    opacity: 0.3,
    color: 'blue',
});

var initialStyle = {
    "color": 'blue',
};

var lakeComparison = L.geoJSON(Lakes2, {
    interactive:false,
    color: '#5183ee',
});

function onEachFeature(feature, layer) {
    var img=("<img src="+feature.properties.Img+" width=400px"+">");
    layer.on('click', function() {
    sidebar.show();
    sidebar.setContent("<h1>"+feature.properties.Name+"</h1>"+img+"<p>"+"<i>"+feature.properties.Caption+"</i>"+"<hr></hr>"+"</p>"+"<p>"+feature.properties.Description+feature.properties.Description2+feature.properties.Description3+"</p>");
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
    sidebar.setContent("<h1>"+feature.properties.Name+"</h1>"+Image+"<p>"+"<i>"+feature.properties.Caption+"</i>"+"</p>"+"<hr></hr>"+"<p>"+feature.properties.Description+feature.properties.Description2+"</p>");
    });
}

var lyrOldTapps = L.imageOverlay('resources/Lake_Tapps_1900-min.png', [[47.5004398, -121.9953424], [46.9971086, -122.5015877]]);

var tapps = L.layerGroup([tiles]).addTo(map);
var tapps1900 = L.layerGroup([tiles, lyrOldTapps, historicLakes, POI1900]);
var tapps1911 = L.layerGroup([tiles, lyrOldTapps, POI1911, lyrDikes, reservoirOverlay])
var tapps2022 = L.layerGroup([tiles, lakeComparison, POI2022, lyrDikes]);

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
        map.removeControl(legend);
        map.removeControl(legend2);
        map.setView([47.211, -122.175], 14);
        sidebar.setContent("<h1>"+"Lake Tapps: 1900"+"</h1>"+"<p>"+"What happened to the lake? You will recall that in the present day, Lake Tapps is an expansive reservoir, shaped by human hands. However, traveling back more than a century, we can strip away many of the human modifications to see what came before. What you see now is a collection of natural lakes, remnants of the last ice age. In 1900, these were still heavily forested. The few winding roads in the area were composed of "+"<a href=https://en.wikipedia.org/wiki/Corduroy_road target=_blank>dirt and timber</a>"+", serving the handful of remote farmsteads between Sumner and Buckley."+"</p>"+"<p>"+"The four lakes that underly the modern reservoir are Kirtley Lake, Crawford Lake, Church Lake, and the eponymous Lake Tapps. A 5th, smaller body of water appears here at the northwest corner but remains unnamed. Likely, this was a shallow pond or wetland and is not mentioned in historical accounts of the reservoir’s formation. The other small body of water to the southwest is Lake Bonney, the namesake of the modern city of Bonney Lake, incorporated 50 years later."+"</p>"+"<p>"+"Click on a lake to read more about it or view historical imagery if it is available. Select 1911 when you are ready to move on."+"</p>");
    } else if (eventLayer.layer === tapps1911) {
        map.removeControl(legend2);
        legend.addTo(map);
        map.setView([47.211, -122.15], 13);
        sidebar.setContent("<h1>"+"White River Power Project"+"</h1>"+"<img src= https://digitalcollections.lib.washington.edu/digital/api/singleitem/image/ww-swps/356/default.jpg?highlightTerms=lake%20tapps width=400px>"+"<p>"+"At the turn of the century, the Puget Sound region was growing rapidly, bolstered by constant arrivals from the east. Along with these newly arriving settlers came the need for additional power. The Pacific Coast Power Company sought to satisfy this need with an expansive hydroelectric project."+"</p>"+"<p>"+"The two most important elements of any hydroelectric project are a constant water supply and a reservoir to ensure the stability of that water supply, even as seasonal fluctuations occur. Pacific Coast Power found its water supply in the White River, which originates on the eastern flank of Mt Rainier before flowing down into the lowlands, eventually meeting the Puyallup River in Sumner. So where would the reservoir be? Fortunately for the power company, an excellent location was immediately apparent. Though they would require substantial modification, this collection of lakes would soon serve the purpose."+"</p>"+"<p>"+"In 1910, work began. A portion of the White River was diverted uphill of the lakes, in Buckley, and routed through 7 and 3/4 miles of flumes, canals, and basins before reaching the site of the reservoir. To ensure the lakes’ capacity to contain the additional water, 13 embankments were constructed at low points around the area. Now, when the water level was raised, it wouldn’t simply flow out into the valley. A powerhouse was built in Dieringer, north of Sumner, and a tunnel was dug to connect the reservoir to it. From there, a canal led right back into the White River, 19 miles downstream of the diversion dam. To facilitate this massive project, the Northern Pacific Railroad built a new line between Sumner and Buckley, and a sawmill was completed on the shore of Lake Tapps. Construction camps were scattered throughout the project area, but with this infrastructure in place, materials were easily produced and delivered."+"</p>"+"<p>"+"By 1911, work was nearly finished, and the finishing touches were completed by early 1912. That same year, the Pacific Coast Power Company was purchased by Puget Sound Traction, Power & Light, now called Puget Sound Energy (PSE). The powerhouse entered operation with a generating capacity of 64,000 kilowatts."+"</p>"+"<p>"+"To view additional project photos, not shown here, visit the UW Library "+"<a href=https://digitalcollections.lib.washington.edu/digital/collection/ww-swps/search/searchterm/white%20river/field/descri/mode/all/conn/and/cosuppress/ target=_blank>White River Power Plant Collection.</a>"+"</p>"+"<p>"+"To see what the project area looks like more than a century later, select 2022 on the right."+"</p>");
    } else if (eventLayer.layer === tapps2022) {
        map.removeControl(legend);
        legend2.addTo(map);
        map.setView([47.211, -122.15], 13);
        sidebar.setContent("<h1>"+"The Passing of a Century"+"</h1>"+"<img src= https://i.imgur.com/IqWafwN.jpg width=400px>"+"<p>"+"By 2004, the infrastructure built for the White River Project was beginning to show its age, and Puget Sound Energy ceased generating power after 92 years of operation. However, over this same period, the number of people living on the banks of the reservoir skyrocketed, leaving very little vacant land. To drain the reservoir and return the lakes to their historic extent would’ve meant removing the waterfront from thousands of waterfront homes, not to mention the expense. Therefore, even though the turbines of the powerhouse no longer turn, the water still flows through the same route it followed a century prior."+"<p>"+"In 2009, the Cascade Water Alliance purchased the entire project from Puget Sound Energy. Today, the reservoir is marked by dramatically fluctuating water levels. In the summer, it is filled to its maximum extent to support recreation. In the winter, it is drained to allow the Cascade Water Alliance to maintain the ancient infrastructure and to support the ecological health of the White River. During these months, the century-old artifacts of the White River Project become obvious."+"</p>"+"<p>"+"The Cascade Water Alliance, which supplies drinking water to customers around the Puget Sound, plans to use the reservoir as a municipal drinking water source. However, an agreement with both homeowners and the Muckleshoot Indian Tribe ensures that the company will maintain both reservoir water levels and river flow volumes. As of 2022, the drinking water project has yet to come to fruition."+"</p>")
    }
  });
