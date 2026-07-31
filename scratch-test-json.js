const fs = require('fs')
const locales = ['hr', 'en', 'de', 'sl']

locales.forEach((l) => {
  try {
    const file = fs.readFileSync(`src/messages/${l}.json`, 'utf8')
    JSON.parse(file)
    console.log(`${l}.json: VALID JSON ✓`)
  } catch (err) {
    console.error(`${l}.json ERROR:`, err.message)
  }
})
