// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const restaurantList =require('./models/restaurant')
const exphbs = require('express-handlebars')

// mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) 

const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// setting static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// 瀏覽所有餐廳
app.get('/', (_req, res) => {
  restaurantList.find() 
    .lean() 
    .sort({ _id: 'asc'})
    .then((restaurants) => res.render('index', { restaurants })) 
    .catch(error => console.error(error)) 
})

// 新增餐廳
app.get('/restaurants/new', (_req, res) => {
  res.render('new')
})
app.post("/restaurants", (req, res) => {
  restaurantList.create(req.body)
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

// 瀏覽特定頁面
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  restaurantList.findById(id)
    .lean()
    .then((restaurants) => res.render('show', { restaurants }))
    .catch(error => console.log(error))
})

// 修改特定頁面
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  restaurantList.findById(id)
    .lean()
    .then((restaurants) => res.render('edit', { restaurants }))
    .catch(error => console.log(error))
})
app.post('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  restaurantList.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${ id }`))
    .catch(error => console.log(error))
})
// 刪除特定頁面
app.post('/restaurants/:restaurant_id/delete',(req ,res) => {
  const id = req.params.restaurant_id
  return restaurantList.findById(id)
    .then(restaurants => restaurants.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// search
app.get('/search', (_req, res) => {
  const keyword = _req.query.keyword.trim()
  if(!keyword) {
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

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})