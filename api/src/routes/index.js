const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require('axios')
const { Pokemon, Type } = require('../db.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


// obtener todos los pokemons de la api (20)

const pokeLoad = async (url) => {
  try {
    const pokeFromApi = await axios(url);
    return pokeFromApi.data;
  } catch (error) {
    return { error: 'No response from API' };
  }
};

const pokeNameUrl = async (pokeArray, pokeCant, resultApi) => {
  try {
    while (pokeArray.length < pokeCant) {
      pokeArray = pokeArray.concat(resultApi.results);
      resultApi = await pokeLoad(resultApi.next);
    }
    return pokeArray;
  } catch (error) {
    return { error: 'Error in map pokeArray' };
  }
};

const getApiInfo = async () => {
  try {
    let pokeArray = [];
    const pokeCant = 100;
    let resultApi = await pokeLoad('https://pokeapi.co/api/v2/pokemon');

    pokeArray = await pokeNameUrl(pokeArray, pokeCant, resultApi);

    const pokemons = pokeArray.map(async (poke) => {
      const pokeData = await axios(poke.url).then((pokeData) => {
        const pokemon = {
          id: pokeData.data.id,
          name: pokeData.data.name,
          image: pokeData.data.sprites.other.dream_world.front_default,
          height: pokeData.data.height,
          weight: pokeData.data.weight,
          attack: pokeData.data.stats[1].base_stat,
          defense: pokeData.data.stats[2].base_stat,
          speed: pokeData.data.stats[5].base_stat,
          hp: pokeData.data.stats[0].base_stat,
          types: pokeData.data.types.map((t) => t.type.name),
        };
        return pokemon;
      });
      return pokeData;
    });
    return Promise.all(pokemons)
      .then((poke) => {
        console.log('Array Poke Promisses Resolve');
        return poke;
      })
      .catch((reason) => {
        console.log('Array Poke Promisses Error');
        return [];
      });
  } catch (error) {
    return { error: 'Error in Data Poke response' };
  }
};

// const getApiInfo = async () => {
//     const apiUrl = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20");
//     const results = apiUrl.data.results

//     const pokemonInfo = []
    
//     for(let i = 0 ; i < results.length ; i++){
//       const pokes = await axios.get(results[i].url);
//       const pokeInfo = pokes.data;

//       pokemonInfo.push({
//         id: pokeInfo.id,
//         name: pokeInfo.name,
//         types: pokeInfo.types.map((t) => t.type.name),
//         image: pokeInfo.sprites.other.dream_world.front_default,
//         attack: pokeInfo.stats[1].base_stat,
//         weight: pokeInfo.weight,
//         height: pokeInfo.height,
//         defense: pokeInfo.defense
//       });
//     }
    
//     return pokemonInfo;
// }

// obtener los pokemon de la BD
const getDbInfo = async () => {
	const data = (await Pokemon.findAll({ 
    include: {
      model: Type,
      attributes: ['name'],
      through: {
        attributes: [],
      }
    }
  })).map(pokemon => {
    const json = pokemon.toJSON();
    return{
      ...json,
      types: json.types.map( type => type.name)
    }
  });
  
  return data
}

// concatenar los pokemon de la api y BD
const getAllPokemons = async () => {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    const infoTotal = [...apiInfo, ...dbInfo]; 
    // console.log(infoTotal)

    return infoTotal;
}

// obtener un pokemon x su id
const getPokeInfo = async (id) => {
  try {
    const apiPokeUrl = await axios.get("https://pokeapi.co/api/v2/pokemon/" + id);
    const results = apiPokeUrl.data

    const pokemonInfo = {
      id: results.id,
      name: results.name,
      types: results.types.map((t) => t.type.name),
      image: results.sprites.other.dream_world.front_default,
      hp: results.stats[0].base_stat,
      attack: results.stats[1].base_stat,
      defense: results.stats[2].base_stat,
      speed: results.stats[5].base_stat,
      weight: results.weight,
      height: results.height,
    }
    console.log(pokemonInfo)

    return pokemonInfo;
  } catch (e) {
    console.error(e);
    if (e.status === 404) return null;
  }
}

// obtener el pokemon por nombre 
const getPokeInfoxName = async (name) => {
  try {
    const apiPokeUrl = await axios.get(
      "https://pokeapi.co/api/v2/pokemon/" + name
    );
    const results = apiPokeUrl.data;

    const pokemonInfo = {
      id: results.id,
      name: results.name,
      types: results.types.map((t) => t.type.name),
      image: results.sprites.other.dream_world.front_default,
      weight: results.weight,
      height: results.height,
    };
    console.log(pokemonInfo);

    return pokemonInfo;
  } catch (e) {
    if (e.status === 404) return null;
  }
};

// ruta get
router.get("/pokemons", async (req, res) => {
  const name = req.query.name;

  if (name) {
    const pokemonName = await getPokeInfoxName(name.toLowerCase());

    if (pokemonName) {
      return res.status(200).send([pokemonName]);
    } else {
      const pokemonsDB = await getDbInfo();
      const pokemonNAM = pokemonsDB.filter(
        el => el.name.toLowerCase() == name.toLowerCase()
      );

      return pokemonNAM.length
        ? res.status(200).send(pokemonNAM)
        : res.status(404).send("Pokemon not found");
    }
  } else {
    const pokemonsTotal = await getAllPokemons();

    return res.status(200).send(pokemonsTotal);
  }
});

router.get('/types', async (req, res) => {
  try {
  const typesApi = await axios.get("https://pokeapi.co/api/v2/type");
  const types = typesApi.data.results;

  types.forEach( el => {
    Type.findOrCreate({
      where: {name: el.name}
    })
  })

  const allTypes = await Type.findAll();
  return res.send(allTypes);
}
catch(error) {
  return { error: 'No types response from api'}
}})

router.post('/pokemons', async (req, res) => {
  const { 
		name, 
		types, 
		hp, 
		attack, 
		defense, 
		speed, 
		height, 
		weight, 
		image,
    createdInDb 
	} = req.body;

  const pokemonCreated = await Pokemon.create({
    name, 
    hp, 
    attack, 
    defense, 
    speed, 
    height, 
    weight, 
    image,
    createdInDb 
  })

  const pokemonTypes = await Type.findAll({
    where: { name: types }
  })

  pokemonCreated.addType(pokemonTypes)
  return res.send('Pokemon created successfuly')
})

router.get('/pokemons/:idPokemon', async (req, res) => {
  const { idPokemon } = req.params
  
  let pokemonInfo;
  if(idPokemon >= 1 && idPokemon <= 898 || idPokemon >= 10001 && idPokemon <= 10220){
    const pokemonInfo = await getPokeInfo(idPokemon)
    
    return pokemonInfo ?
    res.status(200).send([pokemonInfo]) :
    res.status(404).send('Pokemon not found')
  }

  const pokemonsTotal = await getDbInfo()

  if(!pokemonInfo && idPokemon){
    const pokemonId = pokemonsTotal.filter( el => el.id == idPokemon )

    return pokemonId.length ?
    res.status(200).send(pokemonId) :
    res.status(404).send('Pokemon not found')
  }
})

module.exports = router;
