import React, { useEffect } from 'react';
import { getPokemons, getTypes } from '../../redux/actions';
import { useDispatch } from 'react-redux' ;
import { Link } from "react-router-dom";
import style from './LandingPage.module.css';


export default function LandingPage(){

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTypes());
        dispatch(getPokemons());
    }, [dispatch])

    return(
        <div className={style.position}>
            
                
                <Link to='/home'>
                    <button className={style.boton}>Home</button>
                </Link>
            
            
        </div>
    ) 
}