import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDetail } from '../../redux/actions';
import style from './Detail.module.css';
import loading from '../../images/loading.gif';
import attack from '../../images/stats/attack.png';
import defense from '../../images/stats/defense.png';
import height from '../../images/stats/height.png';
import hp from '../../images/stats/hp.png';
import speed from '../../images/stats/speed.png';
import weight from '../../images/stats/weight.png';


export default function Detail (props){
    
    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(getDetail(props.match.params.id));
    },[dispatch])

    const myPokemon = useSelector( state => state.detail)

    const [section, setSection] = useState(1);

    useEffect( () => {
        if(myPokemon[0] && myPokemon[0].createdInDb){
            setSection(2)
        }
    }, [myPokemon, setSection]);

    return(
        <div>
            {
                myPokemon.length && myPokemon[0].id == props.match.params.id ? 
                <div className={style.grid} style={{maxHeight:'100vh'}}> 
                
                    <div className={style.encabezado}> 
                        <h1 className={style.name}>{myPokemon[0].name.charAt(0).toUpperCase() + myPokemon[0].name.slice(1)}</h1> 
                        <p className={style.id}>#{myPokemon[0].id}</p>
                    </div>
                    <div className={style.visual}>
                        <img src={myPokemon[0].img} alt={"Pokemon"} className={style.imgpoke}/>
                        <div className={style.types}>
                            {
                                myPokemon[0].types ? myPokemon[0].types.map( el => {
                                    return(
                                        <img src={`../../images/types/${el}.png`} alt="Types" height="160px" key={el}/>
                                    )
                                }
                                ) :
                                <span>Types not found</span>
                            }
                        </div>
                    </div>
                
                    <div className={style.stats}>
                        <div>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <img src={hp} alt='Hp' height='60px' width='60px'/>
                                <span className={style.pokestats}>{myPokemon[0].hp} Hp</span>
                            </div>
                        </div>
                        <div>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <img src={attack} alt='Attack' height='60px' width='60px'/>
                                <span className={style.pokestats}>{myPokemon[0].attack} Attack</span>
                            </div>
                        </div>
                        <div>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <img src={defense} alt='Defense' height='60px' width='60px'/>
                                <span className={style.pokestats}>{myPokemon[0].defense} Defense</span>
                            </div>
                        </div>
                        <div>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <img src={speed} alt='Speed' height='60px' width='60px'/>
                                <span className={style.pokestats}>{myPokemon[0].speed} Speed</span>
                            </div>
                        </div>
                        <div>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <img src={weight} alt='Weight Icon' height='60px' width='60px'/>
                                <span className={style.pokestats}>{myPokemon[0].weight / 10}kg</span>                                </div>
                        </div>
                        <div>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <img src={height} alt='Height' Icon height='60px' width='60px' />
                                <span className={style.pokestats}>{myPokemon[0].height / 10}m</span>
                            </div>   
                        </div>
                        <div>
                            <div style={{display:'flex', flexDirection:'row'}}>
                            <Link to='/home'><button className={style.boton}>Back</button></Link>
                            </div>   
                        </div>
                    </div>
                </div> :
                <div className={style.loading}> 
                    <img src={loading} alt="Loading.." width='250px'/>
                    <p className={style.loadingtext}>Loading...</p>
                </div>
            }
        </div>
        
    )
}