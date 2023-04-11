import React from 'react';
import style from './Card.module.css'

export default function Card({ name, types, image, id, weight, height}){

    return(
        <div className={style.card} style={{ backgroundImage: `url(images/typesbkgm/${types[0]}.png)` }}>
            <span className={style.name}>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
            <img src={image} alt="Img not found" height="190px" className={style.img}/>
            <div className={style.types} key={id}>
                {
                    types.map( el => {
                        return(
                            <img src={`images/types/${el}.png`} alt="Types" height="80px" key={el}/>
                        )
                     }
                    )
                }
            </div>         
        </div>
    )
}