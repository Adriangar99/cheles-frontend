# Design

## Context

See proposal.md and the backend `project-docs` change, which documents installation, Enable Banking and operations;
the frontend docs link there instead of repeating them.

## Goals / Non-Goals

**Goals:** a newcomer understands the screens and can run, test and change the web app from the docs.

**Non-Goals:** design system docs (block 5).

## Decisions

- English, UI literals quoted in Spanish; one home per topic; specs are the source of truth for behavior.
- Every command in `setup.md` and `development.md` is run once before the change is marked done; relative and
  cross-repo links are checked once with a small script.

## Risks / Trade-offs

- [Docs drift] → Behavior lives in specs; later changes review the docs they affect.

## Migration Plan

Docs only.
