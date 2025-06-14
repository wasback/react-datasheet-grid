import React, { useRef, useEffect } from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
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
          { firstName: 'Elon', lastName: 'Musk' },
          { firstName: 'Jeff', lastName: 'Bezos' },
        ]}
        columns={columns}
        ref={ref}
      />
    )
  }

  const { container } = render(<TestComponent />)
  
  // The component should render without errors
  expect(container).toBeInTheDocument()
  
  // Ref should be set
  expect(refWasSet).toBe(true)
})

test('React 19 compatibility - ref methods are available', () => {
  let refMethods: string[] = []

  const TestComponent = () => {
    const ref = useRef<DataSheetGridRef>(null)
    
    useEffect(() => {
      if (ref.current) {
        refMethods = Object.keys(ref.current)
      }
    }, [])

    return (
      <DynamicDataSheetGrid
        value={[
          { firstName: 'Elon', lastName: 'Musk' },
          { firstName: 'Jeff', lastName: 'Bezos' },
        ]}
        columns={columns}
        ref={ref}
      />
    )
  }

  render(<TestComponent />)
  
  // Check that ref methods are available
  expect(refMethods).toContain('activeCell')
  expect(refMethods).toContain('selection')
  expect(refMethods).toContain('setActiveCell')
  expect(refMethods).toContain('setSelection')
})

test('React 19 compatibility - StaticDataSheetGrid (exported as DataSheetGrid) works with ref', () => {
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
          { firstName: 'Static', lastName: 'Grid' },
        ]}
        columns={columns}
        ref={ref}
      />
    )
  }

  const { container } = render(<TestComponent />)
  
  // The component should render without errors
  expect(container).toBeInTheDocument()
  
  // Ref should be set
  expect(refWasSet).toBe(true)
})

test('React 19 compatibility - forwardRef still works across React versions', () => {
  // This test verifies that our forwardRef implementation works correctly
  // which ensures compatibility with both React 18 and React 19
  
  const refs: DataSheetGridRef[] = []
  
  const TestComponent = () => {
    const ref1 = useRef<DataSheetGridRef>(null)
    const ref2 = useRef<DataSheetGridRef>(null)
    
    useEffect(() => {
      if (ref1.current) refs.push(ref1.current)
      if (ref2.current) refs.push(ref2.current)
    }, [])

    return (
      <>
        <DynamicDataSheetGrid
          value={[{ firstName: 'Test1', lastName: 'User1' }]}
          columns={columns}
          ref={ref1}
        />
        <DataSheetGrid
          value={[{ firstName: 'Test2', lastName: 'User2' }]}
          columns={columns}
          ref={ref2}
        />
      </>
    )
  }

  render(<TestComponent />)
  
  // Both refs should be set
  expect(refs).toHaveLength(2)
  
  // Both should have the same interface
  expect(Object.keys(refs[0]).sort()).toEqual(Object.keys(refs[1]).sort())
}) 