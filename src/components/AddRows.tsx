
import React, { useState } from 'react'
import type { FC } from 'react'
import type { AddRowsComponentProps } from '../types'

type AddRowsProps = Partial<{
  translationKeys: Partial<{ button: string; unit: string }>
  onAddClick: (count: number) => void
  showRowCountInput: boolean
}> & AddRowsComponentProps

export const AddRows: FC<AddRowsProps> = ({ addRows, onAddClick, translationKeys = {}, showRowCountInput = true }) => {
  const [value, setValue] = useState<number>(1)
  const [rawValue, setRawValue] = useState<string>(String(value))

  const handleClick = () => {
    if (onAddClick) {
      onAddClick(value)
    } else if (addRows) {
      addRows(value)
    }
  }

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleClick()
    }
  }

  return (
    <div className="dsg-add-row">
      <button
        type="button"
        className="dsg-add-row-btn"
        onClick={handleClick}
      >
        {translationKeys.button ?? 'Add'}
      </button>
      {showRowCountInput && (
        <>
          {' '}
          <input
            className="dsg-add-row-input"
            value={rawValue}
            onBlur={() => setRawValue(String(value))}
            type="number"
            min={1}
            onChange={(e) => {
              setRawValue(e.target.value)
              setValue(Math.max(1, Math.round(parseInt(e.target.value) || 0)))
            }}
            onKeyDown={handleEnter}
          />{' '}
          {translationKeys.unit ?? 'rows'}
        </>
      )}
    </div>
  )
}
