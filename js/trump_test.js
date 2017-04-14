var scrapeData;
var brandData;
var city_words;

var branded_bldgs_by_city = {};
var brands_by_city = {};

var city_list = ["New York City", "Atlantic City", "Jersey City", "Sunny Isles Beach", "Las Vegas", "Chicago", "Washington", "Toronto", "Vancouver", "Istanbul", "Panama", "Mumbai", "Makati", "Seoul"];
var list_position;
var currentCity;

function preload() {
  var skyscraper_csv = loadTable("../webscraping/skyscrapers_master.csv", "csv", "header", loadedCSV);
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  sortBrands(brandData);
  noLoop();
  imageMode(CORNER);
  list_position = 0;
}

function draw(){
  background(250);
  currentCity = city_list[list_position];
  textSize(24);
  text(currentCity, 50, 50);
  var brands = brands_by_city[currentCity];
  if(brands != null){
    for(var i = 0; i < brands.length; i++){
      var brand = brands[i];
      branded_bldgs_by_city[currentCity]
      var brand_bldgs = branded_bldgs_by_city[currentCity][brand];
      console.log(brand);
      console.log(brand_bldgs);
      textSize(12);
      var x = 50+100*i;
      text(brand, x, 75, 100, 100);
      for(var j = 0; j < brand_bldgs.length; j++){
        var building = brand_bldgs[j];
        building.u = i;
        building.v = j;
        var url = building.img;
        loadImage(url, function(img){
          // console.log(img);
          image(img, 50+100*building.u, 250, img.width, img.height);
        })
      }
    }
  }
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
  console.log(branded_bldgs_by_city);

}
