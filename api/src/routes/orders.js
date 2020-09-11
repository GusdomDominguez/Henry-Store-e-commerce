const server = require("express").Router();
const { Order } = require("../db.js");

// Busca todas las ordenes y los devuelve en un array y filtra si posee query con status
//no se puede testear por que no existe ruta para crear ordenes
server.get("/", (req, res, next) => {

    var status = req.query.status;
    if(!status){
        Order.findAll()
        .then((orders) => {
          res.status(200).send(orders);
        })
        .catch(next);
    }else{
        Order.findAll({ where: {state : status} })
            .then((orders) => {
                res.status(200).send(orders);
            })
          .catch(next);
        }
        });

        server.get("/:idOrder", (req, res, next) => {
          Order.findByPk(req.params.idOrder)
          .then((order) => res.send(order))
          .catch(next);
              });

module.exports = server;