import React, { memo, useEffect } from 'react'
import _isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { Spinner } from '@ufx-ui/core'
import Modal from '../../ui/Modal'

const CcyInfoModal = ({
  onClose,
  isModalVisible,
  fetchCcyArticle,
  article,
}) => {
  useEffect(() => {
    if (isModalVisible && _isEmpty(article)) {
      fetchCcyArticle()
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

CcyInfoModal.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchCcyArticle: PropTypes.func.isRequired,
  article: PropTypes.shape({
    body: PropTypes.string,
    title: PropTypes.string,
  }),
}

CcyInfoModal.defaultProps = {
  article: {
    body: null,
    title: null,
  },
}

export default memo(CcyInfoModal)
