# React 19 Migration Guide for react-datasheet-grid

This guide covers the migration of react-datasheet-grid to React 19 and provides best practices for optimizing your application with the new features.

## Compatibility

react-datasheet-grid now supports React 19 while maintaining backward compatibility with React 15-18. The library uses `forwardRef` internally to ensure refs work correctly across all React versions.

## What's New in React 19

### 1. `ref` as a Prop (Library Handles This Internally)
React 19 now supports `ref` as a regular prop, eliminating the need for `forwardRef`. However, react-datasheet-grid continues to use `forwardRef` internally to maintain compatibility with React 15-18.

For your own components:
**React 18 and earlier:**
```jsx
const MyComponent = React.forwardRef((props, ref) => {
  return <div ref={ref}>...</div>
})
```

**React 19 (optional, forwardRef still works):**
```jsx
const MyComponent = ({ ref, ...props }) => {
  return <div ref={ref}>...</div>
}
```

### 2. Updated Peer Dependencies
The library now supports React 19 in peer dependencies:
```json
{
  "peerDependencies": {
    "react": "^15.0.0 || ^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
  }
}
```

## Performance Optimizations

### 1. React Compiler Automatic Optimizations
React 19 includes a compiler that automatically optimizes your components. This means:

- **Manual memoization may be unnecessary**: The compiler can automatically optimize re-renders
- **`React.memo()` usage can be reduced**: Components are automatically optimized when beneficial
- **`useMemo` and `useCallback` are less critical**: The compiler handles many optimization cases

However, for react-datasheet-grid, we recommend keeping `React.memo()` on cell components since they render frequently with large datasets.

### 2. Best Practices for Cell Components

Cell components should still use `React.memo()` for optimal performance:

```jsx
const MyCell = React.memo(({ rowData, setRowData }) => {
  return <input value={rowData.value} onChange={e => setRowData({...rowData, value: e.target.value})} />
})
```

### 3. Column Configuration
Continue to memoize column configurations to prevent unnecessary re-renders:

```jsx
const columns = useMemo(() => [
  { ...keyColumn('id', textColumn), title: 'ID' },
  { ...keyColumn('name', textColumn), title: 'Name' },
], [])
```

## Migration Steps

### 1. Update Dependencies
```bash
npm install react@^19.0.0 react-dom@^19.0.0
npm install -D @types/react@^19.0.0 @types/react-dom@^19.0.0
```

### 2. Update Your Code
The library has been updated to work seamlessly with React 19. If you're using refs with DataSheetGrid:

**Before:**
```jsx
const gridRef = useRef<DataSheetGridRef>(null)
// ... usage remains the same
<DataSheetGrid ref={gridRef} />
```

**After:**
No changes needed! The library handles the transition internally.

### 3. Test Your Application
Run your existing tests to ensure compatibility. The library maintains backward compatibility with React 15-18 while supporting React 19.

## Security Considerations

React 19 includes improved security features:
- Better XSS protection in server components
- Improved sanitization of user inputs
- Enhanced error boundaries for better error isolation

## Testing

We've added React 19 compatibility tests. Run them with:
```bash
npm test -- react19Compatibility.test.tsx
```

## Troubleshooting

### Common Issues

1. **TypeScript errors with refs**: Ensure you've updated `@types/react` to version 19
2. **Build errors**: Clear your node_modules and reinstall dependencies
3. **Runtime errors**: Check that all your React-related dependencies are compatible with React 19

### Getting Help

If you encounter issues:
1. Check the [GitHub issues](https://github.com/nick-keller/react-datasheet-grid/issues)
2. Create a minimal reproduction
3. Report the issue with React version details

## Future Considerations

As React 19 matures:
- We may remove some manual optimizations as the compiler improves
- Additional performance features may be added
- Server component support could be explored for read-only grids 