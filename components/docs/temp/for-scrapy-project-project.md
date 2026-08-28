ownership: msrezaie
source_owner: Code The Dream
source_url: https://docs.google.com/document/d/1Z4ra_qSWn4TtCOBFoA1kZNdDefuKNjr2PKs8q2nJQko

**For scrapy project**

Tutorial resources (youtube):  
Scrapy:  
[https://www.youtube.com/watch?v=mBoX\_JCKZTE](https://www.youtube.com/watch?v=mBoX_JCKZTE)  
[https://www.youtube.com/playlist?list=PLRzwgpycm-Fjvdf7RpmxnPMyJ80RecJjv](https://www.youtube.com/playlist?list=PLRzwgpycm-Fjvdf7RpmxnPMyJ80RecJjv)

Python:  
[https://www.youtube.com/watch?v=6i3e-j3wSf0\&list=PL0Zuz27SZ-6MQri81d012LwP5jvFZ\_scc](https://www.youtube.com/watch?v=6i3e-j3wSf0&list=PL0Zuz27SZ-6MQri81d012LwP5jvFZ_scc)  
[https://www.youtube.com/watch?v=K5KVEU3aaeQ\&pp=ygUGcHl0aG9u](https://www.youtube.com/watch?v=K5KVEU3aaeQ&pp=ygUGcHl0aG9u)

City Scrapers Repo:  
[https://github.com/City-Bureau/city-scrapers-fortx/](https://github.com/City-Bureau/city-scrapers-fortx/)

City scrapers guide:  
Scraper building guide  
[https://docs.google.com/document/d/1KzNyd39IrUg0zkgp8\_Z-tVxCxicBU7pnxiX6fGeeIVk/edit?tab=t.0\#heading=h.k4y89kex3au5](https://docs.google.com/document/d/1KzNyd39IrUg0zkgp8_Z-tVxCxicBU7pnxiX6fGeeIVk/edit?tab=t.0#heading=h.k4y89kex3au5)

Scraper setup guide:  
[https://cityscrapers.org/docs/development/\#event-schema](https://cityscrapers.org/docs/development/#event-schema)

**Some Spider examples**

1. Spider that is done with a combination of GET request and CSS selectors

- [https://github.com/City-Bureau/city-scrapers-atconj/blob/main/city\_scrapers/spiders/atconj\_County\_Commission.py](https://github.com/City-Bureau/city-scrapers-atconj/blob/main/city_scrapers/spiders/atconj_County_Commission.py)

2. Spider that is done with a combination of GET and POST requests

- [https://github.com/City-Bureau/city-scrapers-fortx/blob/main/city\_scrapers/spiders/fortx\_Fort\_Worth\_City\_Council.py](https://github.com/City-Bureau/city-scrapers-fortx/blob/main/city_scrapers/spiders/fortx_Fort_Worth_City_Council.py)

3. Spider that is done with only CSS selectors

- [https://github.com/msrezaie/city-scrapers-wichita/blob/main/city\_scrapers/spiders/wicks\_sedgwick\_jcab.py](https://github.com/msrezaie/city-scrapers-wichita/blob/main/city_scrapers/spiders/wicks_sedgwick_jcab.py)

4. Spider that is done by a GET request with authentication

- [https://github.com/City-Bureau/city-scrapers-losca/blob/main/city\_scrapers/spiders/losca\_Public\_Works.py](https://github.com/City-Bureau/city-scrapers-losca/blob/main/city_scrapers/spiders/losca_Public_Works.py)

5. Spider that is done with ‘legister’ (package used for scrapping off of websites that make use [ASP.NET](http://ASP.NET) framework). [Documentation](https://cityscrapers.org/docs/development/#legistar)

- [https://github.com/City-Bureau/city-scrapers-losca/blob/main/city\_scrapers/spiders/losca\_Metro\_Transit.py](https://github.com/City-Bureau/city-scrapers-losca/blob/main/city_scrapers/spiders/losca_Metro_Transit.py)

6. Spider factory examples:
   1. [https://github.com/City-Bureau/city-scrapers-tulsa/pull/6](https://github.com/City-Bureau/city-scrapers-tulsa/pull/6)
   2. [https://github.com/City-Bureau/city-scrapers-colgo/pull/6](https://github.com/City-Bureau/city-scrapers-colgo/pull/6)

Scrapy helpful commands:  
**Venv setup**

- **Create**
  - py \-3.9 \-m venv .venv
- **Activate**
  - .\\venv\\Scripts\\Activate.ps1

**Scrapy** Notes

- **Spider** commands:
  - scrapy genspider spider\_Name “Agency Name” URL
  - scrapy crawl “name of spider” \-O test.json
  - scrapy validate “name of spider”
- **Format fix** commands:
  - pipenv run black . \--check
    - black “file path”
  - pipenv run isort . \--check
    - isort “file path”
  - pipenv run flake8 .
- **pytest** commands**:**
  - pytest: to run the python file from the tests folder
  - pytest \-k _method\_name_: to run only a specific method from within the test file
