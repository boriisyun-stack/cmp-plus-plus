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
        input: `#include <raylib.h>
#include <cmath>
#include <vector>
#include <string>
#include <cstdlib>

struct Particle {
    float x;
    float y;
    float vx;
    float vy;
    float speed;
    float size;
    float alpha;
};

struct Shd {
    float x;
    float y;
    float vx;
    float vy;
    float angle;
    float rotSpeed;
    float size;
};

struct Ptl {
    float x;
    float y;
    float speed;
    float angle;
    float waveSpeed;
    float size;
};

int main() {
    int screenW = 600;
    int screenH = 450;

    InitWindow(screenW, screenH, "Cmp++ Bad Apple Procedural Visualizer");
    SetTargetFPS(60);

    float time = 0.0f;
    bool inverted = false;

    std::vector<Particle> dst;
    for (int i = 0; i < 30; i++) {
        dst.push_back(Particle{static_cast<float>(rand() % screenW), static_cast<float>(rand() % screenH), 0.0f, -static_cast<float>((rand() % 15 + 5) / 10.0f), 0.0f, static_cast<float>(rand() % 3 + 1), static_cast<float>((rand() % 50 + 50) / 100.0f)});
    }

    std::vector<Particle> stars;
    for (int i = 0; i < 30; i++) {
        stars.push_back(Particle{static_cast<float>(rand() % screenW), static_cast<float>(rand() % screenH), -static_cast<float>((rand() % 8) + 4), 0.0f, 0.0f, static_cast<float>((rand() % 3) + 2), 1.0f});
    }

    std::vector<Particle> trl;

    std::vector<Shd> shd;

    std::vector<Ptl> ptl;
    for (int i = 0; i < 25; i++) {
        ptl.push_back(Ptl{static_cast<float>(rand() % screenW), static_cast<float>(rand() % screenH - screenH), static_cast<float>((rand() % 15 + 5) / 10.0f), static_cast<float>(rand() % 360), static_cast<float>((rand() % 20 + 10) / 10.0f), static_cast<float>((rand() % 4) + 3)});
    }

    bool sI = false;

    while (!WindowShouldClose()) {
        float d = GetFrameTime();
        time += d;

        if (time > 15.0f) {
            time = 0.0f;
            inverted = false;
            sI = false;
            shd.clear();
        }

        BeginDrawing();

        if (time < 2.0f) {
            ClearBackground(BLACK);
            for (auto& d_ : dst) {
                d_.y += d_.vy;
                if (d_.y < 0) {
                    d_.y = screenH;
                    d_.x = rand() % screenW;
                }
                DrawCircle(d_.x, d_.y, d_.size, Fade(WHITE, d_.alpha));
            }
            float alpha = sin((time / 2.0f) * 3.14159f);
            DrawText("BAD APPLE!!", screenW / 2 - 100, screenH / 2 - 20, 36, Fade(WHITE, alpha));
            DrawText("Cmp++ Premium Demo", screenW / 2 - 80, screenH / 2 + 30, 16, Fade(GRAY, alpha));
            DrawText("Nagareteku toki no naka de demo", screenW / 2 - 140, screenH - 50, 18, Fade(DARKGRAY, alpha));

        } else if (time >= 2.0f && time < 5.0f) {
            ClearBackground(WHITE);

            float t = time - 2.0f;
            float appleY = -50.0f;
            float aX = screenW / 2;
            float rot = t * 4.0f;

            if (t < 1.5f) {
                appleY = -50.0f + (t / 1.5f) * (screenH / 2 + 50.0f);
            } else {
                appleY = screenH / 2;
                float bT = t - 1.5f;
                appleY += sin(bT * 15.0f) * 30.0f * exp(-bT * 3.0f);
            }

            float appleSize = 40.0f;

            DrawCircle(aX + cos(rot) * -5.0f, appleY + sin(rot) * -5.0f, appleSize, BLACK);
            DrawCircle(aX - 12 + cos(rot + 1.0f) * 5.0f, appleY - 8 + sin(rot + 1.0f) * 5.0f, appleSize * 0.9f, BLACK);
            DrawCircle(aX + 12 - cos(rot + 1.0f) * 5.0f, appleY - 8 - sin(rot + 1.0f) * 5.0f, appleSize * 0.9f, BLACK);

            for (int i = 0; i < 8; i++) {
                DrawCircle(aX + i * 2 + cos(rot + 2.0f) * 10.0f, appleY - appleSize - i * 1.5f + sin(rot + 2.0f) * 10.0f, 4.0f, BLACK);
            }
            DrawCircle(aX + 14 + cos(rot + 2.5f) * 12.0f, appleY - appleSize - 10 + sin(rot + 2.5f) * 12.0f, 6.0f, BLACK);

            if (t >= 1.5f) {
                float scoreText = t - 1.5f;
                float rd = scoreText * 400.0f;
                if (rd < screenW) {
                    DrawCircleSector(Vector2{static_cast<float>(screenW / 2), appleY}, rd, 0, 360, 0, Fade(BLACK, 0.4f * (1.0f - scoreText)));
                    DrawCircleSector(Vector2{static_cast<float>(screenW / 2), appleY}, rd - 6.0f, 0, 360, 0, WHITE);
                }
            }

            DrawText("Nagareteku toki no naka de demo", screenW / 2 - 140, screenH - 50, 18, DARKGRAY);

        } else if (time >= 5.0f && time < 8.0f) {
            ClearBackground(BLACK);

            float rot = time * 3.0f;
            float yyX = 150.0f;
            float yyY = 220.0f;
            float yyR = 80.0f;

            DrawCircle(yyX, yyY, yyR, DARKGRAY);
            DrawCircleSector(Vector2{yyX, yyY}, yyR, rot * (180.0f / 3.14159f), (rot + 3.14159f) * (180.0f / 3.14159f), 0, LIGHTGRAY);
            DrawCircle(yyX + cos(rot) * yyR / 2, yyY + sin(rot) * yyR / 2, yyR / 2, LIGHTGRAY);
            DrawCircle(yyX + cos(rot + 3.14159f) * yyR / 2, yyY + sin(rot + 3.14159f) * yyR / 2, yyR / 2, DARKGRAY);
            DrawCircle(yyX + cos(rot) * yyR / 2, yyY + sin(rot) * yyR / 2, 8.0f, DARKGRAY);
            DrawCircle(yyX + cos(rot + 3.14159f) * yyR / 2, yyY + sin(rot + 3.14159f) * yyR / 2, 8.0f, LIGHTGRAY);

            for (int i = 0; i < 12; i++) {
                float ag = i * (360.0f / 12.0f) * (3.14159f / 180.0f) - rot * 0.5f;
                float rx = yyX + cos(ag) * (yyR + 25.0f);
                float ry = yyY + sin(ag) * (yyR + 25.0f);
                DrawCircle(rx, ry, 4.0f, LIGHTGRAY);
            }

            float rX = 400.0f;
            float rY = 230.0f;
            float wv = sin(time * 8.0f) * 8.0f;

            DrawRectangle(rX - 80, rY - 60 + wv * 0.5f, 45, 30, WHITE);
            DrawRectangle(rX - 80, rY - 30 + wv * 0.3f, 30, 45, WHITE);

            DrawRectangle(rX - 60, rY - 20, 50, 100 + wv, WHITE);
            DrawTriangle(Vector2{rX - 50, rY + 80 + wv}, Vector2{rX - 70, rY + 120 + wv}, Vector2{rX - 10, rY + 80 + wv}, WHITE);

            DrawCircle(rX - 15, rY - 10, 40, WHITE);
            DrawTriangle(Vector2{rX - 15, rY + 25}, Vector2{rX + 25, rY - 10}, Vector2{rX + 15, rY + 20}, WHITE);

            DrawCircle(rX + 15, rY + 45, 12, WHITE);

            float br = sin(time * 4.0f) * 2.0f;
            DrawRectangle(rX - 50, rY + 50 + br, 80, 120 - br, WHITE);

            float appleY = rY + 80.0f + sin(time * 5.0f) * 20.0f;
            DrawRectangle(rX + 60, appleY, 15, 30, WHITE);
            DrawRectangle(rX + 65, appleY + 5, 5, 20, BLACK);

            DrawText("Kedarusage hora guruguru mawatte", screenW / 2 - 165, screenH - 50, 18, LIGHTGRAY);

        } else if (time >= 8.0f && time < 11.0f) {
            ClearBackground(BLACK);

            for (auto& star : stars) {
                star.x += star.vx;
                if (star.x < -10) {
                    star.x = screenW + 10;
                    star.y = rand() % screenH;
                }
                DrawRectangle(star.x, star.y, star.size, star.size, WHITE);
            }

            float mX = 250.0f;
            float mY = 200.0f + sin(time * 6.0f) * 18.0f;

            if (rand() % 3 == 0) {
                trl.push_back(Particle{mX - 140.0f, mY + 60.0f + (rand() % 10 - 5), -static_cast<float>((rand() % 40 + 20) / 10.0f), static_cast<float>((rand() % 20 - 10) / 10.0f), 0.0f, static_cast<float>(rand() % 4 + 2), 1.0f});
            }

            for (int i = trl.size() - 1; i >= 0; i--) {
                trl[i].x += trl[i].vx;
                trl[i].y += trl[i].vy;
                trl[i].alpha -= 0.02f;
                if (trl[i].alpha <= 0.0f) {
                    trl.erase(trl.begin() + i);
                } else {
                    DrawCircle(trl[i].x, trl[i].y, trl[i].size, Fade(WHITE, trl[i].alpha));
                }
            }

            DrawLineEx(Vector2{mX - 130, mY + 60}, Vector2{mX + 130, mY + 20}, 6.0f, WHITE);
            DrawTriangle(Vector2{mX - 110, mY + 55}, Vector2{mX - 170, mY + 80}, Vector2{mX - 160, mY + 40}, WHITE);

            DrawTriangle(Vector2{mX, mY - 60}, Vector2{mX - 35, mY - 10}, Vector2{mX + 35, mY - 10}, WHITE);
            DrawRectangle(mX - 45, mY - 12, 90, 8, WHITE);

            DrawCircle(mX, mY + 15, 25, WHITE);

            DrawRectangle(mX - 25, mY + 15, 45, 55, WHITE);

            DrawTriangle(Vector2{mX - 30, mY + 110}, Vector2{mX, mY + 45}, Vector2{mX + 25, mY + 110}, WHITE);
            DrawRectangle(mX - 20, mY + 50, 45, 50, WHITE);

            DrawText("Watashi no kokoro mo shinteyuku no ka na", screenW / 2 - 180, screenH - 50, 18, LIGHTGRAY);

        } else if (time >= 11.0f && time < 12.0f) {
            inverted = true;
            ClearBackground(BLACK);

            if (!sI) {
                sI = true;
                shd.clear();
                int cols = 5;
                int rows = 4;
                float cW = static_cast<float>(screenW) / cols;
                float cH = static_cast<float>(screenH) / rows;
                for (int r = 0; r < rows; r++) {
                    for (int c = 0; c < cols; c++) {
                        float cx = c * cW + cW / 2.0f;
                        float cy = r * cH + cH / 2.0f;
                        float dx = cx - (screenW / 2.0f);
                        float dy = cy - (screenH / 2.0f);
                        float ds = sqrt(dx*dx + dy*dy);
                        if (ds == 0.0f) { ds = 1.0f; }
                        float fc = 120.0f + (rand() % 80);
                        float vx = (dx / ds) * fc;
                        float vy = (dy / ds) * fc - 80.0f;

                        shd.push_back(Shd{cx, cy, vx, vy, static_cast<float>(rand() % 360), static_cast<float>((rand() % 10 - 5)), cW * 0.7f});
                        shd.push_back(Shd{cx + 10.0f, cy + 10.0f, vx + (rand() % 40 - 20), vy + (rand() % 40 - 20), static_cast<float>(rand() % 360), static_cast<float>((rand() % 10 - 5)), cW * 0.7f});
                    }
                }
            }

            for (auto& s : shd) {
                s.vy += 300.0f * d;
                s.x += s.vx * d;
                s.y += s.vy * d;
                s.angle += s.rotSpeed * d * 50.0f;

                float a = s.angle * (3.14159f / 180.0f);
                float a1 = a;
                float a2 = a + 2.09439f;
                float a3 = a + 4.18879f;

                auto v1 = Vector2{s.x + cos(a1) * s.size, s.y + sin(a1) * s.size};
                auto v2 = Vector2{s.x + cos(a2) * s.size, s.y + sin(a2) * s.size};
                auto v3 = Vector2{s.x + cos(a3) * s.size, s.y + sin(a3) * s.size};

                DrawTriangle(v1, v2, v3, WHITE);
            }

            DrawText("Futei na koto mo shitteyuku no ka na", screenW / 2 - 170, screenH - 50, 18, LIGHTGRAY);

        } else {
            ClearBackground(BLACK);

            for (auto& p : ptl) {
                p.y += p.speed;
                p.x += sin(time * p.waveSpeed) * 1.2f;
                p.angle += p.speed * 2.0f;
                if (p.y > screenH) {
                    p.y = -20;
                    p.x = rand() % screenW;
                }

                float rad = p.angle * (3.14159f / 180.0f);
                auto v1 = Vector2{p.x + cos(rad) * p.size, p.y + sin(rad) * p.size};
                auto v2 = Vector2{p.x + cos(rad + 2.0f) * (p.size * 0.6f), p.y + sin(rad + 2.0f) * (p.size * 0.6f)};
                auto v3 = Vector2{p.x + cos(rad - 2.0f) * (p.size * 0.6f), p.y + sin(rad - 2.0f) * (p.size * 0.6f)};
                DrawTriangle(v1, v2, v3, WHITE);
            }

            DrawLineEx(Vector2{0, 0}, Vector2{120, 80}, 12.0f, DARKGRAY);
            DrawLineEx(Vector2{120, 80}, Vector2{200, 110}, 8.0f, DARKGRAY);
            DrawLineEx(Vector2{120, 80}, Vector2{160, 150}, 6.0f, DARKGRAY);
            DrawLineEx(Vector2{0, 0}, Vector2{60, 120}, 8.0f, DARKGRAY);

            DrawCircle(120, 80, 15, WHITE);
            DrawCircle(130, 90, 12, WHITE);
            DrawCircle(200, 110, 18, WHITE);
            DrawCircle(160, 150, 14, WHITE);
            DrawCircle(60, 120, 16, WHITE);

            float fO = 1.0f;
            if (time > 14.0f) {
                fO = 1.0f - (time - 14.0f);
            }

            DrawText("BAD APPLE!!", screenW / 2 - 100, screenH / 2 - 40, 36, Fade(WHITE, fO));
            DrawText("Cmp++ Engine Verification", screenW / 2 - 110, screenH / 2 + 10, 18, Fade(GRAY, fO));
            DrawText("Thank you for watching!", screenW / 2 - 95, screenH / 2 + 40, 14, Fade(LIGHTGRAY, fO));

            DrawText("Tada yudane teku dake no sono koto", screenW / 2 - 165, screenH - 50, 18, Fade(LIGHTGRAY, fO));
        }

        DrawRectangle(0, screenH - 70, screenW, 4, inverted ? WHITE : BLACK);
        DrawText("BAD APPLE!! - Cmp++ High-Fidelity Demo", 15, 15, 14, GRAY);

        EndDrawing();
    }

    return 0;
}
`
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

  // === RAYLIB HTML5 EMULATOR & WEB SANDBOX RUNNER ===
  let animationFrameId = null;
  let canvas = null;
  let ctx = null;
  let keysDown = {};
  let keysPressed = {};
  let shouldClose = false;
  let frameTime = 0.016;

  // Global variables to match Cmp++ standard constants
  window.BLACK = 'black';
  window.WHITE = 'white';
  window.RED = 'red';
  window.GREEN = 'green';
  window.LIME = 'lime';
  window.DARKGRAY = 'darkgray';
  window.LIGHTGRAY = 'lightgray';
  window.GRAY = 'gray';

  // Contracted colors
  window.BLK = 'black';
  window.WHT = 'white';
  window.GRN = 'green';
  window.LIM = 'lime';
  window.DKGY = 'darkgray';
  window.LTGY = 'lightgray';
  window.BLU = 'blue';

  window.KEY_RIGHT = 'ArrowRight';
  window.KEY_LEFT = 'ArrowLeft';
  window.KEY_UP = 'ArrowUp';
  window.KEY_DOWN = 'ArrowDown';
  window.KEY_SPACE = ' ';

  // Contracted keys
  window.K_R = 'ArrowRight';
  window.K_L = 'ArrowLeft';
  window.K_U = 'ArrowUp';
  window.K_D = 'ArrowDown';
  window.K_S = ' ';

  // Raylib emulator functions
  window.init_w = function(w, h, title) {
    canvas = document.getElementById('raylib-canvas');
    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext('2d');
    shouldClose = false;
  };

  window.set_fps = function(fps) {
    // RequestAnimationFrame handles refresh rate natively
  };

  window.w_close = function() {
    return shouldClose;
  };

  window.draw_b = function() {};
  window.draw_e = function() {};

  window.bg_cls = function(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  window.rect = function(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  window.circ = function(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  window.text = function(t, x, y, size, color) {
    ctx.font = `${size}px monospace`;
    ctx.fillStyle = color;
    ctx.fillText(t, x, y + size * 0.85);
  };

  window.line = function(v1, v2, thick, color) {
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;
    ctx.stroke();
  };

  window.tri = function(v1, v2, v3, color) {
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  window.sect = function(center, radius, startAngle, endAngle, segments, color) {
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, radius, startAngle * Math.PI / 180, endAngle * Math.PI / 180);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  window.dt = function() {
    return frameTime;
  };

  window.fade = function(color, alpha) {
    if (color === 'black') return `rgba(0,0,0,${alpha})`;
    if (color === 'white') return `rgba(255,255,255,${alpha})`;
    if (color === 'red') return `rgba(255,0,0,${alpha})`;
    if (color === 'green') return `rgba(0,128,0,${alpha})`;
    if (color === 'lime') return `rgba(0,255,0,${alpha})`;
    if (color === 'darkgray') return `rgba(169,169,169,${alpha})`;
    if (color === 'lightgray') return `rgba(211,211,211,${alpha})`;
    if (color === 'gray') return `rgba(128,128,128,${alpha})`;
    return color;
  };

  window.key_p = function(k) {
    return !!keysPressed[k];
  };

  window.key_d = function(k) {
    return !!keysDown[k];
  };

  let keysListenerAttached = false;
  function setupKeyListeners() {
    if (keysListenerAttached) return;
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault(); // Prevent page scrolling
      }
      keysDown[e.key] = true;
      keysPressed[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
      keysDown[e.key] = false;
    });
    keysListenerAttached = true;
  }

  const sandboxModal = document.getElementById('sandbox-modal');
  const runSandboxBtn = document.getElementById('run-sandbox-btn');
  const closeSandboxBtn = document.getElementById('close-sandbox-btn');

  function runWebSandbox() {
    if (!editorOutput.value) {
      performCompilation();
    }
    const cmpCode = editorOutput.value;
    if (!cmpCode) return;

    sandboxModal.classList.remove('hidden');

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    let jsCode;
    try {
      jsCode = CmpCompiler.transpileToJS(cmpCode);
    } catch (err) {
      console.error(err);
      alert("Error transpiling to JS: " + err.message);
      return;
    }

    setupKeyListeners();
    keysPressed = {};
    shouldClose = false;

    try {
      eval(jsCode);
    } catch (err) {
      console.error(err);
      alert("Runtime Error: " + err.message);
      return;
    }

    let lastTime = performance.now();
    function tick(now) {
      frameTime = (now - lastTime) / 1000;
      if (frameTime > 0.1) frameTime = 0.016;
      lastTime = now;

      if (window._raylibTick) {
        try {
          window._raylibTick();
        } catch (e) {
          console.error(e);
          return;
        }
      }

      keysPressed = {};

      if (!shouldClose) {
        animationFrameId = requestAnimationFrame(tick);
      }
    }
    animationFrameId = requestAnimationFrame(tick);
  }

  function stopWebSandbox() {
    shouldClose = true;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    sandboxModal.classList.add('hidden');
  }

  runSandboxBtn.addEventListener('click', runWebSandbox);
  closeSandboxBtn.addEventListener('click', stopWebSandbox);

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

  // Check for preloaded CLI code
  if (window.PLAYGROUND_CODE) {
    editorOutput.value = window.PLAYGROUND_CODE;
    editorInput.value = CmpCompiler.decompileCode(window.PLAYGROUND_CODE);
    updateAnalysis();
    setTimeout(() => {
      runWebSandbox();
    }, 500);
  }
});
