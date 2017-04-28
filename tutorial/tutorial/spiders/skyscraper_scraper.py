from tutorial.items import Skyscraper
import scrapy

class SkyscraperScraper(scrapy.Spider):
    name = "skyscraper"
    start_urls = [
        'http://skyscraperpage.com/diagrams/?cityID=8',
    ]

    def parse(self, response):
        url = response.css()
