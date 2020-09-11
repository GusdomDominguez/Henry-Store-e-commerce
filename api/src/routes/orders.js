const server = require("express").Router();
const { Order } = require("../db.js");

// Busca todas las ordenes y los devuelve en un array y filtra si posee query con status
//no se puede testear por que no existe ruta para crear ordenes
server.get("/", (req, res, next) => {
  var status = req.query.status;
  if (!status) {
    Order.findAll()
      .then((orders) => {
        res.status(200).send(orders);
      })
      .catch(next);
  } else {
    Order.findAll({ where: { state: status } })
      .then((orders) => {
        res.status(200).send(orders);
      })
      .catch(next);
  }
});

server.put("/:id", (req, res, next) => {
  const {id} = req.params;
  const {state} = req.query;
  //Lo unico que podemos buscar editar es el estado de una orden
  // este estado deberia solo puede tener los values: ['inCart', 'created', 'processing','canceled','complete']
  // dichas limitaciones deben controlarse desde el frontend, y mandar el estado a editar como query ej: http://localhost:3100/orders/1?state=completed

  Order.findByPk(id)
  .then((order) => {
    if(state) order.state = state;
    order.save().catch(next);
    res.status(200).send(order);
  })
  .catch(next)
});

module.exports = server;
