# iotverse-db

## Usage

``` js
const setupDatabase = require('iotverse-db')

setupDabase(config).then(db => {
  const { Agent, Metric } = db

}).catch(err => console.error(err))
```