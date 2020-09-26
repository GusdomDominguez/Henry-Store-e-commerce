import React from 'react';
import styles from '../../Styles/productCard.module.css'
// import henryShirt from "../../content/henryShirt.png";


export default function Product(props) {
    const {id, name, description} = props.product;
    const image = props.image;    

    const imageBackground = (image) => ({ backgroundImage: `url(./products/${image.source})`});

    return (
        <div className={styles.container}>
            <div className={styles.card}>
            
                {image && <div style={imageBackground(image)} className={styles.imgBx}></div>}

                <div className={styles.contentBx}>
                    <h2>{name}</h2>
                    <div className={styles.description}>
                        <p>{description}</p>
                    </div>
                    <a href={`http://localhost:3000/product/detailed/${id}`}>ver más</a>
                </div>
            </div>
        </div>
    );
}