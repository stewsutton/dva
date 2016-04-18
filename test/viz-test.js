"use strict";
const expect = require('chai').expect;
const Viz = require('../src/viz');
const sinon = require('sinon');
var sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);
const axios = require('axios');

describe("viz.extensions", function() {
  it("resolves with the given extension", function() {
    let viz = Viz()
    return viz.extensions.load('test').then(function(ext) {
      expect(typeof ext.script.render).to.eq('function');
    })
  });

  it("keeps track of loaded extensions", function() {
    let viz = Viz()
    expect(viz.extensions.length).to.eq(0);
    return viz.extensions.load('test').then(function(ext) {
      expect(viz.extensions[0].name).to.eq('test');
      expect(viz.extensions.length).to.eq(1);
    })
  });

  it("loads the extension's schema", function() {
    let viz = Viz()
    return viz.extensions.load('test').then(function(ext) {
      expect(ext.schema["example"]).to.eq("stuff")
    })
  })
});

describe("viz.dataset", function() {
  var promise;
  beforeEach(function () {
    promise = sinon.stub(axios, 'get').returnsPromise()
  });

  afterEach(function () {
    axios.get.restore()
  });

  it("resolves data by DataSet ID", function() {
    let viz = Viz();
    let data = { some: "data" }
    promise.resolves(data)
    return viz.dataset.load(1).then(function(res) {
      var path = promise.getCall(0).args[0];
      expect(path).to.eq('/datasets/1');
      expect(res).to.deep.eq(data);
    })
  });
});