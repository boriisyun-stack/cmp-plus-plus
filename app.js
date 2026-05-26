/**
 * Cmp++ Application Coordinator (C++ Dialect Version)
 * Binds UI events, loads C++ preset examples, and orchestrates compiler/tokenizer.
 */

document.addEventListener("DOMContentLoaded", () => {
  // App state
  let currentMode = "code"; // "code" or "semantic"

  // Elements
  const modeCodeBtn = document.getElementById("mode-code-btn");
  const modeSemanticBtn = document.getElementById("mode-semantic-btn");
  const tokenizerSelect = document.getElementById("tokenizer-select");
  const inputLabel = document.getElementById("input-label");
  const exampleSelect = document.getElementById("example-select");
  const editorInput = document.getElementById("editor-input");
  const editorOutput = document.getElementById("editor-output");
  const inputCharCount = document.getElementById("input-char-count");
  const inputTokenCount = document.getElementById("input-token-count");
  const outputCharCount = document.getElementById("output-char-count");
  const outputTokenCount = document.getElementById("output-token-count");
  const compileBtn = document.getElementById("compile-btn");
  const decompileBtn = document.getElementById("decompile-btn");
  const terminalContainer = document.getElementById("terminal-container");
  const gaugeRing = document.getElementById("gauge-ring");
  const reductionPercentage = document.getElementById("reduction-percentage");
  const savingsTagline = document.getElementById("savings-tagline");

  // Resource Metrics Elements
  const statsOrigTokens = document.getElementById("stats-orig-tokens");
  const statsCmpTokens = document.getElementById("stats-cmp-tokens");
  const statsOrigBytes = document.getElementById("stats-orig-bytes");
  const statsCmpBytes = document.getElementById("stats-cmp-bytes");
  const statsByteSaving = document.getElementById("stats-byte-saving");
  const statsOrigCost = document.getElementById("stats-orig-cost");
  const statsCmpCost = document.getElementById("stats-cmp-cost");
  const statsCostSaving = document.getElementById("stats-cost-saving");

  // Examples Presets (C++ Dialect and Prompt)
  const presets = {
    code: [
      {
        name: "Vector Sorting",
        input: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> nums = {9, 2, 7, 4, 5, 1, 8, 3, 6};\n    std::sort(nums.begin(), nums.end());\n    \n    std::cout << "Sorted nums: ";\n    for (const auto& num : nums) {\n        std::cout << num << " ";\n    }\n    std::cout << std::endl;\n    return 0;\n}`
      },
      {
        name: "Raylib Snake Game",
        input: `#include <iostream>\n#include <vector>\n#include <cstdlib>\n#include <chrono>\n#include <raylib.h>\n\nstruct Segment {\n    int x;\n    int y;\n};\n\nint main() {\n    int screenW = 800;\n    int screenH = 600;\n    int grid = 20;\n\n    InitWindow(screenW, screenH, "Cmp++ Snake Game");\n    SetTargetFPS(60);\n\n    std::vector<Segment> snake;\n    snake.push_back(Segment{20, 15});\n    snake.push_back(Segment{19, 15});\n    snake.push_back(Segment{18, 15});\n\n    int dirX = 1;\n    int dirY = 0;\n    int foodX = 5;\n    int foodY = 5;\n    int score = 0;\n    bool gameOver = false;\n    int frames = 0;\n\n    while (!WindowShouldClose()) {\n        if (!gameOver) {\n            frames++;\n            if (IsKeyPressed(KEY_RIGHT) && dirX != -1) { dirX = 1; dirY = 0; }\n            if (IsKeyPressed(KEY_LEFT) && dirX != 1) { dirX = -1; dirY = 0; }\n            if (IsKeyPressed(KEY_UP) && dirY != 1) { dirX = 0; dirY = -1; }\n            if (IsKeyPressed(KEY_DOWN) && dirY != -1) { dirX = 0; dirY = 1; }\n\n            if (frames >= 6) {\n                frames = 0;\n                for (int idx = snake.size() - 1; idx > 0; idx--) {\n                    snake[idx] = snake[idx - 1];\n                }\n                snake[0].x += dirX;\n                snake[0].y += dirY;\n\n                if (snake[0].x < 0 || snake[0].x >= screenW / grid || snake[0].y < 0 || snake[0].y >= screenH / grid) {\n                    gameOver = true;\n                }\n\n                for (int idx = 1; idx < snake.size(); idx++) {\n                    if (snake[0].x == snake[idx].x && snake[0].y == snake[idx].y) {\n                        gameOver = true;\n                    }\n                }\n\n                if (snake[0].x == foodX && snake[0].y == foodY) {\n                    score += 10;\n                    snake.push_back(Segment{snake.back().x, snake.back().y});\n                    foodX = rand() % (screenW / grid);\n                    foodY = rand() % (screenH / grid);\n                }\n            }\n        } else {\n            if (IsKeyPressed(KEY_SPACE)) {\n                snake.clear();\n                snake.push_back(Segment{20, 15});\n                snake.push_back(Segment{19, 15});\n                snake.push_back(Segment{18, 15});\n                dirX = 1; dirY = 0;\n                score = 0; gameOver = false; frames = 0;\n                foodX = rand() % (screenW / grid);\n                foodY = rand() % (screenH / grid);\n            }\n        }\n\n        BeginDrawing();\n        ClearBackground(BLACK);\n\n        DrawRectangle(0, 0, screenW, 5, DARKGRAY);\n        DrawRectangle(0, 0, 5, screenH, DARKGRAY);\n        DrawRectangle(0, screenH - 5, screenW, 5, DARKGRAY);\n        DrawRectangle(screenW - 5, 0, 5, screenH, DARKGRAY);\n\n        for (const auto& seg : snake) {\n            DrawRectangle(seg.x * grid, seg.y * grid, grid - 1, grid - 1, GREEN);\n        }\n        DrawRectangle(snake[0].x * grid, snake[0].y * grid, grid - 1, grid - 1, LIME);\n        DrawRectangle(foodX * grid, foodY * grid, grid - 1, grid - 1, RED);\n\n        std::string scoreText = "Score: " + std::to_string(score);\n        DrawText(scoreText.c_str(), 15, 15, 20, WHITE);\n\n        if (gameOver) {\n            DrawRectangle(screenW / 2 - 200, screenH / 2 - 80, 400, 160, Fade(BLACK, 0.8f));\n            DrawText("GAME OVER", screenW / 2 - 100, screenH / 2 - 50, 40, RED);\n            DrawText("Press SPACE to Restart", screenW / 2 - 150, screenH / 2 + 10, 20, WHITE);\n        }\n\n        EndDrawing();\n    }\n    return 0;\n}`
      },
      {
        name: "Bad Apple Procedural",
        input: `#include <iostream>\n#include <vector>\n#include <cmath>\n#include <cstdlib>\n#include <raylib.h>\n\nstruct Particle {\n    float x;\n    float y;\n    float speed;\n    float size;\n};\n\nint main() {\n    int screenW = 600;\n    int screenH = 450;\n\n    InitWindow(screenW, screenH, "Cmp++ Bad Apple Procedural Visualizer");\n    SetTargetFPS(60);\n\n    float time = 0.0f;\n    bool inverted = false;\n\n    std::vector<Particle> stars;\n    for (int idx = 0; idx < 30; idx++) {\n        stars.push_back(Particle{\n            static_cast<float>(rand() % screenW),\n            static_cast<float>(rand() % screenH),\n            static_cast<float>((rand() % 8) + 4),\n            static_cast<float>((rand() % 3) + 2)\n        });\n    }\n\n    while (!WindowShouldClose()) {\n        time += GetFrameTime();\n        if (time > 12.0f) {\n            time = 0.0f;\n            inverted = false;\n        }\n\n        BeginDrawing();\n\n        if (time < 2.5f) {\n            ClearBackground(WHITE);\n            float appleY = 100.0f + (time * 120.0f);\n            float appleSize = 35.0f;\n            \n            DrawCircle(screenW / 2, appleY, appleSize, BLACK);\n            DrawCircle(screenW / 2 - 12, appleY - 8, appleSize * 0.9f, BLACK);\n            DrawCircle(screenW / 2 + 12, appleY - 8, appleSize * 0.9f, BLACK);\n            \n            for (int i = 0; i < 8; i++) {\n                DrawCircle(screenW / 2 + i * 2, appleY - appleSize - i * 1.5f, 4.0f, BLACK);\n            }\n            DrawCircle(screenW / 2 + 14, appleY - appleSize - 10, 6.0f, BLACK);\n            DrawText("Nagareteku toki no naka de demo", screenW / 2 - 140, screenH - 50, 18, DARKGRAY);\n        } else if (time >= 2.5f && time < 3.0f) {\n            inverted = true;\n            ClearBackground(BLACK);\n            float t = (time - 2.5f) * 2.0f;\n            DrawCircle(screenW / 2, screenH / 2, t * 400.0f, WHITE);\n            for (int i = 0; i < 8; i++) {\n                float angle = i * 45.0f * (3.14159f / 180.0f);\n                float endX = screenW / 2 + cos(angle) * (t * 500.0f);\n                float endY = screenH / 2 + sin(angle) * (t * 500.0f);\n                DrawLineEx(Vector2{static_cast<float>(screenW / 2), static_cast<float>(screenH / 2)}, Vector2{endX, endY}, 3.0f, BLACK);\n            }\n        } else if (time >= 3.0f && time < 6.5f) {\n            ClearBackground(BLACK);\n            float yyX = 150.0f; float yyY = 220.0f; float yyR = 90.0f; float rot = time * 2.0f;\n            DrawCircle(yyX, yyY, yyR, DARKGRAY);\n            DrawCircleSector(Vector2{yyX, yyY}, yyR, rot * (180.0f/3.14f), (rot + 3.14159f) * (180.0f/3.14f), 0, LIGHTGRAY);\n            DrawCircle(yyX + cos(rot)*yyR/2, yyY + sin(rot)*yyR/2, yyR/2, LIGHTGRAY);\n            DrawCircle(yyX + cos(rot+3.14f)*yyR/2, yyY + sin(rot+3.14f)*yyR/2, yyR/2, DARKGRAY);\n            DrawCircle(yyX + cos(rot)*yyR/2, yyY + sin(rot)*yyR/2, 8.0f, DARKGRAY);\n            DrawCircle(yyX + cos(rot+3.14f)*yyR/2, yyY + sin(rot+3.14f)*yyR/2, 8.0f, LIGHTGRAY);\n\n            float rX = 400.0f; float rY = 250.0f;\n            DrawRectangle(rX - 80, rY - 60, 45, 30, WHITE);\n            DrawRectangle(rX - 80, rY - 30, 30, 45, WHITE);\n            DrawRectangle(rX - 60, rY - 20, 50, 110, WHITE);\n            DrawTriangle(Vector2{rX - 50, rY + 80}, Vector2{rX - 70, rY + 120}, Vector2{rX - 10, rY + 80}, WHITE);\n            DrawCircle(rX - 15, rY - 10, 40, WHITE);\n            DrawTriangle(Vector2{rX - 15, rY + 25}, Vector2{rX + 25, rY - 10}, Vector2{rX + 15, rY + 20}, WHITE);\n            DrawCircle(rX + 15, rY + 45, 12, WHITE);\n            DrawRectangle(rX - 50, rY + 50, 80, 120, WHITE);\n            DrawText("Kedarusage hora guruguru mawatte", screenW / 2 - 165, screenH - 50, 18, LIGHTGRAY);\n        } else {\n            ClearBackground(BLACK);\n            for (auto& star : stars) {\n                star.x -= star.speed;\n                if (star.x < -10) {\n                    star.x = screenW + 10;\n                    star.y = rand() % screenH;\n                }\n                DrawRectangle(star.x, star.y, star.size, star.size, WHITE);\n            }\n            float mX = 250.0f; float mY = 200.0f + sin(time * 6.0f) * 18.0f;\n            DrawLineEx(Vector2{mX - 130, mY + 60}, Vector2{mX + 130, mY + 20}, 6.0f, WHITE);\n            DrawTriangle(Vector2{mX - 110, mY + 55}, Vector2{mX - 170, mY + 80}, Vector2{mX - 160, mY + 40}, WHITE);\n            DrawTriangle(Vector2{mX, mY - 60}, Vector2{mX - 35, mY - 10}, Vector2{mX + 35, mY - 10}, WHITE);\n            DrawRectangle(mX - 45, mY - 12, 90, 8, WHITE);\n            DrawCircle(mX, mY + 15, 25, WHITE);\n            DrawRectangle(mX - 25, mY + 15, 45, 55, WHITE);\n            DrawTriangle(Vector2{mX - 30, mY + 110}, Vector2{mX, mY + 45}, Vector2{mX + 25, mY + 110}, WHITE);\n            DrawRectangle(mX - 20, mY + 50, 45, 50, WHITE);\n            DrawText("Watashi no kokoro mo shinteyuku no ka na", screenW / 2 - 180, screenH - 50, 18, LIGHTGRAY);\n        }\n\n        DrawRectangle(0, screenH - 70, screenW, 4, inverted ? WHITE : BLACK);\n        DrawText("BAD APPLE!! - Cmp++ Graphic Demo", 15, 15, 14, GRAY);\n\n        EndDrawing();\n    }\n    return 0;\n}`
      }
    ],
    semantic: [
      {
        name: "Cmp++ Snake Game Prompt",
        input: "방향키로 뱀을 조작하고 뱀이 벽이나 자기 몸에 부딪치면 게임오버가 되며, 빨간색 먹이를 먹을 때마다 점수가 올라가고 몸이 길어지는 Raylib 기반 스네이크 게임 C++ 코드를 작성해줘."
      },
      {
        name: "Bad Apple Procedural Prompt",
        input: "Raylib 창을 생성하고, 배경이 플래시되면서 사과가 떨어지고 캐릭터 실루엣들이 가사에 맞추어 회전하고 빗자루 비행하는 애니메이션을 보여주는 C++ 코드를 작성해줘."
      }
    ]
  };

  // Switch modes
  function setMode(mode) {
    currentMode = mode;
    if (mode === "code") {
      modeCodeBtn.classList.add("active", "text-white");
      modeCodeBtn.classList.remove("text-gray-400");
      modeSemanticBtn.classList.remove("active", "text-white");
      modeSemanticBtn.classList.add("text-gray-400");
      
      inputLabel.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyberIndigo"></span> Standard C++ Code`;
      compileBtn.querySelector("span").textContent = "Transpile to Cmp++";
      decompileBtn.querySelector("span").textContent = "Decompress to C++";
      terminalContainer.style.display = "flex";
    } else {
      modeSemanticBtn.classList.add("active", "text-white");
      modeSemanticBtn.classList.remove("text-gray-400");
      modeCodeBtn.classList.remove("active", "text-white");
      modeCodeBtn.classList.add("text-gray-400");
      
      inputLabel.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyberPurple"></span> Natural Language Prompt`;
      compileBtn.querySelector("span").textContent = "Compress Prompt";
      decompileBtn.querySelector("span").textContent = "Decompress Prompt";
      terminalContainer.style.display = "none";
    }
    
    // Refresh presets dropdown
    populatePresets();
    
    // Clear inputs or translate current
    editorInput.value = "";
    editorOutput.value = "";
    updateAnalysis();
  }

  // Populate presets dropdown
  function populatePresets() {
    exampleSelect.innerHTML = `<option value="">Load Example...</option>`;
    presets[currentMode].forEach((preset, index) => {
      const opt = document.createElement("option");
      opt.value = index;
      opt.textContent = preset.name;
      exampleSelect.appendChild(opt);
    });
  }

  // Update real-time statistics
  function updateAnalysis() {
    const origText = editorInput.value;
    const cmpText = editorOutput.value;
    const model = tokenizerSelect.value;
    
    // Update char counts
    inputCharCount.textContent = `Chars: ${origText.length}`;
    outputCharCount.textContent = `Chars: ${cmpText.length}`;
    
    // Calculate simulated tokens
    const origTokens = CmpTokenizer.estimate(origText, model);
    const cmpTokens = CmpTokenizer.estimate(cmpText, model);
    
    inputTokenCount.textContent = `Tokens: ${origTokens}`;
    outputTokenCount.textContent = `Tokens: ${cmpTokens}`;
    
    // Detailed stats
    const stats = CmpTokenizer.analyze(origText, cmpText, model);
    
    statsOrigTokens.textContent = stats.original.tokens;
    statsCmpTokens.textContent = stats.cmp.tokens;
    
    statsOrigBytes.textContent = stats.original.bytes;
    statsCmpBytes.textContent = stats.cmp.bytes;
    statsByteSaving.textContent = `${stats.reduction.bytes}% reduction`;
    
    statsOrigCost.textContent = stats.original.cost.toFixed(5);
    statsCmpCost.textContent = stats.cmp.cost.toFixed(5);
    statsCostSaving.textContent = `Save $${stats.reduction.costSavings}`;
    
    // Update gauge chart
    const pct = parseFloat(stats.reduction.tokens) || 0;
    reductionPercentage.textContent = `${Math.round(pct)}%`;
    
    // Circumference of our gauge circle (2 * PI * r) where r = 70 => ~439.8
    const circumference = 440;
    const offset = circumference - (pct / 100) * circumference;
    gaugeRing.style.strokeDashoffset = offset;
    
    // Update tagline text based on saving percentage
    if (pct > 0) {
      savingsTagline.textContent = `You saved ${Math.round(pct)}% tokens using Cmp++ with ${tokenizerSelect.options[tokenizerSelect.selectedIndex].text}!`;
      savingsTagline.classList.add("text-cyan-400");
      savingsTagline.classList.remove("text-gray-400");
    } else {
      savingsTagline.textContent = "Load or type an example to analyze token reduction.";
      savingsTagline.classList.remove("text-cyan-400");
      savingsTagline.classList.add("text-gray-400");
    }
  }

  // Compile logic
  function performCompilation() {
    const inputVal = editorInput.value;
    if (!inputVal) return;
    
    if (currentMode === "code") {
      editorOutput.value = CmpCompiler.compileCode(inputVal);
    } else {
      editorOutput.value = CmpCompiler.compileSemantic(inputVal);
    }
    updateAnalysis();
  }

  // Decompile logic
  function performDecompilation() {
    const outputVal = editorOutput.value;
    if (!outputVal) return;
    
    if (currentMode === "code") {
      editorInput.value = CmpCompiler.decompileCode(outputVal);
    } else {
      editorInput.value = CmpCompiler.decompileSemantic(outputVal);
    }
    updateAnalysis();
  }

  // Event Listeners
  modeCodeBtn.addEventListener("click", () => setMode("code"));
  modeSemanticBtn.addEventListener("click", () => setMode("semantic"));
  
  tokenizerSelect.addEventListener("change", updateAnalysis);
  
  editorInput.addEventListener("input", () => {
    performCompilation();
  });
  
  editorOutput.addEventListener("input", () => {
    updateAnalysis();
  });
  
  compileBtn.addEventListener("click", performCompilation);
  decompileBtn.addEventListener("click", performDecompilation);
  
  exampleSelect.addEventListener("change", (e) => {
    const idx = e.target.value;
    if (idx !== "") {
      editorInput.value = presets[currentMode][idx].input;
      performCompilation();
    }
  });

  const copyBtn = document.getElementById("copy-btn");
  copyBtn.addEventListener("click", () => {
    const copyText = editorOutput.value;
    if (!copyText) return;
    
    navigator.clipboard.writeText(copyText).then(() => {
      const originalLabel = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
        Copied!
      `;
      copyBtn.classList.add("text-emerald-400");
      setTimeout(() => {
        copyBtn.innerHTML = originalLabel;
        copyBtn.classList.remove("text-emerald-400");
      }, 2000);
    });
  });

  // Initialize
  setMode("code");
});
