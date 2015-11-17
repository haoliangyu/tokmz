var tokmz = require('../src/tokmz.js');
var fs = require('fs');
var logger = require('log4js').getLogger();
var bluebird = require('bluebird');

var chai = require('chai');
var expect = chai.expect;

describe('Testing tokmz()', function() {

    var fileName = 'test/result/test.kmz';

    var pointSymbol = {
        color: '#2dcd86',
        alpha: 255,
        scale: 1,
        icon: 'http://maps.google.com/mapfiles/kml/shapes/square.png'
    };

    var polygonSymbol = {
        color: [255, 0, 0],
        fill: true,
        outline: false
    };

    var polylineSymbol = {
        color: '#2dcd86',
        width: 2
    };

    var layers = [
        { type: 'folder', name: 'test', content: [
            { type: 'layer', name: 'polygon_layer', features: undefined }
        ] },
        { type: 'layer', name: 'point_layer', features: undefined },
        { type: 'layer', name: 'polyline_layer', features: undefined }
    ];

    it('should save the object array as a KML file with Q.', function() {
        gtran.setPromiseLib(bluebird);
        gtran.fromGeoJson(layers, fileName)
        .then(function(file) {
            expect(fs.statSync(fileName)).to.exist;
        })
        .catch(function(err) {
            logger.error(err);
        });
    });

});
