import React, { useState, useEffect } from "react"
import { StaticImage, GatsbyImage } from "gatsby-plugin-image"
import Pokeman1 from "../../images/emojipng.com-457612.png"
import * as styles from "./pokeman-reaction.module.css"

const pokemonTeamSanity = [
  {
    id: 1,
    img: Pokeman1,
    name: "Pikachu",
    feeds: 0,
    isGettingFed: false,
  },
  {
    id: 2,
    img: "../../images/emojipng.2.png",
    name: "Pikachu",
    feeds: 0,
    isGettingFed: false,
  },
  {
    id: 3,
    img: "../../images/emojipng.3.png",
    name: "Pikachu",
    feeds: 0,
    isGettingFed: false,
  },
  {
    id: 4,
    img: "../../images/emojipng.4.png",
    name: "Pikachu",
    feeds: 0,
    isGettingFed: false,
  },
  {
    id: 5,
    img: "../../images/emojipng.5.png",
    name: "Pikachu",
    feeds: 0,
    isGettingFed: false,
  },
]

const PokemonReaction = () => {
  const [pokemonTeam, setPokemonTeam] = useState([])

  useEffect(() => {
    setPokemonTeam([...pokemonTeamSanity])
  }, [])

  const feedingAnimateAndAddOne = (function onFeedingAnimate() {
    return function updateFeedsAnimate(id) {
      const pokemonAddOneOpenAnimate = (function () {
        return function (prevPokemon) {
          return prevPokemon?.map(p =>
            p.id === id ? { ...p, feeds: p.feeds + 1, isGettingFed: true } : p
          )
        }
      })()

      const closeAnimate = (function () {
        return function (prevPokemon) {
          return prevPokemon?.map(p =>
            p.id === id ? { ...p, isGettingFed: false } : p
          )
        }
      })()
      setPokemonTeam(prev => [...pokemonAddOneOpenAnimate(prev)])
      setTimeout(() => {
        setPokemonTeam(prev => [...closeAnimate(prev)])
      }, 1000)
    }
  })()

  return (
    <div className={styles.pokemonReaction}>
      {pokemonTeam.map(p => {
        if (!!p.name) {
          return (
            <>
              <span
                className={`${styles.pokemon} ${
                  p.isGettingFed && styles.gettingFed
                }`}
                onClick={() => feedingAnimateAndAddOne(p.id)}
              >
                <img src={p.img} alt={p.name} />
                {p.feeds}
                <span className={styles.add}>+1</span>
                <span className={styles.line} style={`--i:0;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:1;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:2;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:3;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:4;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:5;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:6;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:7;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:8;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:9;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:10;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:11;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:12;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:13;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:14;`}>
                  <i></i>
                </span>
                <span className={styles.line} style={`--i:15;`}>
                  <i></i>
                </span>
              </span>
            </>
          )
        }
      })}
    </div>
  )
}

export default PokemonReaction
