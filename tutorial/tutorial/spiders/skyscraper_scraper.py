import scrapy

class SkyscraperScraper(scrapy.Spider):
    name = "skyscraper"
    start_urls = [
        'http://skyscraperpage.com/diagrams/links/',
    ]

    def parse(self, response):
        page = response.url.split("/")[-2]
        filename = 'skyscraper-%s.html' % page
        with open(filename, 'wb') as f:
            f.write(response.body)
