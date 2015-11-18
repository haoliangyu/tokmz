'use strict';

var et = require('elementtree');
var kml = require('gtran-kml');
var JSZip = require('jszip');
var promiseLib = require('./promise.js');
var fs = require('fs');

module.exports = function(layers, fileName, options) {
    if(options) {
        var Promise = promiseLib.set(options.promiseLib);
    }

    var taskList = [];
    generateTaskList('doc', layers, taskList);

    return Promise.all(taskList)
    .then(function(results) {
        var zip = JSZip();

        var root = et.Element('kml');
        root.attrib.xmlns = 'http://www.opengis.net/kml/2.2';

        var doc = et.SubElement(root, 'Document');

        results.forEach(function(result) {
            var fullPath = result.directory + '/' + result.fileName + '.kml';

            zip.file(fullPath, result.data);

            var folderNode = getFolder(doc, result.directory.substring(4));
            if(!folderNode) {
                folderNode = createFolder(doc, result.directory.substring(4));
            }

            var networkLink = et.SubElement(folderNode, 'NetworkLink');

            var name = et.SubElement(networkLink, 'name');
            name.text = result.fileName;

            var link = et.SubElement(networkLink, 'Link');
            var href = et.SubElement(link, 'href');
            href.text = fullPath;
        });

        var xmlTree = new et.ElementTree(root);

        zip.file('doc.kml', xmlTree.write());
        var buffer = zip.generate({type:"nodebuffer"});

        return Promise.resolve(buffer);
    })
    .then(function(zip) {
        if(fileName) {
            fs.writeFile(fileName, zip, function(err) {
                if(err) { return Promise.reject(err); }

                return Promise.resolve(fileName);
            });
        } else {
            return Promise.resolve(zip);
        }
    });
};

function generateTaskList(filePath, layers, taskList) {
    layers.forEach(function(item) {
        if(item.type === 'layer') {
            var task = kml.fromGeoJson(item.features, null, {
                symbol: item.symbol
            })
            .then(function(result) {
                return Promise.resolve({
                    directory: filePath,
                    fileName: item.name,
                    data: result.data
                });
            });

            taskList.push(task);
        } else {
            generateTaskList(filePath + '/' + item.name, item.content, taskList);
        }
    });
}

function getFolder(node, path) {
    if(!path) { return node; }

    var xpath = '.';
    path.split('/').forEach(function(folder) {
        xpath += "Folder[@name='" + folder + "']";
    });

    return node.find(xpath);
}

function createFolder(root, path) {
    var folders = path.split('/');

    var node = root;
    for(var i = 0, maxLen = folders.length; i < maxLen; i++) {
        var matchNode = node.find("./Folder[@name='" + folders[i] + "']");

        if(!matchNode) {
            matchNode = et.SubElement(node, 'Folder');
            matchNode.attrib.name = folders[i];

            var name = et.SubElement(matchNode, 'name');
            name.text = folders[i];
        }

        node = matchNode;
    }

    return node;
}
