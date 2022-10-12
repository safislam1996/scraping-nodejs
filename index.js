import axios from "axios"
import cheerio, { html,load} from "cheerio"
import express from "express"

const PORT = process.env.PORT || 5000
const app = express()

const url='https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc'

axios(url).then(
    res=>{
        const data=res.data
        const $=load(data)
        
        function getNextPageUrl() {
            const ul_list = $('ul.pagination-list li')
            let currentPage = 1
            const url_list = []
            ul_list.map((idx, elm) => {

                url_list.push(url.concat('&page=', currentPage))
                currentPage++
            
                
            })
            return url_list
        }
        // id:6100411379
        // url: https://www.otomoto.pl/oferta/mercedes-benz-actros-ID6EQHFW.html


        const pages=getNextPageUrl()
        for(let i=0;i<pages.length;i++){
            console.log(pages[i])
        }
        
        const articles=[]
        // addItems()

        function scrapeTruckItem(articles){
            let url=articles.map(get_url)
            function get_url(item){
                return item.url
            }
            function getEachItem(){
                const truck_id=$('div.offer_meta span span').attr('id')
                // console.log(truck_id)
            }

           
        // }

        function scrapeItem(url){
            axios(url).then(
                res=>{
                    const data=res.data
                    const $=load(data)
                    const truck_id=$('#ad_id').text()
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
                    
                    // console.log(truck_data)

        }).catch(err=>console.log(err))
    }
    scrapeItem('https://www.otomoto.pl/oferta/mercedes-benz-actros-1848-z-hidraulika-ID6EV9XH.html')
        // let val=scrapeTruckItem(articles)
        // console.log(val)
        // articles.map(scrapeTruckItem)
        function addItems() {
            
            $('main article').map((idx, elm) => {
                const item_id = $(elm).attr('id')
                const item_url = $(elm).find('a').attr('href')

                const article = {
                    'item_id': item_id,
                    'url': item_url
                }
                // console.log(article)
                articles.push(article)
                
            })
        }
        function getTotalAdsCount(articles) {
            // console.log(articles.length)
        }
        



        
       
        getTotalAdsCount(articles)
        

    }
    
}).catch(err => console.error(err))






app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))