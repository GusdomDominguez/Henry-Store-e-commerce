import React, { useState, useEffect } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import styles from "../../Styles/productForm.module.css";
import logoText from "../../Styles/Assets/logo henry black.png";
import axios from "axios";
import Button from "@material-ui/core/Button";
import ReplayIcon from '@material-ui/icons/Replay';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { red } from "@material-ui/core/colors";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "500px",
    },
  },
};

function getStyles(name, updateCat, theme) {
  return {
    backgroundColor: updateCat.indexOf(name) === -1 ? "white" : "#dddd37",
    fontWeight:
    updateCat.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function ProductUpdate(props) {

  //Estado para Alerta actualizar categoria
  const [openUpdate, setOpenUpdate] = useState(false);

  //Funciones para control de Alerta actualizar categoria

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    window.location.href = "http://localhost:3000/product/admin/product-table";
  };

  /* Estados */
  const [categories, setCategories] = useState([]);
  const [toUpdate, setUpdate] = useState({});
  const [state, setState] = useState(toUpdate);
  const theme = useTheme();
  const [actualCat, setActualCat] = useState([]);
  const [updateCat, setUpdateCat] = useState([]);

  const handleSelect = (event) => {
    setUpdateCat(event.target.value);
  };

  const id = window.location.search.split("=").pop();
  /* Peticion GET a categories */
  useEffect(() => {
    fetch("http://localhost:3100/categories")
      .then((data) => data.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.log(err));

    fetch(`http://localhost:3100/products/${id}`)
      .then((data) => data.json())
      .then((data) => setUpdate(data));
  }, []);

  useEffect(() => {
    if ( toUpdate.categories !== undefined ) {
      var ids = toUpdate.categories.map( cat => cat.id );      
      setActualCat(ids);
      setUpdateCat(ids);  
    }
  },[toUpdate]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState({ ...state, [name]: value });
  };          

  const handleSubmit = (event) => {
    event.preventDefault();
    const body = state;
    if (!state.name) body.name = toUpdate.name;
    if (!state.description) body.description = toUpdate.description;
    if (!state.price) body.price = toUpdate.price;
    if (!state.stock) body.stock = toUpdate.stock;

    let borrar = actualCat.filter( cat => !(updateCat.includes(cat)));
    let actualizar = updateCat.filter( cat => !(actualCat.includes(cat)));    

    axios({
      method: "put",
      url: `http://localhost:3100/products/${toUpdate.id}/update`,
      data: body,
    })
      .then((data) => {        
        if (actualizar.length > 0) {
          actualizar.forEach((e) => {
            axios({
              method: "post",
              url: `http://localhost:3100/products/${toUpdate.id}/addCategory/${e}`,
            });
          });
        }
        if (borrar.length > 0) {
          borrar.forEach((e) => {
            axios({
              method: "delete",
              url: `http://localhost:3100/products/${toUpdate.id}/deleteCategory/${e}`,
            });
          });
        }
      })
      .then(() => {
        setOpenUpdate(true);
      })
      .catch((err) => console.log(err));
    setState({ ...state, name: "", description: "", price: "", stock: "" });
  };

  return (
    <div>
      <form className={styles.form}>
        <div className={styles.inputs}>
          <div className={styles.name}>
            <label>Nombre</label>
            <br />
            <input
              name="name"
              onChange={handleChange}
              value={state.name}
              defaultValue={toUpdate.name}
              placeholder={toUpdate.name}
            />
            <br />
          </div>
          <div className={styles.description}>
            <label>Descripción</label>
            <br />
            <textarea
              name="description"
              onChange={handleChange}
              value={state.description}
              defaultValue={toUpdate.description}
              placeholder={toUpdate.description}
            />
            <br />
          </div>
          <div className={styles.priceStock}>
            <label>Precio</label>
            <br />
            <input
              type="number"
              name="price"
              min="0.00"
              step="0.01"
              onChange={handleChange}
              defaultValue={toUpdate.price}
              value={state.price}
              placeholder={toUpdate.price}
            />
            <label>Stock</label>
            <br />
            <input
              type="number"
              name="stock"
              min="0"
              step="1"
              onChange={handleChange}
              value={state.stock}
              defaultValue={toUpdate.stock}
              placeholder={toUpdate.stock}
            />
          </div>
          <div>
            <label>Subir Imágenes</label>
            <input type="file" name="dropimage" accept="image/*" />
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              style={{ backgroundColor: "#ffff5a", color: "black" }}
              endIcon={<ReplayIcon />}
            >
              ACTUALIZAR
            </Button>
          </div>
        </div>

        <div className={styles.buttons}>
          <h3>Crear Producto</h3>
          {/* Selector multiple de categorias */}
          <div className={styles.Multiselect}>
            <h2>Seleccionar Categorias: </h2>
            {categories.length > 0 && (
              <FormControl style={{ width: "80%" }}>
                <InputLabel id="demo-mutiple-name-label">Categorías</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={updateCat}
                  onChange={handleSelect}
                  input={<Input />}
                  MenuProps={MenuProps}
                >
                  {categories.map((name, index) => (
                    <MenuItem
                      key={index}
                      value={name.id}
                      style={getStyles(name.id, updateCat, theme)}
                    >
                      {name.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
          <img className={styles.imgLogo} src={logoText} alt="logoHenry" />
        </div>
      </form>
      <Snackbar
        open={openUpdate}
        autoHideDuration={7000}
        onClose={handleCloseUpdate}
      >
        <Alert
          onClose={handleCloseUpdate}
          severity="success"
          style={{ backgroundColor: "#ffff5a", color: "black" }}
        >
          El producto fue actualizado con éxito.
        </Alert>
      </Snackbar>
    </div>
  );
}
export default ProductUpdate;
