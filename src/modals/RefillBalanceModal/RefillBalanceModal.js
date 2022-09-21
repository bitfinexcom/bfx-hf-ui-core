import React from 'react'
import { useSelector } from 'react-redux'

import {
  getUIModalStateForKey,
} from '../../redux/selectors/ui'

import Modal from '../../ui/Modal'
import Input from '../../ui/Input'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

export default function RefillBalanceModal() {
  const isRefillBalanceModalVisible = useSelector(state => getUIModalStateForKey(state, UI_MODAL_KEYS.REFILL_BALANCE_MODAL))

  const onRefillBalanceModalClose = () => {
    // const { changeRefillBalanceModalState } = this.props
    // changeRefillBalanceModalState(false)
  }

  const onRefillBalanceModalSubmit = () => { //eslint-disable-line
    // todo
  }

  return (
    <Modal
      isOpen={isRefillBalanceModalVisible}
      label='Refilling Paper Balances'
      onClose={() => onRefillBalanceModalClose()}
      className='hfui-refillbalance__modal'
    >
      <div className='modal-content'>
        <Input placeholder='AAA' type='text' />
        <Input placeholder='BBB' type='text' />
        <Input placeholder='TESTBTC' type='text' />
        <Input placeholder='TESTUSDT' type='text' />
        <Input placeholder='TESTUSD' type='text' />
      </div>
      <Modal.Footer>
        <Modal.Button primary onClick={onRefillBalanceModalSubmit}>
          Submit
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}
