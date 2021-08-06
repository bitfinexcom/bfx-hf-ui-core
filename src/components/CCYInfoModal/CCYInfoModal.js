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
  console.log(article)
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
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: body,
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
