# @wasback/react-datasheet-grid

This is a fork of [react-datasheet-grid](https://github.com/nick-keller/react-datasheet-grid) with added support for React 19

## Install

```bash
npm install @wasback/react-datasheet-grid
```

## Usage

```tsx
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
} from '@wasback/react-datasheet-grid'

// Import the style only once in your app!
import 'react-datasheet-grid/dist/style.css'

const Example = () => {
  const [ data, setData ] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

  const columns = [
    {
      ...keyColumn('active', checkboxColumn),
      title: 'Active',
    },
    {
      ...keyColumn('firstName', textColumn),
      title: 'First name',
    },
    {
      ...keyColumn('lastName', textColumn),
      title: 'Last name',
    },
  ]

  return (
    <DataSheetGrid
      value={data}
      onChange={setData}
      columns={columns}
    />
  )
}
```
