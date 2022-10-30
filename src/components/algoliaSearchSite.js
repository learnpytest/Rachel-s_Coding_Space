import * as React from "react"
import { useState } from "react"
import algoliasearch from "algoliasearch/lite"
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-hooks-web"
import { PostPreview } from "./postPreview"

import * as styles from "./algolia-search-site.module.css"

const indexName = `Pages`

const searchClient = algoliasearch(
  "WRA8GPTB3I",
  "a26d6f0cf2cee2de22a46c03ecf3e526"
  )
  
  const AlgoliaSearchSite = () => {
  const [searchState, setSearchState] = useState(false)
  const handleSearchInput = ({target}) => {
    target.value && setSearchState(true)
  }

  const cancelSearch = ({target}) => {
    !target.value && setSearchState(false)
  }

  return (
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <SearchBox placeholder="Search article..." onInput={handleSearchInput} onBlur={cancelSearch}  style={{textAlign:"center"}} className={styles.searchBox}/>
        { searchState && <Hits hitComponent={ PostPreview } className={`${styles.aisHits}`}/>
        }
      </InstantSearch>
  )
}

export default AlgoliaSearchSite