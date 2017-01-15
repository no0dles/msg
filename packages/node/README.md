# @msg/node

## Usage
```
> msgnode [options] <file>

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -q, --queue <url>    set queue url. defaults to amqp://localhost
    -c, --config <path>  set config path. defaults to ./node.yml

```

## Configuration

node.yml
```yaml
queue: amqp://localhost:32777
nodeQueuePrefix: node
agentQueue: agent
```
