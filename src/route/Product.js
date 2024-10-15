// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []
  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 90000) + 10000
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static add = (product) => {
    this.#list.push(product)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)
    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }
  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) {
      product.name = name
    }
    if (price) {
      product.price = price
    }
    if (description) {
      product.description = description
    }
  }
}

// ================================================================
router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create', // Додаємо стилі для цієї сторінки
  })
})
// =================================================================
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(
    name,
    Number(price),
    description,
  )

  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    message: 'Товар успішно створено!',
  })
})
// ================================================================
router.get('/product-list', function (req, res) {
  const list = Product.getList()

  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================
router.get('/product-create', function (req, res) {
  res.render('product-create', {})
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  const deleted = Product.deleteById(Number(id))

  if (deleted) {
    res.render('alert', {
      style: 'alert',
      message: 'Товар видалено',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      message: 'Товар не знайдено',
    })
  }
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  if (!product) {
    return res
      .status(404)
      .render('error', { message: 'Продукт не знайдено' })
  }
  res.render('product-edit', {
    style: 'product-edit',
    product,
  })
})

// ================================================================

router.post('/product-update', function (req, res) {
  const { id, name, price, description } = req.body

  let result = false

  const product = Product.getById(Number(id))
  console.log(Product.getList())
  if (product) {
    Product.update(product, { name, price, description })
    result = true
  }

  res.render('alert', {
    style: 'alert',
    message: result
      ? 'Товар успішно оновлено'
      : 'Сталася помилка',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
