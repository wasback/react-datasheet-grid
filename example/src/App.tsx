import React, { useState } from 'react'
import {
  checkboxColumn,
  Column,
  DataSheetGrid,
  keyColumn,
  textColumn,
} from '../../src'
import '../../src/style.css'

type Row = {
  active: boolean
  firstName: string | null
  lastName: string | null
}

function App() {
  const [data, setData] = useState<Row[]>([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

  const columns: Column<Row>[] = [
    {
      ...keyColumn<Row, 'active'>('active', checkboxColumn),
      title: 'Active',
      grow: 0.5,
    },
    {
      ...keyColumn<Row, 'firstName'>('firstName', textColumn),
      title: 'First name',
    },
    {
      ...keyColumn<Row, 'lastName'>('lastName', textColumn),
      title: 'Last name',
      grow: 2,
    },
  ]

  // Handler for Open line in Editor
  const handleOpenLineInEditor = (
    lineNumber: number,
    columnValue: any,
    columnKey: string
  ) => {
    // For this example, log the line number and firstName value
    console.log(`Line: ${lineNumber}, ${columnKey}: ${columnValue}`)
  }

  return (
    <div
      style={{
        margin: '50px',
        padding: '50px',
        maxWidth: '900px',
        background: '#f3f3f3',
      }}
    >
      <DataSheetGrid
        value={data}
        onChange={setData}
        columns={columns}
        onOpenLineInEditor={handleOpenLineInEditor}
      />
    </div>
  )
}

export default App
