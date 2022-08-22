import React from 'react'
import PropTypes from 'prop-types'

const BitfinexIcon = (props) => {
  const { fill } = props

  return (
    <svg width='100' height='30' viewBox='0 0 165 20'>
      <path d='M141.437 19.662a.2.2 0 01-.144.338h-4.386a.198.198 0 01-.145-.063l-5.83-6.166-5.894 6.167a.198.198 0 01-.144.062h-4.387a.2.2 0 01-.144-.338l8.036-8.421-7.764-8.183a.2.2 0 01.145-.338h4.387c.055 0 .108.023.146.063l5.576 5.928 5.598-5.928a.202.202 0 01.146-.063h4.387a.2.2 0 01.145.338l-7.764 8.183 8.036 8.42zM99.856 20a.278.278 0 01-.278-.278V2.998c0-.153.125-.277.278-.277h16.571c.153 0 .277.124.277.277V5.39a.277.277 0 01-.277.277h-12.83v3.851h7.692c.153 0 .278.125.278.278v2.392a.278.278 0 01-.278.277h-7.692v4.287h12.997c.153 0 .278.124.278.277v2.693a.278.278 0 01-.278.278H99.856zM70.514 20a.278.278 0 01-.277-.278V2.998c0-.153.124-.277.277-.277h3.463c.154 0 .278.124.278.277v16.724a.278.278 0 01-.278.278h-3.463zM50.813 20a.278.278 0 01-.277-.278V2.998c0-.153.124-.277.277-.277h16.37c.153 0 .277.124.277.277v2.459a.278.278 0 01-.277.277H54.554v4.555h6.989c.153 0 .278.124.278.277v2.593a.278.278 0 01-.278.277h-6.989v6.286a.278.278 0 01-.278.278h-3.463zM40.067 5.801v13.921a.278.278 0 01-.277.278h-3.463a.278.278 0 01-.278-.278V5.802h-7.381a.278.278 0 01-.278-.278V2.998c0-.153.124-.277.278-.277h18.814c.153 0 .277.124.277.277v2.526a.278.278 0 01-.277.277h-7.415zM21.873 20a.278.278 0 01-.277-.278V2.998c0-.153.124-.277.277-.277h3.463c.154 0 .278.124.278.277v16.724a.278.278 0 01-.278.278h-3.463z' fill={fill} />
      <path fillRule='evenodd' clipRule='evenodd' d='M0 2.998c0-.153.124-.277.278-.277h14.798a3.609 3.609 0 013.608 3.609v1.153a3.609 3.609 0 01-3.609 3.61h.135a3.61 3.61 0 013.61 3.608v1.69A3.609 3.609 0 0115.21 20H.278A.278.278 0 010 19.722V2.998zm3.949 2.536h9.353c.92 0 1.666.746 1.666 1.666v.787c0 .92-.746 1.665-1.666 1.665H3.949V5.534zm0 6.963h9.453c.92 0 1.666.746 1.666 1.666v1.057c0 .92-.746 1.665-1.666 1.665H3.95v-4.388z' fill={fill} />
      <path d='M77.031 19.722V2.998c0-.153.124-.277.278-.277h2.363c.068 0 .133.024.184.07l13.33 11.798V2.999c0-.154.124-.278.277-.278h3.062c.153 0 .277.124.277.277v16.724a.278.278 0 01-.277.278h-2.363a.278.278 0 01-.184-.07L80.648 8.1v11.622a.278.278 0 01-.278.278H77.31a.278.278 0 01-.278-.278z' fill={fill} />
      <path d='M144.777 13.042c-.175-2.832 1.015-5.98 3.464-8.429 5.326-5.326 16.418-4.58 16.481-4.575-.03.044-8.139 11.8-17.748 12.9-.742.085-1.476.119-2.197.104z' fill='#03ca9b' />
      <path d='M145.902 16.662c.275.438.599.847.974 1.222 3.288 3.288 9.23 2.677 13.271-1.364 5.342-5.342 4.575-16.482 4.575-16.482-.029.066-5.842 13.095-15.08 15.937-1.254.386-2.511.61-3.74.687z' fill='#03ca9b' />
    </svg>
  )
}

BitfinexIcon.propTypes = {
  fill: PropTypes.oneOf([
    'white', 'black',
  ]),
}

BitfinexIcon.defaultProps = {
  fill: 'white',
}

export default BitfinexIcon