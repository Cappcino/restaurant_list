const Restaurant = require('../restaurant')
const restaurantList = require('../../models/restaurant')
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connected!')
  Restaurant.create(restaurantList)
    .then(() => {
      console.log('seeder done')
    })
    .catch(err => console.log(err))
})