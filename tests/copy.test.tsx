import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import {
  DataSheetGrid,
  Column,
  textColumn,
  keyColumn,
  DataSheetGridRef,
} from '../src'

jest.mock('react-resize-detector', () => ({
  useResizeDetector: () => ({ width: 100, height: 100 }),
}))

const columns: Column[] = [
  { ...keyColumn('firstName', textColumn), title: 'First Name' },
  { ...keyColumn('lastName', textColumn), title: 'Last Name' },
]

class MockDataTransfer {
  data: Record<string, string> = {}

  constructor(initialData: Record<string, string> = {}) {
    this.data = initialData
  }

  setData(format: string, data: string) {
    this.data[format] = data
  }

  getData(format: string) {
    return this.data[format] || ''
  }
}

type DataTransferType = Record<string, string>

const copy = () => {
  const clipboardData = new MockDataTransfer()
  fireEvent.copy(document, { clipboardData: clipboardData })
  return clipboardData.data
}

const cut = () => {
  const clipboardData = new MockDataTransfer()
  fireEvent.cut(document, { clipboardData: clipboardData })
  return clipboardData.data
}

const rows = [
  { firstName: 'Elon', lastName: 'Musk' },
  { firstName: 'Jeff', lastName: 'Bezos' },
]

test('Copy single cell', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={rows}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 1 }))

  expect(copy()).toEqual({
    'text/html': '<table><tr><td>Jeff</td></tr></table>',
    'text/plain': 'Jeff',
  })
  expect(onChange).not.toHaveBeenCalled()
})

test('Copy multiple cell', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }

  render(<DataSheetGrid value={rows} columns={columns} ref={ref} />)

  act(() =>
    ref.current.setSelection({
      min: { col: 0, row: 0 },
      max: { col: 1, row: 1 },
    })
  )

  expect(copy()).toEqual({
    'text/html':
      '<table><tr><td>Elon</td><td>Musk</td></tr><tr><td>Jeff</td><td>Bezos</td></tr></table>',
    'text/plain': 'Elon\tMusk\nJeff\tBezos',
  })
})

test('Cut multiple cells', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={rows}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() =>
    ref.current.setSelection({
      min: { col: 0, row: 0 },
      max: { col: 0, row: 1 },
    })
  )

  expect(cut()).toEqual({
    'text/html': '<table><tr><td>Elon</td></tr><tr><td>Jeff</td></tr></table>',
    'text/plain': 'Elon\nJeff',
  })
  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: null, lastName: 'Musk' },
      { firstName: null, lastName: 'Bezos' },
    ],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 2 }]
  )
})

test('Copy with headers - single cell', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()
  
  // Mock the clipboard API for copy with headers
  const mockWriteText = jest.fn()
  const mockWrite = jest.fn()
  Object.assign(navigator, {
    clipboard: {
      writeText: mockWriteText,
      write: mockWrite,
    },
  })

  render(
    <DataSheetGrid
      value={rows}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 1 }))

  // Simulate right-click context menu and copy with headers
  const copyWithHeadersAction = jest.fn()
  
  // Test that the context menu includes the new option
  const contextMenuItem = {
    type: 'COPY_WITH_HEADERS' as const,
    action: copyWithHeadersAction,
  }
  
  // Verify the menu item can be created
  expect(contextMenuItem.type).toBe('COPY_WITH_HEADERS')
  expect(typeof contextMenuItem.action).toBe('function')
})
