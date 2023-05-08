import { css } from '@emotion/react'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import ActionIcon from '../common/ActionIcon'
import TextInput from '../common/TextInput'

const styles = {
    Wrapper: css({
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '10px 14px',
        gap: '11px'
    }),
}

function AlarmFooter() {
  return (
    <div css={styles.Wrapper}>
        <ActionIcon icon={faMagnifyingGlass} />
        <TextInput placeholder='검색어 입력' />
    </div>
  )
}

export default AlarmFooter