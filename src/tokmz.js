'use strict';

var et = require('elementtree');
var kml = require('gtran-kml');
var JSZip = require('jszip');
var promiseLib = require('./promise.js');
var fs = require('fs');

module.export = function(layers, fileName, promiseLib) {
    var Promise = promiseLib.set(promiseLib);
    var taskList = [];
    generateTaskList('doc/', layers, taskList);

    Promise.all(taskList)
    .then(function(results) {
        var zip = JSZip();

        var root = et.Element('kml');
        root.attrib.xmlns = 'http://www.opengis.net/kml/2.2';

        var doc = et.SubElement(root, 'Document');

        results.forEach(function(result) { =
            var fullPath = result.directory + '/' + result.fileName + '.kml';

            zip.file(fullPath, result.data);

            var folderNode = getFolder(root, result.directory);
            if(!folderNode) {
                folderNode = createFolder(root, result.directory);
            }

            var networkLink = et.SubElement(folderNode, 'NetworkLink');

            var name = et.SubElement(networkLink, 'name');
            name.text = result.name;

            var link = et.SubElement(networkLink, 'Link');
            var href = et.SubElement(link, 'href');
            href.text = fullPath;
        });

        return Promise.resolve(zip);
    })
    .then(function(zip) {
        if(fileName) {
            fs.writeFile(fileName, data, function(err) {
                if(err) { return Promise.reject(err); }

                return Promise.resolve(fileName)
            });
        } else {
            return Promise.resolve(zip);
        }
    });
};

function generateTaskList(filePath, layers, taskList) {
    layers.forEach(layers, function(item) {
        if(item.type === 'layer') {
            var task = kml.fromGeoJson(item.features, {
                symbol: item.symbol
            })
            .then(function(result) {
                return Promise.resolve({
                    directory: filePath,
                    fileName: layer.name,
                    data: result.data
                });
            });

            taskList.push(task);
        } else {
            generateTaskList(filePath + '/' + item.name, item.children, taskList);
        }
    });
}

function getFolder(root, path) {
    var xpath = '.';
    path.split('/').forEach(function(folder) {
        xpath += "/Folder[@name='" + folder + "']";
    });

    return root.find(xpath);
}

function createFolder(root, path) {
    var folders = path.split('/');

    var node = root;
    for(var i = 0, maxLen = folders.length; i < maxLen; i++) {
        var matchNode = node.find("./Folder[@name='" + folders[i] + "']");

        if(!matchNodes) {
            matchNode = et.SubElement(node, 'Folder');
            matchNode.attri.name = folder[i];

            var name = et.SubElement(matchNodes, 'name');
            name.text = folder[i];
        }

        node = matchNode;
    }

    return node;
}
