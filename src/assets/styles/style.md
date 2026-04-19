# Style Guide (Pet Sanctuary)

## Palette (Warm / Day)
- **Background / surface**
  - `#fcf6ed` (surface)
  - `#f6f0e6` (surface container low)
- **Border / divider**
  - `#e2dcd1`
- **Text**
  - `#312e29` (primary)
  - `#5e5b54` (muted)
- **Brand**
  - `#914539` (primary)
  - `#fe9c8c` (primary container)
  - `#9ae1ff` (secondary container)
  - `#9bff9b` (tertiary container)

## Palette (Night)
- **Background**
  - `#0b0e18`
- **Text**
  - `#ececfd`
- **Brand**
  - `#ff85c9`
  - `#f672be`
  - `#8debff`
  - `#cca8ff`

## Radius / Shape
- **Card/table radius**
  - `0.75rem`

## Element Plus override structure
- **Folder**
  - `src/assets/styles/element-plus/`
- **Entry**
  - `src/assets/styles/element-plus/index.scss`
- **One component per file**
  - Example: `table.scss` contains `.el-table` overrides

## Notes
- Component overrides should prefer Element Plus CSS variables when available (e.g. `--el-table-*`) and then add structural rules (radius/border) for consistent visuals.
