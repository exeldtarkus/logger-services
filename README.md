Berikut ini adalah isi lengkap `README.md` dalam bentuk teks:

---

````
# LoggerService TS

Simple and flexible logger service written in TypeScript. Provides environment-aware logging with levels and stage indicators.

## ✨ Features

- Support for log levels: `info`, `warn`, `error`, `debug`
- Optional `env` and `loggerPrefix` context
- Toggleable debug logging
- Uses `chalk` for colored logs
- Uses `moment` for timestamp formatting
- Optional `log stage` enum for marking start/end of operations

---

## 📦 Installation

```bash
npm install logger-services
````

---

## 🚀 How to Use

### 1. Import and Initialize

```ts
import {LoggerService, ELogStage, ELogLevels} from 'logger-services';

const logger = new LoggerService({
  env: 'dev', // 'dev' | 'uat' | 'staging' | 'prod'
  loggerPrefix: 'MyApp', // optional module name prefix
  app_debug: true, // enables debug logging
});

export {ELogStage, ELogLevels};
export default logger;

```

### 2. Logging Examples

```ts
logger.info('Application started');
logger.warn('This is a warning');
logger.error(new Error('Something went wrong'));
logger.debug('This is a debug message');
```

### 3. Using Log Stage Markers

```ts
logger.info(ELogStage.start, 'Starting job A');

// some process...

logger.info(ELogStage.end, 'Finished job A');
```

### 4. Toggle Configuration Dynamically

```ts
logger.init({
  env: 'prod',
  loggerPrefix: 'AuthService',
  app_debug: false,
});
```

---

## 🧰 API Reference

### `LoggerService`

```ts
new LoggerService(config?: ILoggerConfig, clear?: boolean)
```

#### `ILoggerConfig`

| Field          | Type      | Description                    |                              |        |        |                            |
| -------------- | --------- | ------------------------------ | ---------------------------- | ------ | ------ | -------------------------- |
| `env`          | \`'dev'   | 'uat'                          | 'staging'                    | 'prod' | null\` | Optional environment label |
| `loggerPrefix` | \`string  | null\`                         | Optional module/service name |        |        |                            |
| `app_debug`    | `boolean` | Enables/disables debug logging |                              |        |        |                            |

---

### Log Methods

| Method           | Description                                 |
| ---------------- | ------------------------------------------- |
| `info(...args)`  | Logs info level messages                    |
| `warn(...args)`  | Logs warning messages                       |
| `error(...args)` | Logs error messages and exceptions          |
| `debug(...args)` | Logs debug messages (if `app_debug = true`) |

---

### `ELogStage` Enum

Helps mark the lifecycle stage of operations:

```ts
ELogStage.start // "[START]"
ELogStage.end   // "[END]"
```

---

## 🔧 Development

Build the project:

```bash
npm run build
```

---
