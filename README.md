# any-factory

Sample project for observable and dynamic CLI application.

## Usages

```bash
Usage: any-factory [options] [command]

Options:
  -h, --help                  display help for command

Commands:
  produce-products [options]  Produce products
  help [command]              display help for command
```

### Produce products

```bash
Usage: any-factory produce-products [options]

Produce products

Options:
  -s, --specs <specs>              Product specs
  -c, --concurrency <concurrency>  Concurrency of production task (default: 1)
  --with-server                    Will start a HTTP server to provide a way to inspect some internal data if specified
  -h, --help                       display help for command

```
