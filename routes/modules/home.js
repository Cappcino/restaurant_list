const express = require('express')
const router = express.Router()
const restaurantList = require('../../models/restaurant')
const sortSelector = require('../../utilities/sortSelector')

// 瀏覽所有餐廳
router.get('/', (req, res) => {
  const sortValue = req.query.sortValue
  restaurantList.find()
    .lean()
    .sort(sortSelector(sortValue))
    .then((restaurants) => res.render('index', { restaurants }))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})


// search
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  if (!keyword) {
    return res.redirect('/')
  }
  restaurantList.find({})
    .lean()
    .then(restaurants => {
      const searchRestaurant = restaurants.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      )
      res.render('index', { restaurants: searchRestaurant, keyword, sortValue})
    })
    .catch(err => {
      console.log(err)
      res.render('error')
    })
});




module.exports = router