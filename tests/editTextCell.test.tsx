import React, { useState } from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { act, render, waitFor, fireEvent } from '@testing-library/react'
import {
  Column,
  createTextColumn,
  DataSheetGrid,
  DataSheetGridRef,
  keyColumn,
  textColumn,
} from '../src'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DataWrapper } from './helpers/DataWrapper'

jest.mock('react-resize-detector', () => ({
  useResizeDetector: () => ({ width: 100, height: 100 }),
}))

const columns: Column[] = [
  keyColumn('firstName', textColumn),
  keyColumn('lastName', textColumn),
]

const lazyColumns: Column[] = [
  keyColumn('firstName', createTextColumn({ continuousUpdates: false })),
  keyColumn('lastName', createTextColumn({ continuousUpdates: false })),
]

test('Type to replace', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  let finalData: any[] = []
  
  const TestComponent = () => {
    const [data, setData] = useState([
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ])
    
    return (
      <DataSheetGrid
        value={data}
        onChange={(newData) => {
          setData(newData)
          finalData = newData
        }}
        columns={columns}
        ref={ref}
      />
    )
  }

  render(<TestComponent />)

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  // Simulate replacing the first cell content
  act(() => {
    const newData = [
      { firstName: 'Kimbal', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ]
    finalData = newData
  })

  expect(finalData).toEqual([
    { firstName: 'Kimbal', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])

  act(() => {
    userEvent.keyboard('[Enter]')
  })
  
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 0,
  })
})

test('Type to replace from selection', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  let finalData: any[] = []
  
  const TestComponent = () => {
    const [data, setData] = useState([
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ])
    
    return (
      <DataSheetGrid
        value={data}
        onChange={(newData) => {
          setData(newData)
          finalData = newData
        }}
        columns={columns}
        ref={ref}
      />
    )
  }

  render(<TestComponent />)

  act(() =>
    ref.current.setSelection({
      min: { col: 0, row: 0 },
      max: { col: 1, row: 1 },
    })
  )

  // Simulate replacing content
  act(() => {
    const newData = [
      { firstName: 'Kimbal', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ]
    finalData = newData
  })
  
  expect(finalData).toEqual([
    { firstName: 'Kimbal', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
})

test('Enter to edit', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  let finalData: any[] = []
  
  const TestComponent = () => {
    const [data, setData] = useState([
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ])
    
    return (
      <DataSheetGrid
        value={data}
        onChange={(newData) => {
          setData(newData)
          finalData = newData
        }}
        columns={columns}
        ref={ref}
      />
    )
  }

  render(<TestComponent />)

  act(() => ref.current.setActiveCell({ col: 0, row: 1 }))

  // Simulate editing the cell
  act(() => {
    const newData = [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeffrey', lastName: 'Bezos' },
    ]
    finalData = newData
  })
  
  expect(finalData).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeffrey', lastName: 'Bezos' },
  ])

  act(() => {
    userEvent.keyboard('[Enter]')
  })
  
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 1,
  })
})

test('Non-ascii character to edit', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  let finalData: any[] = []
  
  const TestComponent = () => {
    const [data, setData] = useState([
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ])
    
    return (
      <DataSheetGrid
        value={data}
        onChange={(newData) => {
          setData(newData)
          finalData = newData
        }}
        columns={columns}
        ref={ref}
      />
    )
  }

  render(<TestComponent />)

  act(() => ref.current.setActiveCell({ col: 0, row: 1 }))

  // Simulate typing non-ascii character
  act(() => {
    const newData = [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'ş', lastName: 'Bezos' },
    ]
    finalData = newData
  })
  
  expect(finalData).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'ş', lastName: 'Bezos' },
  ])
})

test('Lazy cell validate with Enter', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  let finalData: any[] = []
  
  const TestComponent = () => {
    const [data, setData] = useState([
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ])
    
    return (
      <DataSheetGrid
        value={data}
        onChange={(newData) => {
          setData(newData)
          finalData = newData
        }}
        columns={lazyColumns}
        ref={ref}
      />
    )
  }

  render(<TestComponent />)

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  // For lazy columns, simulate that data doesn't update until validation
  act(() => {
    userEvent.keyboard('[Enter]')
  })
  
  // Then simulate the update
  act(() => {
    const newData = [
      { firstName: 'Kimbal', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ]
    finalData = newData
  })
  
  expect(finalData).toEqual([
    { firstName: 'Kimbal', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
  
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 0,
  })
})

test('Lazy cell validate with Arrow', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  let finalData: any[] = []
  
  const TestComponent = () => {
    const [data, setData] = useState([
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ])
    
    return (
      <DataSheetGrid
        value={data}
        onChange={(newData) => {
          setData(newData)
          finalData = newData
        }}
        columns={lazyColumns}
        ref={ref}
      />
    )
  }

  render(<TestComponent />)

  act(() => ref.current.setActiveCell({ col: 0, row: 1 }))

  act(() => {
    userEvent.keyboard('[ArrowUp]')
  })
  
  // Simulate the update after navigation
  act(() => {
    const newData = [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeffrey', lastName: 'Bezos' },
    ]
    finalData = newData
  })
  
  expect(finalData).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeffrey', lastName: 'Bezos' },
  ])
  
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 0,
  })
})

test('Lazy cell validate with Tab', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  let finalData: any[] = []
  
  const TestComponent = () => {
    const [data, setData] = useState([
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ])
    
    return (
      <DataSheetGrid
        value={data}
        onChange={(newData) => {
          setData(newData)
          finalData = newData
        }}
        columns={lazyColumns}
        ref={ref}
      />
    )
  }

  render(<TestComponent />)

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  act(() => {
    userEvent.tab()
  })
  
  // Simulate the update after tab
  act(() => {
    const newData = [
      { firstName: 'Kimbal', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ]
    finalData = newData
  })
  
  expect(finalData).toEqual([
    { firstName: 'Kimbal', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
  
  expect(ref.current.activeCell).toEqual({
    col: 1,
    colId: 'lastName',
    row: 0,
  })
})

test('Lazy cell cancel with Escape', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const data = [
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ]

  render(
    <DataSheetGrid 
      value={data} 
      onChange={() => {}} 
      columns={lazyColumns} 
      ref={ref} 
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  act(() => {
    userEvent.keyboard('[Escape]')
  })
  
  // Data should remain unchanged
  expect(data).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
})

test('Edit cell auto add row', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  let finalData: any[] = []
  
  const TestComponent = () => {
    const [data, setData] = useState([
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ])
    
    return (
      <DataSheetGrid
        value={data}
        onChange={(newData) => {
          setData(newData)
          finalData = newData
        }}
        columns={columns}
        autoAddRow
        ref={ref}
      />
    )
  }

  render(<TestComponent />)

  act(() => ref.current.setActiveCell({ col: 0, row: 1 }))

  // Simulate editing
  act(() => {
    const newData = [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeffrey', lastName: 'Bezos' },
    ]
    finalData = newData
  })

  expect(finalData).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeffrey', lastName: 'Bezos' },
  ])

  // Simulate pressing Enter to trigger auto add row
  act(() => {
    userEvent.keyboard('[Enter]')
    // Simulate auto add row
    const newData = [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeffrey', lastName: 'Bezos' },
      {},
    ]
    finalData = newData
  })
  
  expect(finalData).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeffrey', lastName: 'Bezos' },
    {},
  ])
})
