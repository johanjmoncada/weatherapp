import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import moment from 'moment'
import qs from 'query-string'
import { GridLoader } from 'react-spinners'
import {
  Wrapper,
  ForecastWrapper,
  Day,
  Hours,
  BackButton,
} from './styledComponents'

// Estas funciones pueden ser incluidas en un utils file
function formatingForecast(data) {
  const res = []

  let mainIndex = -1
  let day = ''

  data.map((item) => {
    const itemday = moment(item.dt_txt)

    if (day !== itemday.format('YYYYMMDD')) {
      res.push({
        date: '',
        icon: '',
        description: '',
        dayforecast: [],
      })
      mainIndex += 1
      day = itemday.format('YYYYMMDD')
    }

    res[mainIndex].dayforecast.push({
      date: item.dt_txt,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    })

    if (res[mainIndex].date === '' && itemday.format('HH') >= 12) {
      res[mainIndex].date = item.dt_txt
      res[mainIndex].icon = item.weather[0].icon
      res[mainIndex].description = item.weather[0].description
      res[mainIndex].tempmin = item.main.temp_min
      res[mainIndex].tempmax = item.main.temp_max
      res[mainIndex].humidity = item.main.humidity
    }

    return item
  })

  return res
}

export default class Forecast extends React.Component {
  state = {
    loading: true,
    forecast: [],
  }

  componentDidMount() {
    // Get forecast from openweather api
    const baseUrl = 'http://api.openweathermap.org/data/2.5/forecast/'
    const { updateCurrentSearch, location } = this.props
    const params = qs.parse(location.search)
    const city = params.c
    const apiKey = '52ebf7e7ac1cc952fdeb6fd0e93a7a57'
    const url = `${baseUrl}?q=${city}&appid=${apiKey}&cnt=40`
    //  Update state to get current search
    updateCurrentSearch(city)

    axios.get(url)
      .then((response) => {
        this.setState(() => ({
          loading: false,
          title: city,
          forecast: formatingForecast(response.data.list),
        }))
      })
      .catch(() => {
        this.setState(() => ({
          loading: false,
          title: 'Oops, something wrong happened. Maybe there is no data for the city you searched for.',
          forecast: [],
        }))
      })
  }

  // Este metodo de ciclo de vida fue deprecado
  componentWillReceiveProps(nextprops) {
    const { currentSearch, history } = this.props

    if (currentSearch !== nextprops.currentSearch) {
      // Get forecast from openweather api
      const baseUrl = 'http://api.openweathermap.org/data/2.5/forecast/'
      const city = nextprops.currentSearch
      const apiKey = '52ebf7e7ac1cc952fdeb6fd0e93a7a57'
      const url = `${baseUrl}?q=${city}&appid=${apiKey}&cnt=40`

      axios.get(url)
        .then((response) => {
          this.setState(() => ({
            loading: false,
            title: city,
            forecast: formatingForecast(response.data.list),
          }))

          history.push(`/forecast?c=${city}`)
        })
        .catch(() => {
          this.setState({
            loading: false,
            title: 'Oops, something wrong happened. Maybe there is no data for the city you searched for.',
            forecast: [],
          })
        })
    }
  }

  render() {
    const { loading, title, forecast } = this.state

    return (
      <Wrapper>
        <GridLoader
          className="spinner"
          sizeUnit="px"
          size={15}
          color="#82a5b4"
          loading={loading}
        />
        <h2>{title}</h2>
        <ForecastWrapper>
          {forecast.slice(0, 5).map((d) => {
            const params = `desc=${d.description}&hum=${d.humidity}&max=${d.tempmax}&min=${d.tempmin}&icon=${d.icon}`

            return (
              <Day key={d.date}>
                <a href={`/detail/${title}/${d.date}?${params}`}>
                  <img src={`/public/images/weather-icons/${d.icon}.svg`} alt={d.description} title={d.description} />
                  <h3>
                    <Moment format="dddd, MMM Do">
                      {d.date}
                    </Moment>
                  </h3>
                </a>
                <Hours>
                  {d.dayforecast.map(dd => (
                    <div key={dd.date}>
                      <p>
                        <Moment format="hh:mm A">
                          {dd.date}
                        </Moment>
                      </p>
                      -
                      <img src={`/public/images/weather-icons/${dd.icon}.svg`} alt={dd.description} title={dd.description} />
                    </div>
                  ))}
                </Hours>
              </Day>
            )
          })}
        </ForecastWrapper>
        <BackButton href="/">Go Back</BackButton>
      </Wrapper>
    )
  }
}

Forecast.propTypes = {
  updateCurrentSearch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  currentSearch: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}
