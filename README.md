# scraping-nodejs
Using the nodejs, cheerio and  axios  to scraping data from a dealership website. 
Run the following code in the terminal

```powershell
npm i cheerio
npm i node-fetch
npm i axios

```

## I am going to Scrape the following Polish Truck rental company website called OTOMOTO


```jsx
const url = 'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc';

const response = await fetch(url);
const body = await response.text();

let $ = load(body);
```



### 1. Add getNextPageUrl function to iterate over pages




```jsx
npm init -y
npm i axios express cheerios

"scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
```

```jsx
import axios from "axios"
import cheerio from "cheerio"
import express from "express"

const PORT = process.env.PORT || 5000
const app = express()

const URL = 'https://www.manchestereveningnews.co.uk/sport/football/'

axios(URL)
    .then(res => {
        const htmlData = res.data
        const $ = cheerio.load(htmlData)
```

## Let’s begin

1. Lets check if the code runs


)

This checks the pagination list at the bottom of the list



Get the total count of each pages

Get the item id and each url for each of the product

This function creates a dictionary of each individual truck information.

- [ ]  `getNextPageUrl` function
- [ ]  `addItem` function
- [ ]  `scrapeTruckItem` function
- [ ]  `getTotalAdsCount` function

### The basic idea NOW

1. The `getNextPageUrl` first helps us iterate through each of the `base_url` with the index page at the end. They find the 'href' attribute of each pages in the pagination list

```jsx
 const nextPageLink=$('ul.pagination-list li').find('a').attr('href')

```

              

<aside>
💡 The function returns a list of urls available during pagination.  Now we need to parse each of the urls to get the number of items of

</aside>

1. The `addItem` function is responsible for extracting the id and url of each item. The url is then passed as a parameter to another funciton  `scrapeTruckItem` that takes in the url of each individual truck and scrapes through them.


```jsx
function addItems(val) {
            
    $('main article').map((idx, elm) => {
        const item_id = $(elm).attr('id')
        const item_url = $(elm).find('a').attr('href')
        
        const article = {
            'item_id': item_id,
            'url': item_url,
            
        }
        
        articles.push(article)
        // console.log(articles)
        scrapeTruckItem(article['url'])
        
    })
}
```

1. The `scrapeTruckItem` iterates through each url and scrapes each vehicle information listed. 
    1. item id
    2. title
    3. price
    4. registration date
    5. production date
    6. mileage
    7. power
    
    The item informations are then saved in the form in a dictionary.And passed along to a list(`parsedResults`) containing all the information of the items.
    
```jsx
let scrapeTruckItem  =async (url)=>{
    const res=await axios.get(url)
    const $=load(res.data)
    const truck_datas=[]
    const truck_id=$('#ad_id').text()
    // console.log(truck_id)
    const title=$('span.offer-title').text().trim()
    const price=$('span.offer-price__number').text().slice(0,8)
    const registration_date=$('span.offer-meta__value').text().slice(7,27)
    const span_offer=$('span.offer-main-params__item').text().replace(/ /gi,'');
    const production_date=span_offer.slice(0,5).replace(/\n/g, '')
    const mileage=span_offer.slice(6,12)
    // First replace the '\n' with a space. Splitting the via a space. 
    // Then popping the last item in the list
    const power=span_offer.slice(1,21).replace(/\n/g, ' ').split(' ').pop()

    const truck_data={
        'truck id':truck_id,
        'title':title,
        'price':price,
        'registration date':registration_date,
        'production date':production_date,
        'mileage':mileage,
        'power':power
    }

    
    parsedResults.push(truck_data)


}
```

The following function exports the list of truck data to a json format.
```jsx

exportResults(parsedResults)
//This function is responsible for iteration multiple times.
const exportResults = (parsedResults) => {
    console.log(parsedResults)
    fs.writeFile(outputFile, JSON.stringify(parsedResults,null, 4), (err) => {
      if (err) {
        exportResults(parsedResults)
        console.log(err)
      }
      console.log((`Results exported successfully to ${outputFile}`))
    });

}


```
