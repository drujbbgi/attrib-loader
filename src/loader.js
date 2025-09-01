(function () {
  "use strict";

  /**
   * Replace placeholders {{Key}} inside a container with values from JSON
   * @param {string} rawJson - Raw JSON string (can include &quot; and ; at the end)
   * @param {string} containerSelector - CSS selector for containers (default: [attrib-loader-enabled])
   * @param {object} options - { hideMissing: boolean }
   */
  function applyAttributes(rawJson, containerSelector = "[attrib-loader-enabled]", options = {}) {
    try {
      let decoded = rawJson.replace(/&quot;/g, '"').trim();
      if (decoded.endsWith(";")) decoded = decoded.slice(0, -1);

      const data = JSON.parse(decoded);

      document.querySelectorAll(containerSelector).forEach(container => {
        container.querySelectorAll("*").forEach(el => {
          el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              let original = node.textContent;
              let replaced = original;

              Object.keys(data).forEach(key => {
                const regex = new RegExp(`{{\\s*${escapeRegex(key)}\\s*}}`, "g");
                replaced = replaced.replace(regex, data[key]);
              });

              if (replaced !== original) {
                node.textContent = replaced;
              } else if (options.hideMissing && /\{\{.*?\}\}/.test(original)) {
                el.style.display = "none";
              }
            }
          });
        });

        container.classList.add("ready");
      });
    } catch (err) {
      console.error("applyAttributes failed:", err, rawJson);
    }
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  window.AttribLoader = {
    apply: applyAttributes
  };
})();
