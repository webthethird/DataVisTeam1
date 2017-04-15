var scrapeData;
var brandData;
var city_words;

var branded_bldgs_by_city = {};
var brands_by_city = {};

var city_list = ["New York City", "Atlantic City", "Jersey City", "Sunny Isles Beach", "Las Vegas", "Chicago", "Washington", "Toronto", "Vancouver", "Istanbul", "Panama", "Mumbai", "Makati", "Seoul"];
var list_position;
var currentCity;
var brands;

var ht_factor = 0.5;
var margin;
var col_width;

function preload() {
  var skyscraper_csv = loadTable("../webscraping/skyscrapers_master.csv", "csv", "header", loadedCSV);
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  sortBrands(brandData);
  noLoop();
  imageMode(CORNERS);
  list_position = 0;
}

function draw(){
  background(250);
  margin = max(int(windowWidth*0.05),25);
  currentCity = city_list[list_position];
  textSize(24);
  // textAlign(CENTER);
  text(currentCity, windowWidth/2, 50);
  brands = brands_by_city[currentCity];
  if(brands != null){
    col_width = (windowWidth - 2*margin)/brands.length;
    console.log(col_width);
    for(var i = 0; i < brands.length; i++){
      var brand = brands[i];
      var brand_bldgs = branded_bldgs_by_city[currentCity][brand];
      // console.log(brand);
      // console.log(brand_bldgs);
      textSize(14);
      var x = margin + col_width*i;
      text(brand, x, windowHeight-50, 100, 100);
      getImages(brand_bldgs, i);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function loadedCSV(data) {
  // console.log(data);
  scrapeData = data;
  var brands_json = loadJSON("../webscraping/brand_frequency.json", loadedJSON);
}

function loadedJSON(data) {
  // console.log(data);
  brandData = data;
}

function sortBrands(brands) {
  for(var i = 0; i < brands.cities.length; i++){
    var city = brands.cities[i];
    var country = city.country;
    var cityname = city.name;
    var brand_list = city.common;
    // console.log(name);
    if(branded_bldgs_by_city[cityname] == null) {
      branded_bldgs_by_city[cityname] = {};
      brands_by_city[cityname] = [];
      for(var b = 0; b < brand_list.length; b++){
        var brand = brand_list[b];
        brands_by_city[cityname].push(brand);
        branded_bldgs_by_city[cityname][brand] = [];
      }
    }
    for(var j = 0; j < scrapeData.rows.length; j++){
      var row = scrapeData.rows[j].obj;
      if(row.city == cityname) {
        for(var k = 0; k < brand_list.length; k++){
          var brandname = brand_list[k];
          if (row.name.includes(brandname)) {
            row.brandname = brandname;
            branded_bldgs_by_city[cityname][brandname].push(row);
          }
        }
      }
    }
  }
  // console.log(branded_bldgs_by_city);
}

function getImages(buildings, i) {
  var nextHeight = 0;
  for(var j = 0; j < buildings.length; j++){
    var building = buildings[j];
    building.u = i;
    building.v = j;
    var url = building.img;
    if(!building.image){
      // console.log("Loading image: " + building.name);
      loadImage(url, function(img){
        // console.log(img);
        building.image = img;
        building.width = img.width;
        building.height = img.height;
        building.yStart = nextHeight * ht_factor;
        nextHeight += building.height;
        // console.log(building);
        drawImage(building, ht_factor);
      })
    }
  }

}

function drawImage(building, factor) {
  var u = building.u;
  // var width = building.width;
  var width = min(col_width - 10, building.width);
  var height = int(building.height * factor);
  var img = building.image;
  var bot = windowHeight - 75 - building.yStart;
  var x = margin + col_width*u;
  if (img == null || img == undefined) return;
  if (building.brandname == "Trump") {

  }
  image(img, x, bot, x + width, bot - height);
}
