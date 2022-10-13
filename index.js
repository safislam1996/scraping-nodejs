import axios from "axios"
import cheerio, { html,load} from "cheerio"
import express from "express"

const PORT = process.env.PORT || 5000
const app = express()

const url='https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc'
const response = await axios.get(url)
const $ = load(response.data)
const total_pages=7
let page_counter=0
let articles=[]
const parsedResults = []
function addItems(val) {
            
    $('main article').map((idx, elm) => {
        const item_id = $(elm).attr('id')
        const item_url = $(elm).find('a').attr('href')
        
        const article = {
            'item_id': item_id,
            'url': item_url,
            
        }
        articles.push(article)
        
        scrapeItem(article['url'])
        
    })
}
let adCountLength=(i,item)=>{
    const article=$('main article')
    console.log("Page "+i+" : "+article.length)
}

// Scrape the item information about the product for each page
let scrapeItem =async (url)=>{
    const res=await axios.get(url)
    const $=load(res.data)
    const truck_datas=[]
    const truck_id=$('#ad_id').text()
    // console.log(truck_id)
    const title=$('span.offer-title').text().trim()
    const price=$('span.offer-price__number').text().slice(0,8)
    const registration_date=$('span.offer-meta__value').text().slice(7,27)
    const span_offer=$('span.offer-main-params__item').text().replace(/ /gi,'');
    const production_date=span_offer.slice(0,5)
    const mileage=span_offer.slice(6,12)
    const power=span_offer.slice(1,21)

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
// scrapeItem('https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc')
 
const getWebsiteContent = async (url) => {

    try {
        
        const nextPageLink=$('ul.pagination-list li').find('a').attr('href')

        //TODO: Add map function
        for(let page_counter=1;page_counter<=total_pages;page_counter++){
            const page_link=url+nextPageLink+'&page='+page_counter
            adCountLength(page_counter,page_link)
            // addItems(page_link)
        }
        
   
        
}

    catch (error) {
        exportResults(parsedResults)
        console.error(error)
      }
}

getWebsiteContent(url)


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))