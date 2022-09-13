import * as React from "react"
import { useState } from "react"
import algoliasearch from "algoliasearch/lite"
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-hooks-web"
import { PostPreview } from "./postPreview"

import * as algoliaSearchSiteStyle from "./algolia-search-site.module.css"

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
      <InstantSearch searchClient={searchClient} indexName="blog">
        <SearchBox placeholder="搜尋全站文章..." onInput={handleSearchInput} onBlur={cancelSearch}  style={{textAlign:"center"}}/>
        { searchState && 
           <Hits hitComponent={ PostPreview } className={`${algoliaSearchSiteStyle.aisHits}`}/>

        }
      </InstantSearch>
  )
}

export default AlgoliaSearchSite