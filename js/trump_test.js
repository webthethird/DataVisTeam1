// This code was made for a graduate course at Columbia University  //
// entitled Data Viz for Architecture, Urbanism and the Humanities  //
// by Juan Francisco Saldarriaga of the Center for Spatial Research //
// for info: https://github.com/juanfrans-courses/dataViz_arch_hum  //


// Global variables
var scrapeData;
var brandData;
var city_words;
var list_position;
var prevPosition;
var currentCity;
var nextCity;
var prevCity;
var brands;

// Global containers
var branded_bldgs_by_city = {};
var brands_by_city = {};
var bldgs_by_city = {};
var city_list = ["New York City", "Atlantic City", "Sunny Isles Beach", "Las Vegas", "Chicago", "Toronto", "Vancouver", "Istanbul", "Panama", "Mumbai", "Makati", "Seoul"];
var tables = {};

// Canvas variables
var ht_factor = 1;
var margin;
var col_width;
var originY;
var maxHeight;

function preload() {
  // First loads table of skyscrapers scraped from SkyscraperPage.com,
  // Callback function loadedCSV() triggers loadJSON() of top brands/developers per city
  // Finally, loadedJSON() triggers sortBrands(), which matches brands/developers to buildings from database
  var skyscraper_csv = loadTable("../webscraping/skyscrapers_master.csv", "csv", "header", loadedCSV);
}

function setup(){
  // Create canvas and place it within the empty div called 'sketch-holder'
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
  // sortBrands(brandData);
  imageMode(CORNERS);
  // Set some global variables for convenience
  originY = windowHeight - 100;
  maxHeight = 1000;
  list_position = 0;
  // Identify navigation buttons and set click functions
  nextCity = select('#next');
  prevCity = select('#prev');
  nextCity.mousePressed(loadNextCity);
  prevCity.mousePressed(loadPrevCity);
  // Create html tables and place them beneath each city header
  // for (var i = 0; i < city_list.length; i++) {
  //   var city = city_list[i];
  //   var table = createElement('table');
  //   var tbody = createElement('tbody');
  //   var tfoot = createElement('tfoot');
  //   cityshort = city.replace(/\s/g,'');
  //   table.id(cityshort + "Table");
  //   table.class("table");
  //   tbody.style('vertical-align', 'bottom');
  //   table.parent(cityshort);
  //   table.child(tfoot);
  //   table.child(tbody);
  //   tables[city] = {"table": table, "tbody": tbody, "tfoot": tfoot, "brands": []};
  // }
  noLoop();
}

function draw(){
  margin = max(int(windowWidth*0.05),25);
  currentCity = city_list[list_position];
  background(250);
  removeElements();
  // drawGraph();
  loadCity();
}

function drawGraph(){
  textSize(24);
  textAlign(CENTER);
  text(currentCity, windowWidth/2, windowHeight - 50);
  line(margin, originY, windowWidth - margin, originY);
  line(margin, originY, margin, margin);
  console.log(originY);
  console.log(windowHeight);
  console.log(maxHeight);
  for (var y = 0; y < maxHeight; y += 100) {
    var yOffset = originY - (y * ht_factor);
    stroke(0);
    line(margin, yOffset, margin - 5, yOffset);
    stroke(150);
    line(margin, yOffset, windowWidth - margin, yOffset);
    textSize(12);
    textAlign(RIGHT);
    var string = y + " m ";
    text(string, margin, yOffset);
  }
}

function loadCity() {
  brands = brands_by_city[currentCity];
  if (bldgs_by_city[currentCity] == undefined) {
    bldgs_by_city[currentCity] = [];
  }
  // console.log(brands);
  col_width = (windowWidth - 2*margin)/brands.length;
  for(var i = 0; i < brands.length; i++){
    var brand = brands[i];
    var brand_bldgs = branded_bldgs_by_city[currentCity][brand];
    // console.log(brand);
    // console.log(brand_bldgs);
    textSize(14);
    textAlign(CENTER);
    var x = margin + col_width*i;
    text(brand, x, windowHeight-90, 100, 100);
    getImages(brand_bldgs, i);
  }
  prevPosition = list_position;
}

function loadNextCity() {
  if(list_position < (city_list.length - 1)) {
    list_position += 1;
  } else {
    list_position = 0;
  }
  maxHeight = 1000;
  ht_factor = min(1, windowHeight/maxHeight);
  console.log("reset height factor to "+ht_factor);
  redraw();
}

function loadPrevCity() {
  if(list_position == 0) {
    list_position = city_list.length - 1;
  } else {
    list_position -= 1
  }
  maxHeight = 1000;
  ht_factor = min(1, windowHeight/maxHeight);
  console.log("reset height factor to "+ht_factor);
  redraw();
}

function windowResized() {
  console.log("window resized!");
  resizeCanvas(windowWidth, windowHeight);
  maxHeight = 1000;
  ht_factor = min(1, windowHeight/maxHeight);
  console.log("reset height factor to "+ht_factor);
  redraw();
}

function loadedCSV(data) {
  // console.log(data);
  scrapeData = data;
  var brands_json = loadJSON("../webscraping/developers.json", loadedJSON);
}

function loadedJSON(data) {
  // console.log(data);
  brandData = data;
  sortBrands(brandData);
}

function sortBrands(brands) {
  for(var i = 0; i < brands.cities.length; i++){
    var city = brands.cities[i];
    var country = city.country;
    var cityname = city.name;
    var brand_list = city.developers;
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
          var nextHeight = 0;
          var brandname = brand_list[k];
          if (row.name.includes(brandname) || row.developer.includes(brandname)) {
            row.brandname = brandname;
            // console.log(row);
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
  buildings.forEach(function(building, j, bldgs){
    building.u = i;
    building.v = j;
    var url = building.img;
    if(!building.image){
      console.log("Loading image: " + building.name);
      loadImage(building.img, function(img){
        // console.log(building);
        img.loadPixels();
        building.image = img;
        building.width = img.width;
        building.height = img.height;
        building.yStart = nextHeight;
        nextHeight += building.height;
        branded_bldgs_by_city[currentCity][building.brandname][building.v] = building;
        bldgs_by_city[currentCity].push(building);
        if (nextHeight > maxHeight) {
          maxHeight = nextHeight*1.1;
          console.log("New max height: "+maxHeight);
          ht_factor = min(1, windowHeight/maxHeight);
          console.log("New height factor: "+ht_factor);
        }
        // console.log(building.u, building.v);
        if (building.u == brands.length - 1 && building.v == bldgs.length - 1) {
          console.log("last image loaded");
          drawGraph();
          drawImages();
        }
      })
    } else {
      nextHeight += building.height;
      if (nextHeight > maxHeight) {
        maxHeight = nextHeight*1.1;
        console.log("New max height: "+maxHeight);
        ht_factor = min(1, windowHeight/maxHeight);
        console.log("New height factor: "+ht_factor);
      }
      if (building.u == brands.length - 1 && building.v == bldgs.length - 1) {
        console.log("last image loaded");
        drawGraph();
        drawImages();
      }
    }
  })
}

function drawImages() {
  var buildings = bldgs_by_city[currentCity];
  console.log(buildings);
  for(var k = 0; k < buildings.length; k++){
    var building = buildings[k];
    var u = building.u;
    // var width = building.width;
    var width = min(col_width - 10, building.width);
    var height = int(building.height * ht_factor);
    var img = building.image;
    // console.log(building.image);
    var bot = originY - (building.yStart * ht_factor);
    var x = margin + col_width*u;
    if (img == null || img == undefined) return;
    if (building.brandname == "Trump") {

    }
    image(img, x, bot, x + width, bot - height);
  }
}

function drawImage(building) {
  var u = building.u;
  // var width = building.width;
  var width = min(col_width - 10, building.width);
  var height = int(building.height * ht_factor);
  var img = building.image;
  var bot = originY - (building.yStart * ht_factor);
  var x = margin + col_width*u;
  if (img == null || img == undefined) return;
  if (building.brandname == "Trump") {

  }
  image(img, x, bot, x + width, bot - height);
}
