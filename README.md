# DataConverter

## Project Overview

This project is an online data conversion tool designed to provide precise binary, decimal, and hexadecimal conversions for data types used on Huawei Ascend platforms and industry-standard formats—including HIF8, FLOAT8_E4M3, and FLOAT4_E2M1—while supporting detailed bit-level visualization.

The project also integrates **RegViewer**, a Qt-based desktop tool for viewing and modifying register bits, supporting bit operations, shift modes, expression calculation, and ARMv8 register field display.

## Try It Live
[DataConverter](https://libohao666.github.io/DataConverter/)

### Currently Supported Data Types  

- INT64 / FLOAT64  
- FLOAT32  
- FLOAT16 / BFloat16 / INT16  
- FLOAT8_E4M3 / FLOAT8_E5M2 / INT8 / HIF8  
- FLOAT6_E2M3 / FLOAT6_E3M2  
- INT4 / FLOAT4_E2M1 / FLOAT4_E1M2

## Tab Pages

The web interface provides two tabs:

| Tab | Description |
|-----|-------------|
| **Data Converter** | Online data type converter with bit-level visualization for Ascend and IEEE floating-point formats |
| **RegViewer** | Introduction and documentation for the RegViewer desktop register viewing tool |

### Switching Tabs

Click the tab names in the top navigation bar to switch between the Data Converter and RegViewer pages.

## RegViewer (Web Edition)

RegViewer is now available as an **interactive web tool** directly in the browser — no Qt installation required. The original Qt/C++ source is also included in the `regviewer/` directory for desktop compilation.

### Features

- **Bit display**: Click any bit to toggle it on/off, with real-time set-bit count
- **Bit width modes**: 8, 16, 32, 64-bit (switchable via toolbar)
- **Multi-base I/O**: Binary (2), Octal (8), Decimal unsigned (10), Decimal signed, Hexadecimal (16), and Address Size (B/K/M/G/T/P/E) — all editable
- **Bit range operations**: Set, Clear, Invert, or Extract bits in a specified range (e.g. `8-15` or `3`)
- **Shift operations**: Logical, Arithmetic, and Rotate (left and right)
- **Bulk operations**: Set All, Clear All, Invert All
- **Expression calculator**: Full recursive-descent parser with C-compatible operator precedence, variable storage, and assignment support

### Bug Fixes vs. Original Desktop Version

| Bug | Original | Web Edition |
|-----|----------|-------------|
| Bit range input validation | No validation — invalid input could cause unexpected behavior | Input validated: range must be integers within current bit width, with error feedback |
| Calculator in non-64bit mode | Fails in 8/16/32-bit mode (e.g. `-1<<2*(2-3)`) | Works correctly in all width modes via BigInt arithmetic |
| Linux window always-on-top | Checkbox ineffective | N/A (web-based, no window management) |

### Expression Calculator Operators

| Category | Operators |
|----------|-----------|
| Arithmetic | `+  -  *  /  %  **` |
| Shift | `<<  >>` |
| Bitwise | `&  \|  ^  ~` |
| Relational | `<  >  <=  >=  ==  !=` |
| Logical | `&&  \|\|  !` |
| Assignment | `var=expr` |
| Number formats | `0x` hex, `0b` binary, `0o` octal, decimal |

`x` always refers to the current register value.

### Build Instructions

RegViewer is written with Qt Creator. To build:

1. Open `regviewer/RegViewer.pro` in Qt Creator
2. Configure your kit (e.g., Qt 5.x or Qt 6.x with MinGW/MSVC on Windows, GCC on Linux)
3. Build and run

The program requires files from the `regviewer/data/` directory (fonts, register data JSON, etc.) at runtime. Copy these files to the build output directory if needed.

### RegViewer Source Structure

```
regviewer/
├── RegViewer.pro          # Qt project file
├── main.cpp               # Application entry point
├── bits.cpp / bits.h      # Core bit manipulation
├── bitoperate.cpp / .h    # Bit range operations
├── bitbuttons.cpp / .h    # Bit toggle buttons UI
├── bitlineedit.cpp / .h   # Multi-format input fields
├── reginfo.cpp / .h       # Register information
├── regdisplay.cpp / .h    # Register field display
├── varsdisplay.cpp / .h   # Variable storage display
├── common.cpp / .h        # Common utilities
├── data/
│   ├── reg_data_armv8.json  # ARMv8 register definitions
│   ├── default_values.json  # Default values
│   ├── CALIST.TTF           # Custom font
│   └── help.md / help.pdf   # Help documentation
├── images/                 # Screenshots
└── third_part/             # Third-party libraries (cparse)
```

### Original Repository

RegViewer source is from [gitee.com/thelxz/regviewer_v2](https://gitee.com/thelxz/regviewer_v2.git).

# Acknowledgments
- The UI design of the Data Converter references the [IEEE-754 Floating Point Converter](https://www.h-schmidt.net/FloatConverter/IEEE754.html).
- RegViewer expression calculation is based on [cparse](https://github.com/cparse/cparse).
