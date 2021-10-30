var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// initialize map and add satellite layer
var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 4
});

 L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
     attribution:"© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>", 
     tileSize: 512,
     maxZoom: 18,
     zoomOffset: -1,
     id: "mapbox/satellite-v9",
     accessToken: API_KEY
 }).addTo(myMap);

 // read in json and add earthquake markers to the map
d3.json(url).then(function(data) {
    // create marker style for L.geoJSON
    
  /*  
    function geojsonStyle(feature) {
        return { 
            opacity: 1,
            fillOpacity: 1,
            fillColor: colorScale(feature.geometry.coordinates[2]),
            //color: "#000000",
            radius: radiusSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    */
    
    // create color scale function
    function colorScale(depth) {
        switch(depth) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "tomato"
            case depth > 50:
                return "orange";
            case depth > 30:
                return "gold";
            case depth > 10:
                return "yellow";
            default:
                return "yellowgreen";
            
        }
    }

    //create marker size function
    function radiusSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 5;
    }

    

    // make some circles
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng,
                {
                    radius: radiusSize(feature.properties.mag),
                    fillOpacity: 0.7,
                    fillColor: colorScale(feature.geometry.coordinates[2]),
                    color: "black",
                    stroke: true,
                    weight: 0.5
                }
                );
        },
        onEachFeature (feature, layer) {
            layer.bindPopup(`Magnitude ${feature.properties.mag}, Location: ${feature.properties.place}`);
        }
    }).addTo(myMap);

    // legend
    var legend = L.control({ 
        position: "bottomright"
    });

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
        for (var i =0; depth.length; i++) {
            div.innerHTML += 
            '<i style="background: ' + colorScale(depth[i] + 1) + '"></i> ' +
                    depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
                  
                return div;
        }
    }
    legend.addTo(myMap);
});


