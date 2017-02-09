::: page-description
Logging
=======
:::

The RDK uses the Bunyan library for logging. Bunyan log lines are machine-readable JSON objects. The `bunyan` command-line utility will format the Bunyan log lines into easily-scannable, colorful, human-readable output.

The `bunyan` command-line utility also provides a way to filter through log messages, with the -c flag and with the --level flag. Read more about these flags in `bunyan -h`.

RDK does not write any log files itself; this job is left to the watchdog or supervisor process that keeps the resource server running. This allows for simpler configuration of logs.
For more information about this approach, read the [12-factor app log page](http://12factor.net/logs).
The current default location that the watchdog writes logs to is `/var/rdk/logs/`.

Example usage of the `bunyan` command-line utility:  
```
tail -n 1000 /var/rdk/logs/*stdout.log | node /opt/resource_server/node_modules/.bin/bunyan
```

You may locally use `console.log()` in development but **do not commit any `console.log()`s to git**

## Contexts
The RDK will loggers within different contexts:
 * `app.logger`, for logging in the server context (when no request context is available)
 * `req.logger`, for logging in request context

Use the most specific logging context available to you. If you are developing a resource, this is always `req.logger`.

Logging contexts automatically provide useful information about the state of the resource server when writing log messages.

## Levels
Bunyan provides the following standard log levels:
 * `req.logger.fatal()` - the resource server is stopping because of an irrecoverable error
 * `req.logger.error()` - fatal for a particular request, but the resource server will continue serving other requests
 * `req.logger.warn()` - the request can be handled but a problem has occurred which deserves special attention
 * `req.logger.info()` - detail on regular operation. **No PHI or PII** - no logging of full response or request objects
 * `req.logger.debug()` - anything else (may include PHI or PII)
 * `req.logger.trace()` - only for use by external libraries or RDK framework developers - very verbose logging

An info message should be logged anytime a business decision is made.
Debug messages should be logged at developer discretion. Err on the side of caution; if a log message might help, add it.

## Writing Useful Log Messages
The logger functions can take multiple arguments.

### Do:

* Log variables in the first argument. If the first argument is an object, that object is merged into the Bunyan log object, making it more easily machine-readable.

    For example:
    ```JavaScript
    req.logger.info({syncStatus: 'in progress'}, 'Sync in progress');
    ```
    creates the following log line:
    ```
    {"name":"res-server","hostname":"AdertondMBP.local","pid":70765,"requestId":"2fdd54eb-a73d-49bb-8436-b6cac588a41c","level":30,"syncStatus":"in progress","msg":"Sync in progress","time":"2015-03-31T03:59:15.133Z","v":0}
    ```
    Note how "syncStatus" is a top-level element and the string argument is placed into the "msg" element.

    ::: side-note
    This example log message is redundant for the sake of demonstration. Avoid unnecessary redundancy in your log messages.
    :::

* Log errors in the first argument, like:

    ```JavaScript
    req.logger.error(error, 'Something bad happened here');
    ```
    or
    ```JavaScript
    req.logger.error({err: error}, 'Something bad happened here');
    ```
    This allows Bunyan to friendly-format the error.



### Don't:

* Use `JSON.stringify` on JSON objects. Instead make them fields of the first argument.

## RDK Logging Enhancements
The RDK adds a `requestId` to each log message which corresponds to the requestId response header that a client receives, and a `pid` when a request is patient-centric.

If the logging level is configured to `debug` or higher, the RDK only logs partial versions of objects like `req`, `res` and `session`. Set the level to `trace` to log the full objects.

<br />
---
Next: [Documenting Resources](documenting.md)
