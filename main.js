// Custom variables
var clickedCoord = []
var clickedCoord_lineString = []
//var geojsonobj = {}
//var HeatMapLayer,AttributeLayer,ClusterLayer,ClusterColorLayer,moveendfunction
// Define view layer



var view =  new ol.View({
    center:[4434288.936162015, 4825488.5058124615],
    zoom:6
    })


// Basemap layer
var basemapLayer = new ol.layer.Tile({
    source: new ol.source.OSM({
        layer:'terrain'
    })
  })
// Layers Array
var layerArray = [basemapLayer]
// Initiating Map

var point_loc = new ol.layer.Image({
  source: new ol.source.ImageWMS({
  url: 'https://wms.qgiscloud.com/Kardelen/kaman_roadss/',
  params: {'LAYERS': 'kaman_roads'},
  //serverType: 'qgiscloud'
  }),
   
});


var map = new ol.Map({
    target : 'mymap',
    view :view,
    layers: layerArray
})
map.addLayer(point_loc)




var jsonSource = new ol.source.Vector({
  url: 'https://raw.githubusercontent.com/Kardelennkayaa/ankr_tdelay/main/KAMAN.json',
  format: new ol.format.GeoJSON(),
});

var vector = new ol.layer.Vector({
  source: jsonSource,
  background: 'white',
});
map.addLayer(vector)

map.addInteraction(
  new ol.interaction.Snap({
    source: jsonSource,
    //pixelTolerance: 50,
  })
);
var jsonSource_ank = new ol.source.Vector({
  url: 'https://raw.githubusercontent.com/Kardelennkayaa/heroku_app/main/ankara_road.json',
  format: new ol.format.GeoJSON(),
});

var vector_ank = new ol.layer.Vector({
  source: jsonSource_ank,
  background: 'white',
});
map.addLayer(vector_ank)

map.addInteraction(
  new ol.interaction.Snap({
    source: jsonSource_ank,
    //pixelTolerance: 50,
  })
);
//var modify = new ol.interaction.Modify({
  //source: jsonSource
//});
//map.addInteraction(modify);

var modify = new ol.interaction.Modify({
  source: jsonSource
});
map.addInteraction(modify);

var modify_ank = new ol.interaction.Modify({
  source: jsonSource_ank
});
map.addInteraction(modify_ank);



const selectStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: '#eeeeee',
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(255, 255, 255, 0.7)',
    width: 2,
  }),
});


const status = document.getElementById('status');
let selected = null;
map.on('pointermove', function (e) {
  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }

  map.forEachFeatureAtPixel(e.pixel, function (f) {
    selected = f;
    selectStyle.getFill().setColor(f.get('COLOR') || '#eeeeee');
    f.setStyle(selectStyle);
    return true;
  });

  if (selected) {
    status.innerHTML = selected.get('ECO_NAME');
  } else {
    status.innerHTML = '&nbsp;';
  }
});




//  1. To define a source
var drawSource = new ol.source.Vector()
var drawSource_ls = new ol.source.Vector()


var drawLayer = new ol.layer.Vector({
    source:drawSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
          color: '#F61D1D',
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
            color: '#F61D1D',
          }),
        }),
    })      
})




// 4. Adding on map
map.addLayer(drawLayer)

var drawLayer_ls = new ol.layer.Vector({
    source:drawSource_ls,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
          color: '#F61D1D',
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
            color: '#F61D1D',
          }),
        }),
    })      
})
// 4. Adding on map
map.addLayer(drawLayer_ls)


// Initiate a draw interaction
var draw = new ol.interaction.Draw({
    type : 'Point',
    source:drawSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
          color: '#F61D1D',
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({
            color: '#F61D1D',
          }),
        }),
    })
})
draw.on('drawstart', function(evt){
    drawSource.clear()
})
draw.on('drawend',function(evt){
    clickedCoord = evt.feature.getGeometry().getCoordinates() 
    $('#pointadding').modal('show');
    console.log('clicked at', evt.feature.getGeometry().getCoordinates() )
    map.removeInteraction(draw)
})

// Function that enables draw interaction

function startDrawing(){
// add interaction to the map
map.addInteraction(draw)
}

// Adding LineString
var draw_lineString = new ol.interaction.Draw({
    type : 'LineString',
    source:drawSource_ls
 
})
draw_lineString.on('drawstart', function(evt){
    drawSource_ls.clear()
    //select.setActive(true);
})
draw_lineString.on('drawend',function(evt){
    // alert('point is added')
    clickedCoord_lineString = evt.feature.getGeometry().getCoordinates()
    
    $('#ls_adding').modal('show');
    console.log('clicked at', evt.feature.getGeometry().getCoordinates())
    map.removeInteraction(draw_lineString)
})

function startDrawing_lineString(){
// add interaction to the map


map.addInteraction(draw_lineString)
}

  
const clear = document.getElementById('clear');
clear.addEventListener('click', function() {
  drawSource.clear();
  drawSource_ls.clear();
}); 

const format = new ol.format.GeoJSON({featureProjection: 'EPSG:3857'});
const download = document.getElementById('download');
drawSource_ls.on('change', function() {
  const features = drawSource_ls.getFeatures();
  const json = format.writeFeatures(features);
  download.href = 'data:text/json;charset=utf-8,' + json;
});

function visualize() {
  location.replace("https://visualizelocation.herokuapp.com/")
}



function SaveDatatodb(){
    var location = document.getElementById('location').value;
    var recorder = document.getElementById('recorder').value;
    var clickedCoord_lonlat = ol.proj.toLonLat(clickedCoord)
    var long = clickedCoord_lonlat[0];
    var lat = clickedCoord_lonlat[1];
    var minibus_name = document.getElementById('minibus_name').value;
    if (location != '' && recorder != '' && long != '' && lat != '' && minibus_name != '' ){
        $.ajax({
            url:'save.php',
            type:'POST',
            data :{
                userloc : location,
                userrecorder : recorder,
                userlong : long,
                userlat : lat,
                userminibus_name : minibus_name
            },
            success : function(dataResult){
                var dataResult = JSON.stringify(dataResult);
                if (dataResult.statusCode == 200){
                    
                    $('#pointadding').modal('hide');
                } else {
                    
                }
            }
        })
        alert('Point is added')
    } else {
        alert('Please fill complete information')
    }


}

function SaveDatatodb_lineString(){
    var location = document.getElementById('location_ls').value;
    var recorder = document.getElementById('recorder_ls').value;
    var feature = drawSource_ls.getFeatures();
    var geometry = feature[0].getGeometry();
    var distance = geometry.getLength();
    var featureArray = drawSource_ls.getFeatures()
    var format = new ol.format.GeoJSON();
    var json = format.writeFeaturesObject(featureArray);
    var geojsonFeatureArray = json.features
    var geom = JSON.stringify(geojsonFeatureArray[0].geometry)
    var minibus_name = document.getElementById('minibus_name_ls').value;
    if (location != '' && recorder != '' && geom != '' &&  minibus_name != '' &&  distance != '')   {
        $.ajax({
            url:'save_ls.php',
            type:'POST',
            data :{
                userloc : location,
                userrecorder : recorder,
                user_distance : distance,
                user_json : geom,
                userminibus_name : minibus_name
            },
            success : function(dataResult2){
                var dataResult2 = JSON.stringify(dataResult2);
                if (dataResult2.statusCode == 200){
                    
                    $('#ls_adding').modal('hide');
                } else {
                    
                }
            }
        })
        alert('LineString is added')
    } else {
        alert('Please fill complete information')
    }


}

