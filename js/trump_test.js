var scrapedata;
var skyscraper_csv;
var city_words;
var brands;
var brands_json;

var branded_bldgs_by_city = {};


function preload() {
  skyscraper_csv = loadTable("../webscraping/skyscrapers_master.csv", "csv", "header", loadedCSV);
}

function setup(){
  createCanvas(windowWidth, windowHeight);
}

function draw(){
  background(200);
}

function loadedCSV(data) {
  // console.log(data);
  scrapedata = data;
  brands_json = loadJSON("../webscraping/brand_frequency.json", sortBrands);

}

function sortBrands(brands) {
  for(var i = 0; i < brands.cities.length; i++){
    var city = brands.cities[i];
    var country = city.country;
    var cityname = city.name;
    var brand_list = city.common;
    // console.log(name);
    if(branded_bldgs_by_city[cityname] == null) {
      branded_bldgs_by_city[cityname] = [];
    }
    for(var j = 0; j < scrapedata.rows.length; j++){
      var row = scrapedata.rows[j].obj;
      if(row.city == cityname) {
        for(var k = 0; k < brand_list.length; k++){
          var brandname = brand_lisk[k];
          var bldg_by_brand
          if (row.name.includes(brandname)) {
            // console.log(row);
            branded_bldgs_by_city[cityname].push(row);
          }
        }
      }
    }
  }
  console.log(branded_bldgs_by_city);

}
