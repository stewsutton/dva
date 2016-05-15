import sankeyDataPrep from "../../../src/extensions/com.brett.sankeyV2/sankey-data-prep.js";

describe("Sankey Data Preparation", function() {
  //no input test
  it("empty dataset returns empty preped dataset", function(){
    let result = sankeyDataPrep([]);
     expect(result).to.deep.eq({"nodes" : [], "links" :[]});  
  })
  
  //small input test
  it.skip("small dataset returns correct result", function(){
    let result = sankeyDataPrep(
      [{
      "source": "Barry",
      "target": "Elvis",
      "value" : 2
      }]);

    expect(result).to.equal({ 
      "nodes" : [{"name" : "Barry"}], 
      "links" :[{"source" : 0, "target":1, "value": 2}]}
    );
  
  it.skip("default behavior", function(){
    
  })
})
