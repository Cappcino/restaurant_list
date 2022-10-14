const express = require('express')
const router = express.Router()
const restaurantList = require('../../models/restaurant')

// 瀏覽所有餐廳
router.get('/', (_req, res) => {
  restaurantList.find()
    .lean()
    .sort({ _id: 'asc' })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// search
router.get('/search', (_req, res) => {
  const keyword = _req.query.keyword.trim()
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
      res.render('index', { restaurants: searchRestaurant, keyword })
    })
    .catch(err => console.log(err))
})


module.exports = router