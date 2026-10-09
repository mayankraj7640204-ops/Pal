# PAL Project

This project follows a strict 3-layer architecture (Directive, Orchestration, Execution) ensuring deterministic and reliable AI operations.

## Architecture

1. **Directive Layer**: Natural-language Standard Operating Procedures (SOPs) defining what to do (`directives/`).
2. **Orchestration Layer**: Intelligent routing and decision-making logic bridging human intent and deterministic tools.
3. **Execution Layer**: Reliable, modular scripts and tools performing the actual work (`execution/`).

## Project Structure

- `frontend/` - Next.js App Router application.
- `backend/` - FastAPI backend service.
- `directives/` - Markdown SOPs.
- `execution/` - Utility scripts.
- `docs/` - System architecture and development notes.
- `tests/` - Comprehensive tests.
- `tmp/` - Regenerable intermediate files.

## Setup

1. Copy `.env.example` to `.env` and populate necessary keys.
2. Initialize and start the frontend / backend applications.
