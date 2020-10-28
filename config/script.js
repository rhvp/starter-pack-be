const cities = require('../ng.json');
const states = require('./locations').states;
const gidiCities = ['Mainland', 'Island'];
const abjcities = ['Airport Road', 'Lugbe', 'Kubwa', 'Kaura', 'Kuje', 'Mpape', 'Nyanya'];
const City = require('../models/city');
const State = require('../models/state');

exports.uploadState = ()=>{
    // states.map(async state=>{
    //     try {
    //         await State.create({name: state});
    //         console.log(state, ' created');
    //     } catch (error) {
    //         console.log('error creating ', state, error);
    //     }
    // })
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
    abjcities.map(async city=>{
        try {
            let obj = {
                name: city,
                state: 'Federal Capital Territory'
            }
            await City.create(obj);
            console.log(city + ' city created');
        } catch (error) {
            console.log('error creating city '+ city)
        }
    })
}
