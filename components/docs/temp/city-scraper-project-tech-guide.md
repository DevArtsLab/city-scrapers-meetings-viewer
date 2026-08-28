# **City Scraper Project \- Tech Guide**

[📔 THE DOCUMENTERS NETWORK](#📔-the-documenters-network)

[Who we are](#who-we-are)

[Why we scrape](#why-we-scrape)

[⚙️ TECH](#⚙️-tech)

[Overview](#architecture)

[A city scraper repo](#a-city-scraper-repo)

[A spider](#a-spider)

[Spider class](#spider-class)

[Parse method](#parse-method)

[Returned data](#returned-data)

[General expectations and tips](#expectations-and-tips)

[Code quality](#code-quality)

[General guidance](#general-guidance)

[Helpful tools](#helpful-tools)

[Starting a new city-scrapers repo](#starting-a-new-city-scrapers-repo)

[Types of scrapers](#🕸️-scraper-types)

## **📔 THE DOCUMENTERS NETWORK**

### **Who we are**

The city-scraper project is operated by the Documenters Network, which is a national network for grassroots participatory media. We have more than a dozen sites in our network with more joining each year. Each site is essentially a newsroom or journalism lab. Some of our partners include:

[Canopy Atlanta](https://canopyatlanta.org/)  
[The Dallas Free Press](https://dallasfreepress.com/)  
[Signal Cleveland](https://signalcleveland.org/)

Each newsroom/lab in our network is fueled largely by citizen journalism, which is facilitated by our platform, [Documenters.org](https://www.documenters.org/). The platform allows newsroom managers to make assignments and pay citizens for recording and taking notes on local government meetings that would otherwise go uncovered and unattended \- a crisis for local democracy.

### **Why we scrape**

The Documenters.org platform is powered by public meeting information that the Documenters Network has been **scraping** from public agency websites since 2018\. We call this effort the [city scrapers project](https://cityscrapers.org/).

When a newsroom/lab joins our network, they provide us a list of local government agencies in their community (eg. city government, county government, local boards) and we build scrapers to extract meeting information from those websites. The information tends to be pretty basic: time and date of the meeting, location, and agenda information and meeting minutes if available.

Our partners routinely provide us with requests for new scrapers and requests to fix existing ones that have broken due to changes to a website’s page structure.

## **⚙️ TECH**

### **Architecture**

Each cluster of scrapers for a Documenters Network partner site is stored in a Github repo and triggered by a scheduled Github workflow each day.

After each scraper is triggered, the scraper exports a JSON file with that public agency’s meetings to an Azure container. Documenters.org, which is largely hosted on Heroku, retrieves those files and loads them into its database to power its frontend and backend.  
![][image1]

### **A city scraper repo**

A typical city-scraper project is built from [a template](https://github.com/City-Bureau/city-scrapers-template) that was developed by the Documenters Network. Each project typically was written for python 3.6 to 3.11 and dependencies are managed using [pipenv](https://pipenv.pypa.io/en/latest/).

Each project is implemented using the [Scrapy](https://scrapy.org/) framework, a popular framework for writing python-based web scrapers because of its ability to execute scrapes in parallel. Scrapy makes heavy use of [Twisted](https://twisted.org/) under the hood. A typical scrapy project is structured like this. We generally follow the same pattern in our repos:  
![][image2]

In a nutshell, each of our repos contain:

- **spiders**: A collection of scrapers – known as “spiders” in Scrapy parlance – with each file representing a single spider.
- **tests:** Each spider typically has a testing suite stored in a separate tests directory.
- **workflows/:** A handful of Github workflows, including the daily scrape for production
- **dev tools:** pipenv configuration and standardized linting/formatting tools (black, flake8 and isort)

In conjunction with Scrapy, each repo relies on two primary Python packages developed by the Documenters Network to provide some common Scrapy configuration, extensions and helpers:

- [city-scrapers-core](https://github.com/City-Bureau/city-scrapers-core): ensures data is processed and exported by each spider based on a common schema that meets Documenters.org’s needs.
- [scrapy-sentry-errors](https://github.com/City-Bureau/scrapy-sentry-errors): ensures spider-level errors are properly captured and reported to Sentry.

Here are some examples of typical city-scraper repos:

- [city-scrapers-philly](https://github.com/City-Bureau/city-scrapers-philly): Scrapers for Philly Resolve (Philadelphia, PA)
- [city-scrapers-cleveland](https://github.com/City-Bureau/city-scrapers-cle): Scrapers for Signal Cleveland (Cleveland, OH)
- [city-scrapers-det](https://github.com/City-Bureau/city-scrapers-det): Scrapers for Outlier Media (Detroit, MI)

### **A spider**

A typical spider targets a webpage that contains information on public meetings for a specific local government agency (eg. Chicago City Hall) and returns a list of information about upcoming meetings. If it’s easy to target, we also typically return a month or two of prior meetings in the same list. We do this because agencies sometimes update past meeting information with additional documents (eg. meeting minutes) that can be good to collect. The primary target, however, is upcoming meetings.

To collect this, our spider will typically parse the HTML from that page and, if needed, make requests to additional pages to parse further information. In many cases, an agency includes a single page with some information (eg. meeting title and start date) but we need to navigate to a “detail page” for that meeting in order to extract other information.

Our spiders, like the repos themselves, are structured like most [Scrapy-based](https://docs.scrapy.org/en/latest/topics/commands.html) projects with a single file representing a single spider. They’re triggered using Scrapy’s CLI command:

scrapy crawl \<spider-name\>

Here’s [an example spider](https://github.com/City-Bureau/city-scrapers-cle/blob/45b7f57a1dcaa019db8233aff5ac4bac77e78b5c/city_scrapers/spiders/cle_cpc.py) for Cleveland.

Our spiders typically follow these patterns:

#### **Spider class**

A subclass of the [CityScrapersSpider](https://github.com/City-Bureau/city-scrapers-core/blob/741d7c00dd002390a0e21c25ba16ce001481fbf8/city_scrapers_core/spiders/spider.py) base class declared in city-scrapers-core, which itself is a subclass of Scrapy’s Spider class. This class contains all of the logic for the scraper. Attributes unique to the spider are declared in the class declaration, like spider name, agency name and the timezone of the locality.  
![][image3]

#### **Parse method**

The primary method that processes the initial response, typically yielding the scraped data or yielding to another method that traverses to a different webpage.  
![][image4]

#### **Returned data**

The spider is expected to ultimately yield the following fields representing information on a single meeting:

**id (string)**  
Unique identifier for meeting. Typically set by CityScrapersSpider’s \_get\_id method.

**title (string)**  
Title of the meeting (e.g., “Regular council meeting”).

**description (string)**  
Specific meeting description; empty string if unavailable.

**classification (string)**  
Type of meeting, based on predefined constants (eg. COUNCIL). UNCLASSIFIED if can’t be determined.

**status (string)**  
Meeting’s current status, based on predefined constants (eg. TENTATIVE, PASSED, CANCELED). Typically set by CityScrapersSpider’s \_get\_status method.

**start (datetime)**  
Naive datetime representing meeting start date and time.

**end (datetime or None)**  
Naive datetime representing meeting end date and time. Often unavailable.

**all\_day (boolean)**  
Boolean for all-day events. Typically False.

**time\_notes (string)**  
If needed, a note about the meeting time. Empty string otherwise. Typically empty string.

**location (dict)**  
Name and address for the meeting place. Example: {"name": "City Hall", "address": "1234 Fake St, Chicago, IL 60601"}

**links (list of dicts)**  
List of dictionaries with title and href for relevant links (eg. agenda, minutes). Empty list if no relevant links are available.

**source (string)**:  
URL for the page the meeting was scraped from (eg. "www.localgovtsite.gov/meeting/2024-01-01-regular-meeting.html"

You can read more about our schema [here](https://cityscrapers.org/docs/development/#event-schema) in our docs.

The best way to understand our scrapers, of course, is to write one. Although dated, our [documentation](https://cityscrapers.org/) should still provide an accurate guide on how to [create a new spider](https://cityscrapers.org/docs/development/) in a city-scraper project and how to trigger it.

### **Expectations and tips**

#### **Code quality**

For a PR with completed spider or spiders, we generally expect:

- Little to no dead code
- Each spider has a testing suite or its core logic (ie. in a mixin) has a testing suite
- All tests pass
- All CI process passes
- Docstrings and comments are provided in areas of the code where they may be needed
- Code is correctly formatted based on black, isort and flake8 settings
- Code is clean and readable
- When you run \`scrapy validate \<spider-name\>\` locally, returned data conforms to our schema

#### **General guidance**

- **Robots.txt:** By default, if a website’s robots.txt file says the web owner doesn’t want the website scraped, scrapy will respect that. Our policy is that public meeting data is public information. A public agency website or a website operated by a contractor for that agency that contains the agency’s meeting data is, in our opinion, fair to scrape. If you encounter a website that prohibits scraping in its Robots.txt file, then override Scrapy’s default setting for that spider like this spider [here](https://github.com/City-Bureau/city-scrapers-cle/blob/905d338731d1c24d700ffb6984fac3cf8ec7572c/city_scrapers/spiders/cle_building_standards.py#L13).
- **Minimum data:** Although it’s nice to capture data for all the details in our event schema, this often isn’t possible. Some agency websites are particularly bare bones, including little more than a date for each meeting. Sometimes this means a scrape isn’t worth doing at all (see “not worth scraping?” for guidance). Assuming the scrape is a priority for us, extracting simply a bunch of meeting start dates and then combining with a hardcoded meeting time may be enough to justify a scrape. Other fields, like location and meeting title, can be hardcoded. Look at our other spiders as examples.
- **Agendas:** We love to extract links to meeting agendas, but this often isn’t possible. When agenda links are available, sometimes scraping them increases the complexity of the spider and its brittleness to a point that isn’t worth it. Make a reasonable judgment call here. If there is a separate page on the website with links to agendas and meeting minutes, it might be worth hardcoding this among the links returned by the spider.
- **Not worth scraping?:** If you’ve been assigned to build a scraper and it appears the assigner has already scoped out the target site (ie. explained it’s a priority or provided some tips about scraping it) then it’s probably safe to assume that we want a scraper to be built. But if you’ve been provided a list of target agencies and you are doing the scoping yourself, you may discover a website contains little information on each meeting, few meetings, and is poorly structured for scraping (ie. details are in PDFs or highly unstructured text). In these cases, it’s a completely legitimate decision to recommend to the assignee that we DO NOT scrape the agency’s website. These judgment calls are more art than science. In general, we do not want to build scrapers that are going to break in only a year’s time and, in general, provide information that could have simply been manually entered by one of our network partners in less than 10 minutes. Here’s an example, for instance, of a webpage that we determined [wasn’t worth scraping](https://www.essex.edu/2022-public-meeting-calendar/). Talk with the Documenters Network or the scrape requester if you have doubts about the benefits of a scrape.
- **Time range:** As you build a spider, you’re often faced with a decision about how much of an agency’s meeting data you should scrape. This is particularly true when you have access to a JSON endpoint and can set the range with query params. Ideally, if it’s easy to do, try to capture all meetings prior to the current date and all meetings over the next to 6-12 months. If this isn’t possible, just take what you can get. Even scraping the next 1-5 upcoming meeting dates is useful data. In general, it’s not worth over-engineering a spider for the sake of a few extra months of meeting data.
- **Fluff:** Agency’s sometimes include events like community picnics and holidays. Whenever possible, do your best to filter out these kinds of events. We ideally only want public meetings

#### **Helpful tools**

- **Generative Code:** Writing scrapers can be highly repetitive. We encourage using ChatGPT or Github co-pilot as much as possible to speed up development time. They can be particularly useful for writing tests.
- **Postman:** If you don’t already use it, [Postman](https://www.postman.com/) is a wonderful tool to test requests to URLs and view responses.
- **Network traffic:** As general advice, when scoping out an agency’s website, we highly recommend always looking at a site’s network traffic in your browser’s dev tools to see if there are JSON or XML endpoints that can be targeted instead of parsing the HTML response.

### **Starting a new city-scrapers repo**

\<Details to come\>

## **🕸️ SCRAPER TYPES**

Although they share a common structure, how a spider handles parsing can vary widely depending on how the agency renders meeting information. Meeting websites vary from modern to ancient. Here are some typical types of scrapes for us:

**Static HTML**  
Websites that display all relevant data on a single page with minimal or no JavaScript.  
Example spiders: [Development Authority of Fulton County](https://github.com/City-Bureau/city-scrapers-atl/blob/28497d16c99ca2bff24119391baffbb54a96c737/city_scrapers/spiders/atl_dafc.py)

**Multi-page**  
Websites where meeting data is spread across multiple pages, typically requiring traversal from a list of meetings on a primary page to a “detail page” where data on a specific meeting is stored.  
Example spiders: [Cleveland Community Police Commission](https://github.com/City-Bureau/city-scrapers-cle/blob/45b7f57a1dcaa019db8233aff5ac4bac77e78b5c/city_scrapers/spiders/cle_cpc.py), [Pace Suburban Bus Services](https://github.com/City-Bureau/city-scrapers/blob/a144119dd6c85a34ef7f18ffc01aa910274f2cd6/city_scrapers/spiders/cook_pace_board.py)

**API-driven (JSON, XML)**  
Agencies that use REST APIs to populate meeting info on their page, allowing for direct HTTP requests for JSON or XML. This is a common pattern on JavaScript heavy websites (a typical JAM stack approach).  
Example spiders: [Chicago City Council](https://github.com/City-Bureau/city-scrapers/blob/3066a5f227e78fb08aa028a855e355c2f5c460c8/city_scrapers/spiders/chi_citycouncil.py), [Philadelphia Board of Education](https://github.com/City-Bureau/city-scrapers-philly/blob/d2aa1e9f222c375c041135cc7f4676cb777fd79d/city_scrapers/spiders/phipa_boe.py)

**iCalendar**  
Similar to API-driven, some agencies provide links or endpoints to calendar feeds that follow the [RFC 5545 spec](https://www.ietf.org/rfc/rfc5545.txt). This data is generally nicely structured and typically easy to parse.  
Example spiders: [Wichita Independent Neighborhoods](https://github.com/City-Bureau/city-scrapers-wichita/pull/12), [Detroit Detroit Public Schools Community District](https://github.com/City-Bureau/city-scrapers-det/blob/1491c90d64de1940ec74aeceafbb1bca0297734f/city_scrapers/spiders/det_board_of_education.py)

**Dynamic Website**  
Sites that use JavaScript for content rendering, necessitating tools like Playwright or Selenium in conjunction with Scrapy to interact with dynamic content.

**PDF or Image-based**  
Meetings details are in PDFs or images, generally requiring OCR packages like pdfminer in conjunction with Scrapy. In many cases, it may not be worth building a scraper for this agency.
