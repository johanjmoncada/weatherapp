import React from 'react'
import PropTypes from 'prop-types'
import LocationForm from '../LocationForm'
import Box from './styledComponents'

const Home = (props) => {
  const { heroText, currentSearch, updateCurrentSearch } = props

  return (
    <Box>
      <h2>{heroText}</h2>
      <LocationForm formStyle="stacked" placeholder="St. George, Utah" currentSearch={currentSearch} updateCurrentSearch={updateCurrentSearch} />
    </Box>
  )
}

Home.propTypes = {
  heroText: PropTypes.string.isRequired,
  updateCurrentSearch: PropTypes.func.isRequired,
  currentSearch: PropTypes.string.isRequired,
}

export default Home
