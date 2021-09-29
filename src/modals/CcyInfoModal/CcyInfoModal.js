/* eslint-disable no-param-reassign */
import React, { memo, useEffect, useRef } from 'react'
import _isEmpty from 'lodash/isEmpty'
import _forEach from 'lodash/forEach'
import PropTypes from 'prop-types'
import InnerHTML from 'dangerously-set-html-content'
import { Spinner } from '@ufx-ui/core'
import Modal from '../../ui/Modal'

import './style.css'

const CcyInfoModal = ({
  onClose,
  isModalVisible,
  fetchCcyArticle,
  article,
}) => {
  const { body, title } = article

  const containerRef = useRef()
  useEffect(() => {
    if (isModalVisible && _isEmpty(article)) {
      fetchCcyArticle()
    }
  }, [article, fetchCcyArticle, isModalVisible])

  useEffect(() => {
    if (!body || !containerRef || !containerRef.current) {
      return
    }

    const links = containerRef.current.querySelectorAll('a')
    _forEach(links, link => {
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
    })
  }, [body])

  return (
    <Modal
      title={title}
      onClose={onClose}
      isOpen={isModalVisible}
      className='hfui-ccy-article-modal'
      width={1000}
      scrollable
    >
      <div ref={containerRef}>
        {body ? <InnerHTML html={body} /> : <Spinner />}
      </div>
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
