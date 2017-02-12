# @msg/node

## Usage
```
> msgnode <file> [ ... <file> ]

  Options:
    -e, --env <variable>=<value>    set environment variable
    -c, --config <path>  set config path. defaults to ./node.yml

```

## Configuration

.node.yml
```yaml
env: 
  - NODE_ENV=development
  - HTTP_PORT=3000
apps:
  - module: @msg/logging
  - module: @msg/http#app
  - file: ./src/app.js
```
