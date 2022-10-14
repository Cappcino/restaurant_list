const express = require('express')
const router = express.Router()
const restaurantList = require('../../models/restaurant')

// 新增餐廳
router.get('/new', (_req, res) => {
  res.render('new')
})
router.post("/", (req, res) => {
  restaurantList.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})

// 瀏覽特定頁面
router.get('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  restaurantList.findById(id)
    .lean()
    .then((restaurants) => res.render('show', { restaurants }))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})

// 修改特定頁面
router.get('/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  restaurantList.findById(id)
    .lean()
    .then((restaurants) => res.render('edit', { restaurants }))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})
router.put('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  restaurantList.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})
// 刪除特定頁面
router.delete('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return restaurantList.findById(id)
    .then(restaurants => restaurants.remove())
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})

module.exports = router