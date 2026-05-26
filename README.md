# Cmp++: Token-Optimized C++ Programming Language Dialect

Cmp++ is a highly-efficient, token-compressed programming language dialect modeled after C++. It is designed specifically for Large Language Model (LLM) communications (AI-to-AI, AI-to-Compiler, or dense semantic prompting). By replacing verbose preprocessor directives, library namespaces, complex type declarations, and framework calls with short, dense semantic codes and loop symbols, Cmp++ decreases token footprint by **up to 70%**—reducing API latencies and saving costs.

Cmp++ is a **unified compiled language**. It compiles directly to native binaries on your computer using standard compilers (`g++` / `clang++`).

---

## 🛠 Features

1. **High Token Density**: Optimizes includes (`#i io vec rl`), type qualifiers (`c&`, `str`), and actions (`srt(x)`, `pb(val)`).
2. **Compact Controls**: Implements clean conditional and loop indicators:
   - `?` $\rightarrow$ `if`
   - `|` $\rightarrow$ `else`
   - `⟳` $\rightarrow$ `for`
   - `⟲` $\rightarrow$ `while`
   - `→` $\rightarrow$ `return`
3. **Broad Ecosystem Mappings**: Maps standard C++ headers and major external libraries (Boost, Raylib, OpenGL, Vulkan, libcurl, nlohmann/json, SQLite3, Eigen, ONNX Runtime, Catch2, LLVM, etc.) directly.
4. **Auto Linking Compiler**: The command-line compiler wrapper (`cmppp.js`) automatically detects library imports (e.g. `#i rl` for Raylib) and dynamically links the correct compile flags.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **C++ Compiler** (`g++` or `clang++` with C++17 support)
- **Raylib** (optional, required to run the game demos)
  - macOS: `brew install raylib`

### Compiling and Running
To compile a Cmp++ source file (`.cmp`), run the unified compiler script:

```bash
# Transpiles, compiles, and immediately executes the binary
node cmppp.js main.cmp -run

# Compile only to a custom binary output
node cmppp.js main.cmp -o my_app
```

---

## 🎮 Game Demonstrations

We have implemented two fully functioning graphical programs to prove Cmp++'s capabilities:

### 1. Snake Game (`snake.cmp`)
A classic Snake game written entirely in Cmp++ using Raylib.
- Features: Grid-based updates, keyboard direction inputs, wall/self-collisions, random food placement, scores, and space restart.
- Execute:
  ```bash
  node cmppp.js snake.cmp -run
  ```

### 2. Bad Apple Procedural Visualizer (`badapple.cmp`)
A smooth 60 FPS silhouette animation visualizer showing Touhou's iconic *Bad Apple!!* sequences.
- Features: Black-and-white vector animations, apple dropping, spinning yin-yang sector, Reimu head panning, Marisa broom flight with star fields, screen shattering transitions, and synchronized lyrics text.
- Execute:
  ```bash
  node cmppp.js badapple.cmp -run
  ```

---

## 📖 Specifications & Dictionary

For a full list of Cmp++ symbols, standard types, frameworks, and shorthands, refer to [DICTIONARY.md](./DICTIONARY.md).

---

## 📜 License

Licensed under the **Apache License, Version 2.0**. See the [LICENSE](./LICENSE) file for details.
