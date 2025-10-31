import { spawn } from "child_process";
import path from "path";

/**
 * Review user-submitted code using the Python LLM service.
 * @param {string} code - The code to review.
 * @param {string} language - The programming language (e.g. 'python', 'javascript').
 * @returns {Promise<Object>} - The review result as a JSON object.
 */
export async function reviewCode(code, language) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "scripts", "review_code.py");

    // Path to your Python virtual environment executable
    const pythonPath = "/root/.venv/bin/python3";

    // Spawn a Python process
    const python = spawn(pythonPath, [scriptPath], {
      env: {
        ...process.env,
        EMERGENT_LLM_KEY: process.env.EMERGENT_LLM_KEY, // API key passed securely
      },
    });

    let stdout = "";
    let stderr = "";

    // Capture output
    python.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    python.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // On completion
    python.on("close", (exitCode) => {
      if (exitCode !== 0) {
        console.error("❌ Python script error:", stderr);
        reject(new Error(`Python script failed: ${stderr || "Unknown error"}`));
        return;
      }

      try {
        const result = JSON.parse(stdout.trim());
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result);
        }
      } catch (error) {
        console.error("⚠️ Failed to parse Python output:", stdout);
        reject(new Error("Failed to parse review response"));
      }
    });

    // Send data to Python via stdin
    const input = JSON.stringify({ code, language });
    python.stdin.write(input);
    python.stdin.end();
  });
}
