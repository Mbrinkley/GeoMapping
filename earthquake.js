// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {


  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  

  // Create a GeoJSON layer 
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 139
      var g = Math.floor(0*feature.properties.mag);
      var b = Math.floor(139*feature.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });


  // createMap function
  createMap(earthquakes);
  
}

function createMap(earthquakes) {

  // Define streetmap
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWFyaWFuYWJyaW5rIiwiYSI6ImNqeDEwbGY0bjA0dzIzem56cnkydnU4dzgifQ.4-azSowM0gi2jegzXjr5-A." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  // Define a baseMaps
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object 
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map
  var myMap = L.map("map", {
    center: [
        43.8041, -120.5542
    ],
    zoom: 4.5,
    layers: [streetmap, earthquakes]
  });


  function getColor(d) {
      return d < 1 ? 'rgb(255,255,255)' :
            d < 2  ? 'rgb(255,255,255)' :
            d < 3  ? 'rgb(221,160,221)' :
            d < 4  ? 'rgb(218,112,214)' :
            d < 5  ? 'rgb(186,85,211)' :
            d < 6  ? 'rgb(186,85,211)' :
            d < 7  ? 'rgb(153,50,204)' :
            d < 8  ? 'rgb(148,0,211)' :
            d < 9  ? 'rgb(139,0,139)' :
                        'rgb(139,0,139)';
  }

  // Create a legend 
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop 
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}