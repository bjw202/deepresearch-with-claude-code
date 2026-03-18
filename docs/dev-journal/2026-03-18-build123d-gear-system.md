# Dev Journal: build123d + LLM + Ontology Gear Design-Manufacturing Integration System

## Session Meta

| Key | Value |
| --- | --- |
| Date | 2026-03-18 |
| Project | build123d + LLM + Ontology Gear Design-Manufacturing Integration System |
| Prior Research | `docs/research/2026-03-18-gear-system/` (CadQuery-based) |
| Agents | researcher-build123d, researcher-architecture, researcher-ontology, journal |

---

## User Request Summary

Existing CadQuery-based gear design-manufacturing system research was the starting point. The user requested a pivot to build123d to:

1. Leverage build123d's more powerful gear modeling capabilities
2. Design concrete structures that maximize the strengths of LLM and ontology integration
3. Derive a more powerful and specific architecture than the previous CadQuery-based version

---

## Problem Definition

- The prior research was CadQuery-centric, but build123d offers a more modern, Pythonic API with structural advantages for LLM code generation.
- The existing architecture was too high-level -- it was unclear how LLM/ontology benefits would concretely materialize.
- **Goal**: Present a concrete architecture where Multi-Agent + Ontology Grounding + Closed-Loop Verification operates specifically on top of build123d.

---

## Key Assumptions

1. **OCCT kernel parity**: build123d uses the same OpenCASCADE kernel as CadQuery, so STEP export quality is equivalent.
2. **Context Manager API advantage**: build123d's Context Manager pattern provides structural benefits for LLM code generation (scope isolation, implicit part reference, reduced boilerplate).
3. **Ontology scope**: A MASON-based gear ontology needs to be built from scratch, but 100-200 classes should be sufficient for the target domain.
4. **LLM role boundary**: LLM acts as orchestrator only; numerical calculations are delegated to specialized tools (involute solvers, FEA, etc.).

---

## Sub-Agent Composition

| Agent | Role | Scope |
| --- | --- | --- |
| researcher-build123d | build123d gear modeling deep dive | API capabilities, gear primitives, Context Manager patterns, STEP/mesh export |
| researcher-architecture | Integrated architecture design | LLM + ontology + build123d pipeline, multi-agent structure, closed-loop verification |
| researcher-ontology | Gear domain ontology reinforcement | MASON extension, class hierarchy, property definitions, SPARQL query patterns |
| journal (this) | Session recording | Decision log, TODO tracking, rejected alternatives |

---

## Decision Log

### D1: CadQuery -&gt; build123d Transition

- **Decision**: Adopt build123d as the core CAD kernel interface.
- **Rationale**:
  - More Pythonic API with type hinting -- better for LLM code generation and static analysis.
  - Context Manager pattern provides natural scope isolation for multi-part assemblies.
  - More active development and community momentum.
  - Same OCCT kernel ensures no regression in geometric capability.

### D2: Multi-Agent Structure Retained

- **Decision**: Keep the multi-agent architecture (design / modeling / verification / manufacturing).
- **Rationale**: Separation of concerns remains effective for managing complexity across the full design-to-manufacturing pipeline. Each agent can specialize in its domain's constraints and validation rules.

### D3: MASON-Based Ontology Extension Retained

- **Decision**: Continue building on MASON (Manufacturing's Semantics Ontology) for the gear domain.
- **Rationale**: No public gear-specific ontology exists with sufficient depth. MASON provides manufacturing-relevant upper ontology concepts. Custom extension of 100-200 classes covers spur, helical, bevel, worm, and planetary gear families with their design parameters, material properties, and manufacturing constraints.

---

## Completion Status Update

### Sub-Agent Results

| Agent | Status | Output |
|---|---|---|
| researcher-build123d | ✅ Complete | 01-build123d-gear-modeling.md |
| researcher-architecture | ✅ Complete | 02-integrated-architecture.md |
| researcher-ontology | ✅ Complete | 03-ontology-enhancement.md |
| critic | ✅ Complete | Text review (inline) |

### Critic Key Findings

| # | Finding | Severity |
|---|---|---|
| 1 | Hallucination rate 1.7% figure originates from clinical QA domain; unverified for gear domain | High |
| 2 | 6-Agent architecture excessive complexity -- MVP separation needed | High |
| 3 | py_gearworks multi-stage gear train API unverified but used as architecture premise | High |
| 4 | Ontology namespace inconsistency across documents | Medium |
| 5 | Pellet AGPL license risk not considered | Medium |
| 6 | Code generation approach conflict: Skill Card vs MCP template | Medium |

### Integration Decisions

- **MVP scope**: Reduced to "build123d + py_gearworks + SHACL validation + code execution feedback loop"
- **Full vision (6-Agent)**: Deferred to Phase 3 as long-term goal
- **Ontology namespace**: Unified to `gear:hasModule` + `http://gear-ontology.org/onto#`
- **Face width / module ratio**: 2-tier validation -- 6-12 warning, 3-15 violation
- **Reasoner**: Pellet -> HermiT (BSD) review recommended

---

## Issues / Resolution

| # | Issue | Resolution |
|---|---|---|
| 1 | Hallucination rate 1.7% cited without domain-specific evidence | Flagged by critic; removed from architecture guarantees, marked as "to be validated in PoC" |
| 2 | 6-Agent architecture too complex for initial delivery | MVP reduced to 3 core components (build123d + py_gearworks + SHACL); full agent set deferred to Phase 3 |
| 3 | py_gearworks multi-stage API assumed but unverified | Added to next-session TODO; architecture conditioned on API verification |
| 4 | Ontology namespace divergence across documents | Unified to `gear:hasModule` + `http://gear-ontology.org/onto#` |
| 5 | Pellet AGPL license incompatible with commercial use | HermiT (BSD) recommended as alternative reasoner |
| 6 | Skill Card vs MCP template conflict | Deferred to implementation phase; both approaches kept as candidates pending PoC evaluation |

---

## TODO

- [x] Sub-agent result integration followed by critic/verifier review
- [x] Write final executive summary
- [ ] ~~Document improvements over prior research (CadQuery-based)~~ -- included in executive summary
- [ ] ~~Concretize implementation roadmap~~ -- included in executive summary
- [ ] py_gearworks multi-stage gear train API hands-on test (next session)
- [ ] build123d + py_gearworks PoC implementation (next session)

---

## Rejected Alternatives

### CadQuery (keep as-is)

- **Rejected because**: build123d offers a more modern API, better type hinting, and structural patterns (Context Manager) that are more amenable to LLM code generation. Same OCCT kernel means no geometric capability loss.

### OpenSCAD

- **Rejected because**: No STEP export capability. No NURBS support. CSG-only approach is inadequate for manufacturing-grade geometry. Unsuitable for downstream CAM/FEA workflows.

### FreeCAD Scripting

- **Rejected because**: Heavy GUI dependency makes server-side integration difficult. Macro API is less stable and harder for LLMs to generate reliably. Deployment complexity is significantly higher.

### Pure OWL (without Neo4j)

- **Rejected because**: Performance limitations with large-scale instance data. Triple stores alone struggle with the query patterns needed for real-time design exploration (e.g., "find all gear pairs where contact ratio &gt; 1.4 and module &lt; 3"). Neo4j as a property graph layer provides the necessary query performance.

### LLM Alone (without Ontology)

- **Rejected because**: Hallucination control is impossible without grounding. Numerical precision (gear tooth profiles, stress calculations) cannot be guaranteed by LLM inference alone. Ontology provides the constraint framework that keeps LLM outputs within valid engineering bounds.