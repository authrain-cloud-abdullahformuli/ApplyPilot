# Contributing & Maintenance Guidelines

ApplyPilot is maintained solely by **Abdullah Formuli** (<authrainmedia@gmail.com>).

**External contributions and third-party pull requests are not accepted.**

---

## Local Development & Customization

If you are customizing or extending ApplyPilot locally for your personal job search:

### Development Setup

```bash
git clone https://github.com/authrain-cloud-abdullahformuli/ApplyPilot.git
cd ApplyPilot
pip install -e ".[dev]"
playwright install chromium
```

### Running Checks

```bash
# Verify CLI entry point
applypilot --help

# Linting with Ruff
ruff check src/
```

### License

ApplyPilot is released under the [GNU Affero General Public License v3.0](LICENSE).
Copyright (C) 2026 Abdullah Formuli.
