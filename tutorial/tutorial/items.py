# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class Skyscraper(scrapy.Item):
    # define the fields for your item here like:
    name = scrapy.Field()
    city = scrapy.Field()
    height = scrapy.Field()
    year = scrapy.Field()
    file_urls = scrapy.Field()
    files = scrapy.Field()
    # pass
