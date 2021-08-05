import React, { memo, useEffect } from 'react'
import _isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { Spinner } from '@ufx-ui/core'
import Modal from '../../ui/Modal'

const CCYInfoModal = ({
  onClose,
  isModalVisible,
  fetchCCYArticle,
  article,
}) => {
  useEffect(() => {
    if (isModalVisible && _isEmpty(article)) {
      fetchCCYArticle()
    }
  }, [isModalVisible])
  const { body, title } = article
  return (
    <Modal title={title} onClose={onClose} isOpen={isModalVisible}>
      {body ? (
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<p><span style="font-weight: 400;">Bitcoin is a consensus network that enables a new payment system and a completely digital money. It is the first decentralized peer-to-peer payment network that is powered by its users with no central authority or middlemen. Bitcoin can also be seen as the most prominent </span><a href="http://financialcryptography.com/mt/archives/001325.html" target="_blank" rel="noopener noreferrer"><span style="font-weight: 400;">triple entry bookkeeping system</span></a><span style="font-weight: 400;"> in existence.</span></p>\n<p> </p>\n<script src="https://widgets.coingecko.com/div/coingecko-coin-ticker-widget-div.js"></script>\n<div class="coingecko-coin-ticker-widget" data-currency="usd" data-coin-id="bitcoin" data-locale="en"></div>\n<h4> </h4>\n<p><span class="wysiwyg-underline"><strong>Resources</strong></span></p>\n<ul>\n<li><a href="https://bitcoin.org/en/" target="_blank" rel="noopener"><strong>Website</strong></a></li>\n<li><a href="https://www.reddit.com/r/Bitcoin/" target="_blank" rel="noopener"><strong>Reddit</strong></a></li>\n<li><a href="https://blockchain.info/"><strong>Explorer</strong></a></li>\n</ul>',
          }}
        />
      ) : (
        <Spinner />
      )}
    </Modal>
  )
}

CCYInfoModal.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchCCYArticle: PropTypes.func.isRequired,
  article: PropTypes.shape({
    body: PropTypes.string,
    title: PropTypes.string,
  }),
}

CCYInfoModal.defaultProps = {
  article: {
    body: null,
    title: null,
  },
}

export default memo(CCYInfoModal)
