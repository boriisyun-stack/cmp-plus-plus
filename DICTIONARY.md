# Cmp++ Language Dictionary

This dictionary lists all native shorthand codes, symbols, keywords, standard library headers, external library bindings, and GUI API mappings defined in Cmp++.

---

## 1. Syntax Keywords & Operators

| Cmp++ Symbol | Standard C++ Equivalent | Description |
| :--- | :--- | :--- |
| `i_m { ... }` | `int main() { ... }` | Main execution entry point |
| `i_m(args) { ... }` | `int main(args) { ... }` | Main execution entry point with arguments |
| `?` | `if` | Conditional branch condition |
| `\|` | `else` | Otherwise conditional branch (single `\|` only, does not affect `\|\|` OR operator) |
| `⟳` | `for` | Iterate/For loop block |
| `⟲` | `while` | Condition/While loop block |
| `→` or `rt` | `return` | Function return operator |
| `Ø` | `nullptr` | Null pointer constant |
| `c&` | `const auto&` | Constant automatic reference type |
| `out << x` | `std::cout << x;` | Standard output stream insertion |
| `in >> x` | `std::cin >> x;` | Standard input stream extraction |
| `el` | `std::endl` | Stream end of line |

---

## 2. Standard Header Includes (`#i`)

| Cmp++ Code | C++ Header Include | Description |
| :--- | :--- | :--- |
| `#i io` | `#include <iostream>` | Input/Output streams |
| `#i vec` | `#include <vector>` | Dynamic array container |
| `#i str` | `#include <string>` | Standard string manipulation |
| `#i alg` | `#include <algorithm>` | Standard algorithms (sorting, search, etc.) |
| `#i mem` | `#include <memory>` | Smart pointers (shared_ptr, unique_ptr) |
| `#i map` | `#include <map>` | Associative key-value map container |
| `#i set` | `#include <set>` | Unique ordered set container |
| `#i utl` | `#include <utility>` | Pair, move, swap utilities |
| `#i fst` | `#include <fstream>` | File stream operations |
| `#i chr` | `#include <chrono>` | High-resolution duration and time points |
| `#i thr` | `#include <thread>` | Multi-threading operations |
| `#i math` | `#include <cmath>` | Mathematical computations (cos, sin, sqrt, etc.) |
| `#i cstd` | `#include <cstdlib>` | Standard library utilities (rand, exit, malloc) |

---

## 3. External Library Includes & Frameworks (`#i`)

| Cmp++ Code | C++ Header Include | Target Library | Compiler Linker Flags |
| :--- | :--- | :--- | :--- |
| `#i bst/asio` | `#include <boost/asio.hpp>` | Boost Asio (Network/IO) | Header-only (system paths) |
| `#i rl` | `#include <raylib.h>` | Raylib Graphic Game Engine | `-lraylib` |
| `#i gl` | `#include <GL/gl.h>` | OpenGL Graphics API | `-framework OpenGL` or `-lGL` |
| `#i vk` | `#include <vulkan/vulkan.h>` | Vulkan Graphics API | `-lvulkan` |
| `#i img` | `#include <imgui.h>` | Dear ImGui | Local headers |
| `#i crl` | `#include <curl/curl.h>` | libcurl Networking Client | `-lcurl` |
| `#i jsn` | `#include <nlohmann/json.hpp>` | nlohmann JSON parser | Header-only |
| `#i sql` | `#include <sqlite3.h>` | SQLite3 Database | `-lsqlite3` |
| `#i egn` | `#include <Eigen/Dense>` | Eigen (Matrix Arithmetic) | Header-only |
| `#i fft` | `#include <fftw3.h>` | FFTW3 (Fourier Transform) | `-lfftw3` |
| `#i tbb` | `#include <tbb/tbb.h>` | Intel OneTBB (Threading) | `-ltbb` |
| `#i onx` | `#include <onnxruntime_cxx_api.h>` | ONNX Runtime (AI Inference) | `-lonnxruntime` |
| `#i lla` | `#include <llama.h>` | llama.cpp (LLM Inference) | `-lllama` |
| `#i cat` | `#include <catch2/catch_test_macros.hpp>`| Catch2 Unit Testing Framework | `-lCatch2Main -lCatch2` |
| `#i llvm` | `#include <llvm/IR/LLVMContext.h>` | LLVM IR compiler parsing | `$(llvm-config --libs)` |

---

## 4. Types, Constants & Core Functions

| Cmp++ Shorthand | C++ Type / Function | Description |
| :--- | :--- | :--- |
| `fl` | `float` | 32-bit single-precision floating point type |
| `str` | `std::string` | String type |
| `v<T>` | `std::vector<T>` | Dynamic array container type |
| `sp<T>` | `std::shared_ptr<T>` | Shared ownership smart pointer type |
| `up<T>` | `std::unique_ptr<T>` | Unique ownership smart pointer type |
| `ran()` | `rand()` | Standard pseudo-random number generator |
| `pb(x)` | `push_back(x)` | Append element to back of vector |
| `srt(x)` | `std::sort(x.begin(), x.end())` | Sort container in ascending order |
| `mv(x)` | `std::move(x)` | Transfer resource ownership |
| `sc<T>(x)` | `static_cast<T>(x)` | Compile-time type cast |
| `dc<T>(x)` | `dynamic_cast<T>(x)` | Run-time type cast |

---

## 5. Raylib GUI Shorthands

These shorthands map directly to Raylib's window, input, shapes, text, and timing functions:

| Cmp++ Shorthand | Raylib API | Description |
| :--- | :--- | :--- |
| `init_w(w, h, t)` | `InitWindow(w, h, t)` | Creates graphic window of width `w`, height `h` with title `t` |
| `w_close()` | `WindowShouldClose()` | Evaluates to true if the window's close button or ESC is pressed |
| `draw_b()` | `BeginDrawing()` | Starts rendering frame cycle bounds |
| `draw_e()` | `EndDrawing()` | Ends rendering frame cycle, swapping buffers |
| `bg_cls(c)` | `ClearBackground(c)` | Clears the window screen to the selected color `c` |
| `draw_rect(x, y, w, h, c)`| `DrawRectangle(x, y, w, h, c)`| Renders a solid rectangle at `x`, `y` with dimensions `w` $\times$ `h` |
| `draw_circ(x, y, r, c)` | `DrawCircle(x, y, r, c)` | Renders a solid circle at center `x`, `y` with radius `r` |
| `draw_txt(t, x, y, s, c)` | `DrawText(t, x, y, s, c)` | Renders string `t` at coordinate `x`, `y` with size `s` in color `c` |
| `key_p(k)` | `IsKeyPressed(k)` | Evaluates to true if key `k` was pressed in this frame |
| `key_d(k)` | `IsKeyDown(k)` | Evaluates to true if key `k` is currently held down |
| `set_fps(f)` | `SetTargetFPS(f)` | Sets target rendering framerate to `f` frames per second |
