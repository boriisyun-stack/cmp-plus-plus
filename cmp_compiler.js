/**
 * Cmp++ Compiler & Transpiler (C++ Dialect Version)
 * Translates between standard C++ and token-optimized Cmp++ syntax.
 * Focuses compression on C++ headers, standard library qualifiers,
 * STL utilities, types, control flow symbols, and external library API calls.
 */

const CmpCompiler = {
  // Mapping of common C++ headers to Cmp++ codes
  headerMap: {
    "iostream": "io",
    "vector": "vec",
    "string": "str",
    "algorithm": "alg",
    "memory": "mem",
    "map": "map",
    "set": "set",
    "utility": "utl",
    "fstream": "fst",
    "chrono": "chr",
    "thread": "thr",
    "cmath": "math",
    "cstdlib": "cstd",
    "raylib.h": "rl",
    "GL/gl.h": "gl",
    "vulkan/vulkan.h": "vk",
    "imgui.h": "img",
    "curl/curl.h": "crl",
    "nlohmann/json.hpp": "jsn",
    "sqlite3.h": "sql",
    "onnxruntime_cxx_api.h": "onx",
    "llama.h": "lla",
    "Eigen/Dense": "egn",
    "fftw3.h": "fft",
    "tbb/tbb.h": "tbb",
    "catch2/catch_test_macros.hpp": "cat",
    "llvm/IR/LLVMContext.h": "llvm"
  },

  // Reverse mapping of Cmp++ codes to C++ headers
  reverseHeaderMap: {
    "io": "iostream",
    "vec": "vector",
    "str": "string",
    "alg": "algorithm",
    "mem": "memory",
    "map": "map",
    "set": "set",
    "utl": "utility",
    "fst": "fstream",
    "chr": "chrono",
    "thr": "thread",
    "math": "cmath",
    "cstd": "cstdlib",
    "rl": "raylib.h",
    "gl": "GL/gl.h",
    "vk": "vulkan/vulkan.h",
    "img": "imgui.h",
    "crl": "curl/curl.h",
    "jsn": "nlohmann/json.hpp",
    "sql": "sqlite3.h",
    "onx": "onnxruntime_cxx_api.h",
    "lla": "llama.h",
    "egn": "Eigen/Dense",
    "fft": "fftw3.h",
    "tbb": "tbb/tbb.h",
    "cat": "catch2/catch_test_macros.hpp",
    "llvm": "llvm/IR/LLVMContext.h"
  },

  // Dictionary for semantic prompt translation (for prompt mode)
  semanticDict: {
    "데이터베이스": "db",
    "사용자": "usr",
    "이메일": "email",
    "결과": "res",
    "오류": "err",
    "성공": "ok",
    "만약": "if",
    "그리고": "and",
    "또는": "or",
    "조회해줘": "get",
    "생성해줘": "new",
    "삭제해줘": "del",
    "출력해줘": "pr"
  },

  reverseSemanticDict: {
    "db": "database",
    "usr": "user",
    "email": "email",
    "res": "result",
    "err": "error",
    "ok": "success",
    "if": "if",
    "and": "and",
    "or": "or",
    "get": "retrieve",
    "new": "create",
    "del": "delete",
    "pr": "print"
  },

  // 1. C++ TO CMP++ COMPILER
  compileCode: function(cppCode) {
    if (!cppCode) return "";

    let lines = cppCode.split("\n");
    let cmpLines = [];

    for (let line of lines) {
      let trimmed = line.trim();
      let indent = line.match(/^\s*/)[0];
      if (!trimmed) {
        cmpLines.push("");
        continue;
      }

      // Single line comments
      if (trimmed.startsWith("//")) {
        cmpLines.push(indent + "#" + trimmed.substring(2).trim());
        continue;
      }

      // Headers: #include <header> or #include "header"
      let headerMatch = trimmed.match(/^#include\s+<([^>]+)>/);
      if (headerMatch) {
        let name = headerMatch[1];
        if (name.startsWith("boost/")) {
          let boostHeader = name.substring(6).replace(/\.hpp$/, "");
          cmpLines.push(indent + `#i bst/${boostHeader}`);
        } else {
          let code = this.headerMap[name] || name;
          cmpLines.push(indent + `#i ${code}`);
        }
        continue;
      }
      let customHeaderMatch = trimmed.match(/^#include\s+"([^"]+)"/);
      if (customHeaderMatch) {
        cmpLines.push(indent + `#i "${customHeaderMatch[1]}"`);
        continue;
      }

      // Remove using namespace std;
      if (trimmed.startsWith("using namespace std;")) {
        continue;
      }

      // Main function: int main() or int main(int argc, char** argv)
      let mainMatch = trimmed.match(/^int\s+main\s*\(([^)]*)\)/);
      if (mainMatch) {
        let args = mainMatch[1].trim();
        if (!args) {
          cmpLines.push(indent + "i_m {");
        } else {
          cmpLines.push(indent + `i_m(${args}) {`);
        }
        continue;
      }

      let compiled = trimmed
        // Remove std:: prefix
        .replace(/\bstd::/g, "")
        // Stream operations
        .replace(/\bcout\b/g, "out")
        .replace(/\bcin\b/g, "in")
        .replace(/\bendl\b/g, "el")
        // Control flow keywords -> Unicode dense symbols
        .replace(/\bif\b/g, "?")
        .replace(/\belse\b/g, "|")
        .replace(/\bwhile\b/g, "⟲")
        .replace(/\bfor\b/g, "⟳")
        .replace(/\breturn\b/g, "→")
        // Types & modifiers
        .replace(/\bconst\s+auto\s*&\b/g, "c&")
        .replace(/\bvector\s*</g, "v<")
        .replace(/\bshared_ptr\s*</g, "sp<")
        .replace(/\bunique_ptr\s*</g, "up<")
        .replace(/\bstring\b/g, "str")
        .replace(/\bfloat\b/g, "fl")
        .replace(/\bbool\b/g, "bl")
        .replace(/\btrue\b/g, "tr")
        .replace(/\bfalse\b/g, "fs")
        .replace(/\bint\b/g, "it")
        .replace(/\bvoid\b/g, "vd")
        .replace(/\bdouble\b/g, "db")
        .replace(/\bchar\b/g, "ch")
        .replace(/\bstruct\b/g, "st")
        // Constants
        .replace(/\bnullptr\b/g, "Ø")
        // Functions
        .replace(/\brand\s*\(/g, "ran(")
        .replace(/\bstd::to_string\s*\(/g, "to_str(")
        .replace(/\bto_string\s*\(/g, "to_str(")
        // Raylib shorthand
        .replace(/\bInitWindow\s*\(/g, "init_w(")
        .replace(/\bWindowShouldClose\s*\(/g, "w_close(")
        .replace(/\bBeginDrawing\s*\(/g, "draw_b(")
        .replace(/\bEndDrawing\s*\(/g, "draw_e(")
        .replace(/\bClearBackground\s*\(/g, "bg_cls(")
        .replace(/\bDrawRectangle\s*\(/g, "rect(")
        .replace(/\bDrawCircle\s*\(/g, "circ(")
        .replace(/\bDrawText\s*\(/g, "text(")
        .replace(/\bIsKeyPressed\s*\(/g, "key_p(")
        .replace(/\bIsKeyDown\s*\(/g, "key_d(")
        .replace(/\bSetTargetFPS\s*\(/g, "set_fps(")
        .replace(/\bDrawLineEx\s*\(/g, "line(")
        .replace(/\bDrawTriangle\s*\(/g, "tri(")
        .replace(/\bDrawCircleSector\s*\(/g, "sect(")
        .replace(/\bGetFrameTime\s*\(/g, "dt(")
        .replace(/\bFade\s*\(/g, "fade(")
        // Actions
        .replace(/\.push_back\b/g, ".pb")
        .replace(/\bsort\(([^.]+)\.begin\(\),\s*\1\.end\(\)\)/g, "srt($1)")
        .replace(/\bstatic_cast\s*<\s*([^>]+)\s*>\s*\(([^)]+)\)/g, "sc<$1>($2)")
        .replace(/\bdynamic_cast\s*<\s*([^>]+)\s*>\s*\(([^)]+)\)/g, "dc<$1>($2)")
        .replace(/\bmove\(([^)]+)\)/g, "mv($1)")
        // Semicolons: strip trailing semicolon
        .replace(/;+$/, "")
        // Operator Spacings (safe operations)
        .replace(/\s*<<\s*/g, "<<")
        .replace(/\s*>>\s*/g, ">>")
        .trim();

      if (compiled) {
        cmpLines.push(indent + compiled);
      }
    }

    return cmpLines.join("\n");
  },

  // 2. CMP++ TO STANDARD C++ DECOMPILER (TRANSPILER)
  decompileCode: function(cmpCode) {
    if (!cmpCode) return "";

    let lines = cmpCode.split("\n");
    let cppLines = [];
    let hasHeader = false;
    let inStruct = false;
    let structBraceCount = 0;

    for (let line of lines) {
      let trimmed = line.trim();
      let indent = line.match(/^\s*/)[0];
      
      if (trimmed.startsWith("struct ") || trimmed.startsWith("st ")) {
        inStruct = true;
        structBraceCount = 0;
      }
      if (inStruct) {
        for (let char of trimmed) {
          if (char === '{') structBraceCount++;
          if (char === '}') structBraceCount--;
        }
      }
      if (!trimmed) {
        cppLines.push("");
        continue;
      }

      // Handle comments
      if (trimmed.startsWith("#") && !trimmed.startsWith("#i ")) {
        cppLines.push(indent + "// " + trimmed.substring(1).trim());
        continue;
      }

      // Headers: #i io vec -> #include <iostream>\n#include <vector>
      if (trimmed.startsWith("#i ")) {
        hasHeader = true;
        let parts = trimmed.substring(3).trim().split(/\s+/);
        for (let p of parts) {
          if (p.startsWith('"') && p.endsWith('"')) {
            cppLines.push(indent + `#include ${p}`);
          } else if (p.startsWith("bst/")) {
            let boostHeader = p.substring(4);
            cppLines.push(indent + `#include <boost/${boostHeader}.hpp>`);
          } else {
            let headerName = this.reverseHeaderMap[p] || p;
            cppLines.push(indent + `#include <${headerName}>`);
          }
        }
        continue;
      }

      // Main function
      if (trimmed.startsWith("i_m")) {
        let hasBrace = trimmed.includes("{") ? " {" : "";
        let mainMatch = trimmed.match(/^i_m\s*\(([^)]*)\)/);
        if (mainMatch) {
          cppLines.push(indent + `int main(${mainMatch[1].trim()})${hasBrace}`);
        } else {
          cppLines.push(indent + `int main()${hasBrace}`);
        }
        continue;
      }

      let decompiled = trimmed
        // Else condition: | -> else (matches leading | or | after })
        .replace(/\}\s*\|\s*/g, "} else ")
        .replace(/^\|\s*/g, "else ")
        // If condition: ? condition -> if (condition) or else if (condition)
        .replace(/^(\}\s*else\s+)?(else\s+)?\?\s*([^→{]+)/g, (match, braceElse, elsePrefix, cond) => {
          let p = (braceElse || "") + (elsePrefix || "");
          let c = cond.trim();
          if (c.startsWith("(") && c.endsWith(")")) {
            return `${p}if ${c} `;
          }
          return `${p}if (${c}) `;
        })
        // Loops: ⟲ condition -> while (condition) (only matches leading)
        .replace(/^⟲\s*([^→{]+)/g, (match, cond) => {
          let c = cond.trim();
          if (c.startsWith("(") && c.endsWith(")")) {
            return `while ${c} `;
          }
          return `while (${c}) `;
        })
        // Loops: ⟳ condition -> for (condition) (only matches leading)
        .replace(/^⟳\s*([^→{]+)/g, (match, cond) => {
          let c = cond.trim();
          if (c.startsWith("(") && c.endsWith(")")) {
            return `for ${c} `;
          }
          return `for (${c}) `;
        })
        // Stream I/O
        .replace(/\bout\b/g, "std::cout")
        .replace(/\bin\b/g, "std::cin")
        .replace(/\bel\b/g, "std::endl")
        // Returns: → x -> return x
        .replace(/→\s*(.*)/g, "return $1")
        .replace(/\brt\s*(.*)/g, "return $1")
        // Types
        .replace(/\bc&/g, "const auto&")
        .replace(/\bstr\b/g, "std::string")
        .replace(/\bv\s*<\s*([^>]+)\s*>/g, "std::vector<$1>")
        .replace(/\bsp\s*<\s*([^>]+)\s*>/g, "std::shared_ptr<$1>")
        .replace(/\bup\s*<\s*([^>]+)\s*>/g, "std::unique_ptr<$1>")
        .replace(/\bfl\b/g, "float")
        .replace(/\bbl\b/g, "bool")
        .replace(/\btr\b/g, "true")
        .replace(/\bfs\b/g, "false")
        .replace(/\bit\b/g, "int")
        .replace(/\bvd\b/g, "void")
        .replace(/\bdb\b/g, "double")
        .replace(/\bch\b/g, "char")
        .replace(/\bst\b/g, "struct")
        // Functions
        .replace(/\bran\s*\(/g, "rand(")
        .replace(/\bto_str\s*\(/g, "std::to_string(")
        // Raylib shorthand back to standard
        .replace(/\binit_w\s*\(/g, "InitWindow(")
        .replace(/\bw_close\s*\(/g, "WindowShouldClose(")
        .replace(/\bdraw_b\s*\(/g, "BeginDrawing(")
        .replace(/\bdraw_e\s*\(/g, "EndDrawing(")
        .replace(/\bbg_cls\s*\(/g, "ClearBackground(")
        .replace(/\brect\s*\(/g, "DrawRectangle(")
        .replace(/\bcirc\s*\(/g, "DrawCircle(")
        .replace(/\btext\s*\(/g, "DrawText(")
        .replace(/\bkey_p\s*\(/g, "IsKeyPressed(")
        .replace(/\bkey_d\s*\(/g, "IsKeyDown(")
        .replace(/\bset_fps\s*\(/g, "SetTargetFPS(")
        .replace(/\bline\s*\(/g, "DrawLineEx(")
        .replace(/\btri\s*\(/g, "DrawTriangle(")
        .replace(/\bsect\s*\(/g, "DrawCircleSector(")
        .replace(/\bdt\s*\(/g, "GetFrameTime(")
        .replace(/\bfade\s*\(/g, "Fade(")
        // Actions
        .replace(/\.pb\b/g, ".push_back")
        .replace(/\bsrt\(([^)]+)\)/g, "std::sort($1.begin(), $1.end())")
        .replace(/\bsc\s*<\s*([^>]+)\s*>\s*\(([^)]+)\)/g, "static_cast<$1>($2)")
        .replace(/\bdc\s*<\s*([^>]+)\s*>\s*\(([^)]+)\)/g, "dynamic_cast<$1>($2)")
        .replace(/\bmv\(([^)]+)\)/g, "std::move($1)")
        // Constants
        .replace(/Ø/g, "nullptr")
        // Restore common math operators
        .replace(/≤/g, "<=")
        .replace(/≥/g, ">=");

      // Safety trim before semicolon insertion
      decompiled = decompiled.trim();

      // Check if semicolon is needed at the end of the line
      let needsSemicolon = true;
      if (decompiled.endsWith("{") || 
          decompiled.endsWith(",") ||
          decompiled.endsWith(":") ||
          decompiled.endsWith("[") ||
          decompiled.endsWith("(") ||
          (decompiled.endsWith("}") && decompiled.startsWith("}")) || 
          decompiled.startsWith("#") || 
          decompiled.startsWith("//") ||
          decompiled.startsWith("if") || 
          decompiled.startsWith("else") ||
          decompiled.startsWith("while") ||
          decompiled.startsWith("for") ||
          decompiled.startsWith("int main") ||
          decompiled.startsWith("void main")) {
        needsSemicolon = false;
      }

      if (needsSemicolon && !decompiled.endsWith(";")) {
        decompiled += ";";
      }

      if (inStruct && structBraceCount <= 0) {
        if (!decompiled.endsWith(";")) {
          decompiled += ";";
        }
        inStruct = false;
      }

      cppLines.push(indent + decompiled);
    }

    // Auto prepend using namespace std; or some common headers if missing
    if (!hasHeader) {
      cppLines.unshift("#include <iostream>");
    }

    return cppLines.join("\n");
  },

  // 2.5. CMP++ TO JAVASCRIPT TRANSPILER (For Running Without g++)
  transpileToJS: function(cmpCode) {
    if (!cmpCode) return "";
    let lines = cmpCode.split("\n");
    let setupLines = [];
    let loopLines = [];
    let isInsideLoop = false;
    let braceCount = 0;
    
    // Parse struct definitions first to map object constructs
    let structFields = {};
    let structRegex = /\b(st|struct)\s+(\w+)\s*\{([^}]+)\}/g;
    let match;
    let cleanCode = cmpCode;
    while ((match = structRegex.exec(cmpCode)) !== null) {
      let name = match[2];
      let body = match[3];
      let fields = [];
      let fieldRegex = /\b\w+\s+(\w+)\b/g;
      let fMatch;
      while ((fMatch = fieldRegex.exec(body)) !== null) {
        fields.push(fMatch[1]);
      }
      structFields[name] = fields;
    }
    
    // Clean struct declarations from execution lines
    cleanCode = cleanCode.replace(/\b(st|struct)\s+\w+\s*\{[^}]+\};?/g, '');
    
    lines = cleanCode.split('\n');
    for (let line of lines) {
      let trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      if (trimmed.includes('i_m') || trimmed.includes('int main')) {
        continue;
      }
      
      // Match the main Raylib while loop
      if (trimmed.match(/^(⟲|while)\s*\(!?w_close\(\)\)/)) {
        isInsideLoop = true;
        braceCount = 1;
        continue;
      }
      
      if (isInsideLoop) {
        for (let char of trimmed) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }
        if (braceCount <= 0) {
          isInsideLoop = false;
          continue;
        }
        loopLines.push(line);
      } else {
        if (trimmed === '}' && setupLines.length > 5 && !trimmed.includes('{')) {
          continue;
        }
        setupLines.push(line);
      }
    }
    
    let transpileLine = (line) => {
      let js = line
        .replace(/\bit\s+/g, 'let ')
        .replace(/\bbl\s+/g, 'let ')
        .replace(/\bvd\s+/g, 'let ')
        .replace(/\bdb\s+/g, 'let ')
        .replace(/\bch\s+/g, 'let ')
        .replace(/\bst\s+/g, 'let ')
        .replace(/\btr\b/g, 'true')
        .replace(/\bfs\b/g, 'false')
        .replace(/\bint\s+/g, 'let ')
        .replace(/\bfloat\s+/g, 'let ')
        .replace(/\bfl\s+/g, 'let ')
        .replace(/\bbool\s+/g, 'let ')
        .replace(/\bdouble\s+/g, 'let ')
        .replace(/\bauto\s+/g, 'let ')
        .replace(/\bstr\s+/g, 'let ')
        .replace(/\bstd::string\s+/g, 'let ')
        .replace(/\bv\s*<\s*[^>]+\s*>\s*(\w+)/g, 'let $1 = []')
        .replace(/\bstd::vector\s*<\s*[^>]+\s*>\s*(\w+)/g, 'let $1 = []')
        .replace(/⟳/g, 'for')
        .replace(/⟲/g, 'while')
        .replace(/\?/g, 'if')
        .replace(/\|/g, 'else')
        .replace(/→/g, 'return')
        .replace(/for\s*\(([^:]+):([^)]+)\)/g, (m, left, right) => {
          let varName = left.trim().split(/\s+/).pop().replace(/[&*]/g, '');
          return `for (let ${varName} of ${right.trim()})`;
        })
        .replace(/\.pb\s*\(/g, '.push(')
        .replace(/\.clear\s*\(\)/g, '.length = 0')
        .replace(/\.size\s*\(\)/g, '.length')
        .replace(/(\w+)\.back\(\)/g, '$1[$1.length - 1]')
        .replace(/\bsc\s*<\s*[^>]+\s*>\s*\(([^)]+)\)/g, 'Number($1)')
        .replace(/\bstatic_cast\s*<\s*[^>]+\s*>\s*\(([^)]+)\)/g, 'Number($1)')
        .replace(/\bstd::to_string\b/g, 'String')
        .replace(/\bto_str\b/g, 'String')
        .replace(/\.c_str\(\)/g, '')
        .replace(/\bran\s*\(\)/g, 'Math.floor(Math.random() * 32768)')
        .replace(/\brand\s*\(\)/g, 'Math.floor(Math.random() * 32768)')
        .replace(/\bcos\b/g, 'Math.cos')
        .replace(/\bsin\b/g, 'Math.sin')
        .replace(/Vector2\s*\{\s*([^,]+)\s*,\s*([^}]+)\}/g, '{x: $1, y: $2}')
        .replace(/Ø/g, 'null');
        
      for (let sName in structFields) {
        let fields = structFields[sName];
        let regex = new RegExp(`\\b${sName}\\s*\\{([^}]+)\\}`, 'g');
        js = js.replace(regex, (m, argsStr) => {
          let args = argsStr.split(',').map(a => a.trim());
          let objStr = '{';
          for (let i = 0; i < fields.length; i++) {
            objStr += `${fields[i]}: ${args[i] || '0'}${i < fields.length - 1 ? ', ' : ''}`;
          }
          objStr += '}';
          return objStr;
        });
      }
      return js;
    };
    
    let compiledSetup = setupLines.map(transpileLine).join('\n');
    let compiledLoop = loopLines.map(transpileLine).join('\n');
    
    return `
(function() {
  // Struct instantiations & Setup
  ${compiledSetup}
  
  // Game Loop Tick function
  window._raylibTick = function() {
    ${compiledLoop}
  };
})();
    `;
  },

  // 3. SEMANTIC COMPRESSION (Prompt Mode)
  compileSemantic: function(prompt) {
    if (!prompt) return "";
    let text = prompt;
    const sortedKeys = Object.keys(this.semanticDict).sort((a, b) => b.length - a.length);
    for (let key of sortedKeys) {
      const replacement = this.semanticDict[key];
      const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(escapedKey, 'g');
      text = text.replace(regex, replacement);
    }
    return text.trim();
  },

  decompileSemantic: function(cmpPrompt) {
    if (!cmpPrompt) return "";
    let words = cmpPrompt.split(/\b/);
    let decompiledWords = [];
    for (let word of words) {
      let trimmedWord = word.trim();
      if (!trimmedWord) {
        decompiledWords.push(word);
        continue;
      }
      if (this.reverseSemanticDict[trimmedWord]) {
        decompiledWords.push(this.reverseSemanticDict[trimmedWord]);
      } else {
        decompiledWords.push(word);
      }
    }
    return "Parsed Flow:\n" + decompiledWords.join('').trim();
  }
};

// Export if in Node, otherwise attach to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CmpCompiler;
} else {
  window.CmpCompiler = CmpCompiler;
}
