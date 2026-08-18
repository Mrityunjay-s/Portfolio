const nextCoreWebVitals = require("eslint-config-next/core-web-vitals")

module.exports = [
  ...nextCoreWebVitals,
  {
    rules: {
      "react/no-unescaped-entities": 0,
    },
  },
]
