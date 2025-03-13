/*
Copyright (c) 2025 MrBobertus - MIT License (see LICENSE file for details)

Contact: mr.bobertus.dev@gmail.com
Original Software: https://github.com/MrBobertus
*/

// Version of the terminal
const versionValue = "1.0.0";

// Get the terminal element
const terminal = document.getElementById("terminal");

// Define the commands ⚠ HERE YOU CAN ADD YOUR OWN COMMANDS ⚠
const commands = {
  help: function help() {
    terminal.value +=
      "\n" + "> " + "Available commands: " + Object.keys(commands).join(", ");
  },
  clear: function clear() {
    terminal.value = "";
    terminal.value += "> " + "Cleared terminal";
  },
  version: function version() {
    terminal.value += "\n" + "> " + "Version: " + versionValue;
  },
  ping: async function ping(input) {
    if (typeof input !== "string") {
      input = String(input);
    }

    const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}(?::\d{1,5})?$/;
    const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/.*)?$/i;

    if (!ipRegex.test(input) && !urlRegex.test(input)) {
      terminal.value += `\n> Invalid IP or URL`;
      return;
    }

    const url = input.startsWith("http") ? input : `http://${input}`;
    const imageUrl = url + "/favicon.ico";

    const start = performance.now();

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const end = performance.now();
        terminal.value += `> Successfully pinged ${input} | ${Math.round(
          end - start
        )}ms \n`;
        resolve(true);
      };
      img.onerror = () => {
        terminal.value += `> Failed to ping ${input} (Network error) \n`;
        resolve(false);
      };
      img.src = imageUrl + "?t=" + Date.now();
    });
  },
  date: function date() {
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    terminal.value += `\n > ${formattedDate}`;
  },
  echo: function echo(...args) {
    let message = args.join(" ");

    message = message
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r")
      .replace(/\\b/g, "\b")
      .replace(/\\f/g, "\f")
      .replace(/\\\\/g, "\\");

    terminal.value += `\n> ${message}`;
    return { success: true, output: message };
  },
};

// Detecting key presses like enter and tab
terminal.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const inputText = terminal.value;
    const lines = inputText.split("\n");
    const lastLine = lines[lines.length - 1].trim();
    const isEmptyOrWhitespace = /^\s*$/.test(lastLine);

    if (lastLine && !isEmptyOrWhitespace) {
      const [command, ...args] = lastLine.split(/\s+/);

      if (commands[command]) {
        commands[command](args);
      } else {
        terminal.value +=
          "\n" + "Error: Command not found!" + "\n" + "> " + lastLine;
      }
    } else {
      event.preventDefault();
    }
  }
});

terminal.addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    const inputText = terminal.value;
    const lines = inputText.split("\n");
    const outputLines = lines.slice(0, lines.length - 1);
    const lastLine = lines[lines.length - 1].trim();
    const [command, ...args] = lastLine.split(/\s+/);
    const suggestions = Object.keys(commands).filter((cmd) =>
      cmd.startsWith(command)
    );
    if (suggestions.length === 1) {
      terminal.value = outputLines.join("\n") + "\n" + suggestions[0];
    } else if (suggestions.length > 1) {
      terminal.value = outputLines.join("\n") + "\n" + suggestions.join(", ");
    }
  }
});
