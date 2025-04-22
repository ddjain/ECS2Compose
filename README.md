# 🐳 ECS to Docker Compose Converter

A simple web-based tool that converts AWS ECS Task Definition JSON into a Docker Compose YAML file. Useful for developers who want to test ECS configurations locally or migrate workloads with ease.

---

## ✨ Features

- Convert ECS JSON task definitions to Docker Compose format
- Supports:
  - Multiple containers
  - Environment variables (including secrets)
  - Port mappings
  - Volume mounts
  - `depends_on` relationships
- Live dual-pane editor using Ace Editor
- Instant YAML generation with a single click


## Demo

You can try the app live here: [ECS2Compose Demo](https://ddjain.github.io/ECS2Compose/)
