# savvytec SeaTable API Wrapper

## Installing

```bash
npm install savvytec-seatable
```

## About

- TypeScript-preferred (see typesafe operations)
- Zod schema validation at runtime (see [zod.dev](https://zod.dev))

## Examples

### SQL Query

```ts
import { Base } from 'savvytec-seatable';

(async () => {
  const base = new Base('<TOKEN>', '<URL>');
  await base.auth();
  try {
    const queryResult = await base.queryAsync({
      sql: `SELECT * FROM MyTable WHERE x > 5 LIMIT 100`,
    });
    for (const row of queryResult.results) {
      console.log(row._id);
    }
  } catch (e: any) {
    console.log(e);
  }
})();
```

## Supported operations

### Base API

- Authenticate
- Get base info (typesafe)
- SQL query (deprecated)
- SQL queryAsync (typesafe)
- List rows
- Append rows
- Modify rows
- Delete rows
- Create table
- Rename table
- Link rows
- Get server info

### Admin API

- Get user info
