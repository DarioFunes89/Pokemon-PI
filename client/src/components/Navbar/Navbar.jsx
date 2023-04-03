import React from 'react' ;
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import style from './Navbar.module.css';
import pokeball from '../../images/pokebola.png';

export default function Navbar(){
    return (
        <nav className={style.nav}>
            <Link to='/'>
            <img src={pokeball} width="100" alt="landing" />
            </Link>
            <SearchBar />
            <Link to="/pokemons"><button className={style.create}>Create</button></Link>
        </nav>
      );
}