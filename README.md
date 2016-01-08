# tokmz

Convert GeoJsons into KMZ file with layer structure.

![kmz](http://i68.tinypic.com/14bonls.png)

## Installation

``` javascript
npm install tokmz
```

## Function

The package provide a promised function

* **tokmz**(geojsons, fileName, options)

    Parameters:

    * geojsons    -   organized GeoJson layers.

    * fileName    -   file name of saved kmz file. If undefined/null, the function will return an object that is ready to be written into file.

    * options     -   optional settings:

        * promiseLib - specified promise library. If undefined, the native Promise will be used.

tokmz() accepts GeoJsons organized using two elements:

* folder

``` javascript
{
    type: 'folder',
    name: 'name_of_folder',
    content: []    // an array containing subfolders and layers
}
```

* layer

```javascript
{
    type: 'layer',
    name: 'name_of_layer',
    features: geojson_object,
    options: {
        symbol: feature_symbol,
        name: feature_name_attribute // in geojson.properties
    }
}
```

Detail about defining feature symbol can be found at [**gtran-kml**](https://github.com/haoliangyu/gtran-kml).

## Sample

```javascript
var tokmz = require('tokmz');

var polygonJson, polygonSymbol, pointJson, pointSymbol, polylineJson, polylineSymbol;

// Some codes to load all GeoJsons and symbols

var layers = [
    { type: 'folder', name: 'test', content: [
        { type: 'layer', name: 'polygon_layer', features: polygonJson, options: {symbol: polygonSymbol, name: 'Name'} }
    ] },
    { type: 'layer', name: 'point_layer', features: pointJson, options: { symbol: pointSymbol, name: 'Name' } },
    { type: 'layer', name: 'polyline_layer', features: polylineJson, options: { symbol: polylineSymbol, name: 'Name'} }
];

tokmz(layers, 'test.kmz', {
    // if necessary
    promiseLib: require('bluebird')
})
.then(function(fileName) {
    console.log('KMZ file is saved at ' + fileName);
})
.catch(function(err) {
    console.error(err);
});
```
