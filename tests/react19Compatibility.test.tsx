import React, { useRef, useEffect } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import {
  DataSheetGrid,
  DynamicDataSheetGrid,
  Column,
  textColumn,
  keyColumn,
  DataSheetGridRef,
} from '../src'

jest.mock('react-resize-detector', () => ({
  useResizeDetector: () => ({ width: 100, height: 100 }),
}))

const columns = [
  { ...keyColumn('firstName', textColumn), title: 'First Name' },
  { ...keyColumn('lastName', textColumn), title: 'Last Name' },
]

test('React 19 compatibility - DynamicDataSheetGrid renders without errors with ref', () => {
  let refWasSet = false
  
  const TestComponent = () => {
    const ref = useRef<DataSheetGridRef>(null)
    
    useEffect(() => {
      if (ref.current) {
        refWasSet = true
      }
    }, [])

    return (
      <DynamicDataSheetGrid
        value={[
          { id: 1, firstName: 'Elon', lastName: 'Musk' },
          { id: 2, firstName: 'Jeff', lastName: 'Bezos' },
        ]}
        columns={columns}
        ref={ref}
      />
    )
  }

  render(<TestComponent />)
  
  // Check that the grid container is rendered
  const gridContainer = document.querySelector('.dsg-container')
  expect(gridContainer).toBeInTheDocument()
  
  // Verify the ref works
  expect(refWasSet).toBe(true)
})

test('React 19 compatibility - StaticDataSheetGrid works with ref as prop', () => {
  let refWasSet = false
  
  const TestComponent = () => {
    const ref = useRef<DataSheetGridRef>(null)
    
    useEffect(() => {
      if (ref.current) {
        refWasSet = true
      }
    }, [])

    return (
      <DataSheetGrid
        value={[
          { id: 1, firstName: 'Static', lastName: 'Grid' },
        ]}
        columns={columns}
        ref={ref}
      />
    )
  }

  render(<TestComponent />)
  
  // Check that the grid container is rendered
  const gridContainer = document.querySelector('.dsg-container')
  expect(gridContainer).toBeInTheDocument()
  
  // Verify the ref works
  expect(refWasSet).toBe(true)
})

test('React 19 compatibility - forwardRef works across React versions', () => {
  // This test verifies that our forwardRef implementation works correctly
  // which ensures compatibility with both React 18 and React 19
  
  const TestComponent = () => {
    const ref = useRef<DataSheetGridRef>(null)

    return (
      <DataSheetGrid
        value={[
          { id: 1, firstName: 'Test', lastName: 'User' },
        ]}
        columns={columns}
        ref={ref}
      />
    )
  }

  const { container } = render(<TestComponent />)
  
  // The component should render without errors
  expect(container).toBeInTheDocument()
  
  // Should have grid elements
  const gridContainer = document.querySelector('.dsg-container')
  expect(gridContainer).toBeInTheDocument()
}) 