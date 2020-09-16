const server = require("express").Router();
const { Reviews, Order , Product} = require("../db.js");

// Busca todas las review y las devuelve en un array
server.get("/", (req, res, next) => {
  Reviews.findAll()
    .then((data) => res.status(200).send(data))
    .catch(next);
});

//Ruta para agregar una review a un producto, el mismo llega como params
//el valor de la review, descripcion, y el id del autor llegan en body
server.post("/:idProduct/add/", (req, res, next) => {
  const { idProduct } = req.params;
  const { rating, description, userId} = req.body;
  
  Reviews.create({
      value: rating,
      review: description,
      authorId: userId,
      productId: idProduct
  }).then(data => res.status(200).json(data))
  .catch(next)
});

//Ruta para modificar una rewview, el id de la review a modificar llegar como query
//Y los valores que se quieran modificar, en body
server.put("/update", (req, res, next) => {
  const { id } = req.query;
  const { rating, description, userId, idProduct} = req.body;
  
  Reviews.findByPk(id)
  .then(data => {
    console.log(data.value)
    if(rating) data.value = rating;
    if(description) data.review = description;
    if(userId) data.authorId = userId;
    if(idProduct) data.productId = idProduct;
    data.save()
    res.status(200).send(data)
  })
  .catch(next)
});


//Ruta para eliminar una review de un producto segun sus ids
server.delete("/product/idProduct/delete/:idReview", (req, res, next) => {
  const { idProduct, idReview } = req.params;
  var product = Product.findByPk(idProduct);
  var review = Reviews.findByPk(idReview);

  Promise.all([product, review])
    .then((data) => {
      data[0].removeReviews(data[1]);
      res
        .status(200)
        .send(
          `Se elimino la review ${data[1].dataValues.review} del producto ${data[0].dataValues.name}`
        );
    })
    .catch(next);
});


//Ruta para obtener todas las reviews del producto que viene como parametro
server.get("/:idProduct", (req, res, next) => {
  const idProduct = req.params.idProduct;
  Reviews.findAll({
    where: {
      productId: idProduct,
    }
  })
    .then((data) => res.status(200).send(data))
    .catch(next);
});



module.exports = server;
