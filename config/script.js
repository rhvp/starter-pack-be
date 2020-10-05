// const cities = require('../ng.json');

const gidiCities = ['Mainland', 'Island'];
const City = require('../models/city');

exports.uploadState = ()=>{
    // cities.map(async obj=>{
    //     try {
    //         let cityObj = {
    //             name: obj.A,
    //             state: obj.F,
    //         }
    //         if(obj.G === "admin") cityObj.capital = true;
    //         if(obj.F !== "Lagos") {
    //         await City.create(cityObj);
    //         console.log(obj.A + ' city created');
    //         } else {
    //             console.log(obj.A + "city not created")
    //         }
    //     } catch (error) {
    //         console.log('error creating city '+ obj.A);
    //     }
    // })

    // gidiCities.map(async city=>{
    //     try {
    //         let obj = {
    //             name: city,
    //             state: 'Lagos',
    //         }
    //         await City.create(obj);
    //         console.log(city +' city created');
    //     } catch (error) {
    //         console.log('error creating city '+ city)
    //     }
    // })
}
