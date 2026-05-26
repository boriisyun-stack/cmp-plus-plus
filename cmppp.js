#!/usr/bin/env node

/**
 * Cmp++ Command Line Compiler & Runner
 * Transpiles Cmp++ (.cmp) files into C++ (.cpp) and compiles them using g++ / clang++.
 * 
 * Usage:
 *   node cmppp.js <file.cmp> [-r | -run] [-o <output_binary>]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CmpCompiler = require('./cmp_compiler.js');
const CmpTokenizer = require('./cmp_tokenizer.js');

function printUsage() {
  console.log(`
\x1b[1m\x1b[36mCmp++ Compiler (cmppp) v1.0.0\x1b[0m
Usage:
  node cmppp.js <file.cmp> [options]

Options:
  -r, -run      Compile and run the program immediately
  -w, -web      Run in browser-based Web Sandbox (g++-free)
  -o <name>     Specify output binary name (defaults to input file base name)
  -h, -help     Print this help menu
  `);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('-h') || args.includes('-help')) {
    printUsage();
    process.exit(0);
  }

  // Find input file
  const oIdx = args.indexOf('-o');
  const oVal = oIdx !== -1 ? args[oIdx + 1] : null;
  const inputFile = args.find(a => !a.startsWith('-') && a !== oVal);
  if (!inputFile) {
    console.error('\x1b[31mError: No input file specified.\x1b[0m');
    printUsage();
    process.exit(1);
  }

  if (!fs.existsSync(inputFile)) {
    console.error(`\x1b[31mError: Input file "${inputFile}" does not exist.\x1b[0m`);
    process.exit(1);
  }

  const inputExt = path.extname(inputFile);
  if (inputExt !== '.cmp') {
    console.warn(`\x1b[33mWarning: Input file does not have .cmp extension. Proceeding anyway...\x1b[0m`);
  }

  // Parse output binary name
  let outputBinary = 'a.out';
  if (oIdx !== -1 && args[oIdx + 1]) {
    outputBinary = args[oIdx + 1];
  } else {
    // Default to input file base name without extension
    outputBinary = path.basename(inputFile, inputExt);
  }

  // Parse Run flag
  const shouldRun = args.includes('-r') || args.includes('-run');
  
  // Parse Web Sandbox flag
  const forceWeb = args.includes('-w') || args.includes('-web') || args.includes('-sandbox');

  // Read .cmp source
  const cmpSource = fs.readFileSync(inputFile, 'utf-8');
  console.log(`\x1b[35m[1/4] Transpiling Cmp++ source "${inputFile}"...\x1b[0m`);

  // Transpile to C++
  const cppSource = CmpCompiler.decompileCode(cmpSource);

  // Write temporary C++ file
  const cppFile = inputFile.replace(inputExt, '.cpp');
  fs.writeFileSync(cppFile, cppSource, 'utf-8');
  console.log(`\x1b[35m[2/4] Generated standard C++ file "${cppFile}"...\x1b[0m`);

  // Tokenization Analysis
  const stats = CmpTokenizer.analyze(cppSource, cmpSource, 'gpt4');
  console.log(`\n\x1b[1m\x1b[32m=== Cmp++ Token Optimization Stats ===\x1b[0m`);
  console.log(`Original C++:  \x1b[33m${stats.original.tokens} tokens\x1b[0m (${stats.original.chars} chars)`);
  console.log(`Cmp++ Code:    \x1b[36m${stats.cmp.tokens} tokens\x1b[0m (${stats.cmp.chars} chars)`);
  console.log(`Token Savings: \x1b[1m\x1b[32m${stats.reduction.tokens}%\x1b[0m (${stats.reduction.chars}% character reduction)`);
  console.log(`======================================\n`);

  // Check if g++ is installed on the system
  let compilerFound = true;
  try {
    const checkCmd = process.platform === 'win32' ? 'where g++' : 'which g++';
    execSync(checkCmd, { stdio: 'ignore' });
  } catch (e) {
    compilerFound = false;
  }

  if (!compilerFound || forceWeb) {
    if (forceWeb) {
      console.log(`\n\x1b[35m[3/4] Launching the Cmp++ Web Sandbox to run "${inputFile}" in g++-free mode...\x1b[0m`);
    } else {
      console.log(`\n\x1b[33m[Warning] g++ compiler not found on your system. Running in g++-free mode...\x1b[0m`);
      console.log(`\x1b[35m[3/4] Launching the Cmp++ Web Sandbox to run "${inputFile}" without g++...\x1b[0m`);
    }
    
    // Write playground_code.js in Cwd so index.html can load it
    const escapedCode = cmpSource.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
    fs.writeFileSync(path.join(__dirname, 'playground_code.js'), `window.PLAYGROUND_CODE = \`${escapedCode}\`;`, 'utf-8');
    
    let openCmd = "";
    if (process.platform === 'darwin') openCmd = 'open index.html';
    else if (process.platform === 'win32') openCmd = 'start index.html';
    else openCmd = 'xdg-open index.html';
    
    try {
      execSync(openCmd, { cwd: __dirname });
      console.log(`\x1b[1m\x1b[32m[4/4] Web Sandbox launched successfully! Enjoy the game in your browser.\x1b[0m`);
    } catch (e) {
      console.error(`\x1b[31mError: Could not open browser automatically. Please open "${path.join(__dirname, 'index.html')}" manually.\x1b[0m`);
    }
    process.exit(0);
  }

  // Compile with system g++ (C++17)
  console.log(`\x1b[35m[3/4] Compiling standard C++ via g++...\x1b[0m`);
  
  // Detect Raylib dependency and add framework linking
  let linkFlags = "";
  if (cppSource.includes("#include <raylib.h>") || cmpSource.includes("#i rl")) {
    linkFlags += " -I/opt/homebrew/include -L/opt/homebrew/lib -lraylib -framework OpenGL -framework Cocoa -framework IOKit -framework CoreVideo";
  }
  if (cppSource.includes("#include <GL/gl.h>") || cppSource.includes("#include <OpenGL/gl.h>") || cmpSource.includes("#i gl")) {
    linkFlags += " -framework OpenGL";
  }
  if (cppSource.includes("#include <vulkan/") || cmpSource.includes("#i vk")) {
    linkFlags += " -lvulkan";
  }
  if (cppSource.includes("#include <curl/") || cmpSource.includes("#i crl")) {
    linkFlags += " -lcurl";
  }
  if (cppSource.includes("#include <sqlite3.h>") || cmpSource.includes("#i sql")) {
    linkFlags += " -lsqlite3";
  }
  if (cppSource.includes("#include <fftw3.h>") || cmpSource.includes("#i fft")) {
    linkFlags += " -lfftw3";
  }
  if (cppSource.includes("#include <tbb/") || cmpSource.includes("#i tbb")) {
    linkFlags += " -ltbb";
  }
  if (cppSource.includes("#include <llvm/") || cmpSource.includes("#i llvm")) {
    linkFlags += " $(llvm-config --cxxflags --ldflags --libs)";
  }
  if (cppSource.includes("#include <opencv2/") || cmpSource.includes("#i ocv")) {
    linkFlags += " -I/opt/homebrew/include/opencv4 -L/opt/homebrew/lib -lopencv_core -lopencv_imgproc -lopencv_videoio -lopencv_video";
  }
  
  const compileCmd = `g++ -std=c++17 "${cppFile}" -o "${outputBinary}"${linkFlags}`;
  
  try {
    execSync(compileCmd, { stdio: 'inherit' });
    console.log(`\x1b[1m\x1b[32m[4/4] Compilation Succeeded. Output binary: "${outputBinary}"\x1b[0m`);
  } catch (err) {
    console.error(`\x1b[31mError: Compilation failed during g++ invocation.\x1b[0m`);
    process.exit(1);
  }

  // Run immediately if requested
  if (shouldRun) {
    console.log(`\n\x1b[36m>>> Executing binary "${outputBinary}"... \x1b[0m\n`);
    try {
      const runPath = path.isAbsolute(outputBinary) ? outputBinary : `./${outputBinary}`;
      execSync(runPath, { stdio: 'inherit' });
      console.log(`\n\x1b[32m>>> Execution Finished successfully.\x1b[0m`);
    } catch (err) {
      console.error(`\n\x1b[31m>>> Program crashed with exit code during execution.\x1b[0m`);
    }
  }
}

main();
