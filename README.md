<div align="center">

  # [opendbc.com](https://opendbc.com)

  **Web experience for exploring vehicle specs and compatability with [openpilot](https://github.com/commaai/openpilot)** <br>
  Built with data from [https://github.com/commaai/opendbc](https://github.com/commaai/opendbc)

  [![SolidJS](https://img.shields.io/badge/SolidJS-1.9.5-blue.svg)](https://www.solidjs.com/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

---

<br>

This is a web interface for browsing and comparing vehicle compatibility data from the [opendbc](https://github.com/commaai/opendbc) repository.
opendbc contains vehicle specifications for cars and info about their current capabilities with comma's [openpilot](https://github.com/commaai/openpilot) driver assistance system.


## Quick Start

```
# install dependencies
bun install

# start dev server
bun run dev

# production build
bun run build
```

## Data Source

Vehicle data comes from the [opendbc repository](https://github.com/commaai/opendbc). We pull the latest info using the
`scripts/get_metadata.py` script. Report any inaccurate specs via [Discord](https://discord.com/channels/469524606043160576/1301587815728943144), [Github Issues](https://github.com/ugtthis/opendbc-site/issues), or [https://opendbc.userjot.com/](https://opendbc.userjot.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Site questions and feedback can be posted in this [Discord Channel](https://discord.com/channels/469524606043160576/1301587815728943144) or on [https://opendbc.userjot.com/](https://opendbc.userjot.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
