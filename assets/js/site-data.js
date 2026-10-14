window.SITE_DATA = {
 "title": "Fabric Implementation Playbooks",
 "brandShort": "Fabric Playbooks",
 "brandSub": "Implementation guides",
 "repo": "",
 "categories": [
  {
   "id": "strategy",
   "title": "Strategy & Migration",
   "blurb": "Plan the move to Fabric: scope, licensing, workspace strategy, migration waves and go-live."
  },
  {
   "id": "data-engineering",
   "title": "Architecture & Data Engineering",
   "blurb": "Medallion layers, load patterns, orchestration, partitioning and reusable engineering assets."
  },
  {
   "id": "alm",
   "title": "ALM & DevOps",
   "blurb": "Source control, branching, deployment pipelines, environment configuration and release checklists."
  },
  {
   "id": "analytics",
   "title": "Analytics & BI",
   "blurb": "Semantic models, report development standards, organizational apps and paginated reports."
  },
  {
   "id": "governance",
   "title": "Governance & Quality",
   "blurb": "Tenant settings, validation frameworks and the controls that keep a platform trustworthy."
  }
 ],
 "playbooks": [
  {
   "id": "01-powerbi-to-fabric-migration",
   "number": "01",
   "title": "Power BI to Fabric Migration",
   "short": "Power BI to Fabric",
   "summary": "A strategic and technical playbook for moving a Power BI Premium or Pro estate to Microsoft Fabric: capacity migration, rationalization, medallion rebuild, validation, go-live and adoption.",
   "category": "strategy",
   "level": "Intermediate",
   "audience": "Platform leads, architects, BI and data engineers, program managers",
   "readingTime": "120 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview and execution map",
     "description": "Why the migration has two workstreams, the four execution phases, and how the pages of this playbook fit together."
    },
    {
     "file": "strategy-licensing.html",
     "title": "Strategy, licensing and capacity",
     "description": "Strategic case, migration paths, F SKU licensing rules, cost levers, smoothing and throttling, and the Premium-to-Fabric capacity runbook."
    },
    {
     "file": "architecture.html",
     "title": "Architecture and environments",
     "description": "Medallion layers, All-Lakehouse versus Hybrid decision matrix, workspace strategy, naming convention, Git and CI/CD foundation."
    },
    {
     "file": "governance.html",
     "title": "Governance with Fabric and Purview",
     "description": "A govern-first framework: OneLake catalog, domains, endorsement, sensitivity labels, DLP, audit and access control."
    },
    {
     "file": "assessment.html",
     "title": "Assessment and rationalization",
     "description": "Automated inventory, usage analysis within activity-log retention limits, the decision tree and the report rationalization matrix template."
    },
    {
     "file": "reverse-engineering.html",
     "title": "Reverse-engineering legacy assets",
     "description": "Extract models, DAX, M, security and query patterns with Tabular Editor, DAX Studio, Semantic Link, BPA and PBIP/TMDL; write the specification and mapping documents."
    },
    {
     "file": "build-data.html",
     "title": "Build the data layers",
     "description": "Medallion build guidance for a Power BI migration, replacing Dataflow Gen1, Warehouse SCD Type 2 pattern, and metadata-driven orchestration."
    },
    {
     "file": "semantic-delivery.html",
     "title": "Semantic models and reports",
     "description": "Choose Import, Direct Lake or DirectQuery, rebuild certified semantic models and thin reports, rebind keepers, and migrate security."
    },
    {
     "file": "validate-release.html",
     "title": "Validate, deploy and go live",
     "description": "Data reconciliation, functional, performance and security QA, UAT, production deployment, parallel run and decommissioning."
    },
    {
     "file": "adoption-plan.html",
     "title": "Change, support and project plan",
     "description": "Communication and training plan, post-migration support model, a phased project plan template with a relative-week timeline, and checklists."
    }
   ]
  },
  {
   "id": "02-data-load-strategy",
   "number": "02",
   "title": "Data Load Strategy",
   "short": "Data Load Strategy",
   "summary": "Choose full or incremental loads per table and per medallion layer, detect changes at the source, apply MERGE, SCD2 and deletes safely, and pick the right Fabric tool for each job.",
   "category": "data-engineering",
   "level": "Intermediate",
   "audience": "Data engineers, architects, analytics engineering leads",
   "readingTime": "80 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "What the load strategy framework decides, who it is for, and a map of the pages."
    },
    {
     "file": "load-strategy.html",
     "title": "Full vs incremental loads",
     "description": "Characteristics, eligibility thresholds and a comparison of destructive full loads and incremental loads."
    },
    {
     "file": "change-tracking.html",
     "title": "Change tracking options",
     "description": "High-watermark, log-based CDC, mirroring, Copy job incremental modes and Delta change data feed, and how to choose."
    },
    {
     "file": "bronze.html",
     "title": "Bronze layer patterns",
     "description": "Files versus Delta in Bronze, the landing zone, append-only loading and mixed full and incremental feeds."
    },
    {
     "file": "silver.html",
     "title": "Silver: MERGE, SCD2 and deletes",
     "description": "Full reloads, Delta MERGE upserts, slowly changing dimensions and delete handling aligned to the change signal."
    },
    {
     "file": "gold-direct-lake.html",
     "title": "Gold layer and Direct Lake",
     "description": "Full recalculation versus incremental aggregation, and how Direct Lake framing and fallback shape Gold loading."
    },
    {
     "file": "tooling.html",
     "title": "Choosing the right tool",
     "description": "Pipelines, Copy job, Dataflows Gen2, Spark and T-SQL notebooks, mirroring and materialized lake views compared."
    },
    {
     "file": "cheat-sheet.html",
     "title": "Decision matrix cheat sheet",
     "description": "One-page matrices for load pattern and tool choice, anti-patterns, operations checks and a checklist."
    }
   ]
  },
  {
   "id": "03-medallion-architecture",
   "number": "03",
   "title": "Medallion Architecture",
   "short": "Medallion Architecture",
   "summary": "A strictly isolated Bronze, Silver, Gold, Consumption and Delivery workspace design on Fabric, with naming standards, reusable load and MERGE code, notebook guidance and Environment setup.",
   "category": "data-engineering",
   "level": "Intermediate",
   "audience": "Data engineers, solution architects, platform and security teams",
   "readingTime": "120 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "What the medallion workspace design solves, when to use it, how the pages fit together and an implementation checklist."
    },
    {
     "file": "architecture.html",
     "title": "Layers and strict isolation",
     "description": "The five layers, why each gets its own workspace, the cost of isolation, the options compared and the security controls that apply."
    },
    {
     "file": "workspace-pattern.html",
     "title": "Workspace pattern and naming",
     "description": "Workspace and item inventory per layer, naming conventions, abbreviations, capacity placement and a promotion summary."
    },
    {
     "file": "notebooks.html",
     "title": "Fabric notebooks",
     "description": "Notebook capabilities, use cases, sizing and structure guidance, orchestration, monitoring hooks and the verified hard limits."
    },
    {
     "file": "environment.html",
     "title": "The Environment item",
     "description": "Set up one Environment per workspace: Spark properties, resource profiles, libraries, publish modes and workspace defaults."
    },
    {
     "file": "bronze-to-silver.html",
     "title": "Bronze to Silver",
     "description": "Shortcuts into Silver, notebook setup, choosing a load pattern and the reusable full-load function."
    },
    {
     "file": "incremental-merge.html",
     "title": "Incremental loads and MERGE",
     "description": "Watermarks and primary keys, the reusable incremental MERGE utility, delete handling and failure modes."
    },
    {
     "file": "silver-to-gold.html",
     "title": "Silver to Gold",
     "description": "Full loads in Spark SQL and PySpark, plus a config-driven incremental MERGE engine with built-in reconciliation."
    },
    {
     "file": "consumption-delivery.html",
     "title": "Consumption and delivery",
     "description": "Warehouse load from Gold shortcuts, semantic models and Direct Lake, an AI/ML lakehouse and publishing to the Delivery layer."
    },
    {
     "file": "appendix.html",
     "title": "Appendix: loader internals",
     "description": "Generic full-load loaders with filters and transforms, and a line-by-line explanation of the Silver and Gold merge engines."
    }
   ]
  },
  {
   "id": "04-cross-workspace-orchestration",
   "number": "04",
   "title": "Cross-Workspace Pipeline Orchestration (Hub and Spoke)",
   "short": "Hub and Spoke",
   "summary": "Orchestrate Fabric pipelines across workspaces with a hub master pipeline that invokes spoke pipelines: identity, control flow, central logging, CI/CD, alternatives and a hands-on workshop.",
   "category": "data-engineering",
   "level": "Advanced",
   "audience": "Data engineers, platform architects, DevOps engineers",
   "readingTime": "90 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "Why hub-and-spoke orchestration exists, when to use it, what the current platform supports and how this playbook is organized."
    },
    {
     "file": "architecture.html",
     "title": "Hub-and-spoke architecture",
     "description": "Hub and spoke roles, the contract between them, how to cut spokes, and the capacity and permission model."
    },
    {
     "file": "invoke-pipeline.html",
     "title": "The Invoke pipeline activity",
     "description": "Legacy versus new activity, connections and identities, wait on completion, parameters, limits, known issues and the REST fallback."
    },
    {
     "file": "control-flow.html",
     "title": "Control flow and failure handling",
     "description": "Sequential, parallel, conditional and metadata-driven patterns, retries, timeouts, failure semantics, idempotency and run conditions."
    },
    {
     "file": "operations.html",
     "title": "Logging, monitoring and CI/CD",
     "description": "Central run logging, Monitoring hub, workspace monitoring, alerts, the item-ID problem and deploying hub and spokes across environments."
    },
    {
     "file": "alternatives.html",
     "title": "Alternatives and recommendations",
     "description": "Decision table comparing hub-and-spoke pipelines with notebook DAGs, Airflow jobs, event-driven triggers and run conditions, plus recommendations and a readiness checklist."
    },
    {
     "file": "workshop.html",
     "title": "Workshop: build hub and spokes",
     "description": "Numbered hands-on exercise: two spoke workspaces, a hub workspace, a master pipeline, permissions, a test run and a troubleshooting table."
    }
   ]
  },
  {
   "id": "05-github-integration",
   "number": "05",
   "title": "GitHub Integration and Branching",
   "short": "GitHub Integration",
   "summary": "Connect Fabric workspaces to GitHub safely, run GitHub Flow with feature workspaces, harden the repository with rulesets, and automate deployment with service principals and OIDC.",
   "category": "alm",
   "level": "Intermediate",
   "audience": "Platform leads, DevOps and data engineers, Fabric workspace admins, GitHub organization owners",
   "readingTime": "110 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview and ALM map",
     "description": "What Fabric Git integration with GitHub gives you, when to use it, the end-to-end change flow and how the pages of this playbook fit together."
    },
    {
     "file": "foundations.html",
     "title": "Prerequisites and authentication",
     "description": "Tenant settings, capacity, workspace and GitHub permissions, token types for the Git connection, GitHub Enterprise Cloud support and the two-tier identity model."
    },
    {
     "file": "repository-design.html",
     "title": "Repository and workspace layout",
     "description": "How workspace items map to repository folders, item folder anatomy, one repository versus many, recommended layout and the limits that shape it."
    },
    {
     "file": "connect-safely.html",
     "title": "Connecting safely",
     "description": "Preflight safeguards, the first-sync decision, step-by-step connection of each workspace, the baseline commit and the folder-change hazard."
    },
    {
     "file": "sync-and-items.html",
     "title": "Sync model and supported items",
     "description": "Commit, update, undo and conflict handling, branch operations, known quirks, how to read the supported-item list and the general limitations."
    },
    {
     "file": "branching-workflow.html",
     "title": "GitHub Flow for Fabric",
     "description": "Main as source of truth, feature branches, branch-out workspaces, why data is not copied, the pull request process and cleanup."
    },
    {
     "file": "security-hardening.html",
     "title": "Access model and repository hardening",
     "description": "Teams, roles and least privilege, Entra ID and SSO, rulesets versus branch protection, the recommended main ruleset and optional scanning."
    },
    {
     "file": "service-principals-automation.html",
     "title": "Service principals and Actions",
     "description": "Service principal setup, secret scopes, environments with required reviewers, OIDC federation, GitHub Actions workflows and fabric-cicd."
    },
    {
     "file": "operations-rollback.html",
     "title": "Operations, rollback and checklist",
     "description": "The unified secure ALM view, auditing, troubleshooting, rollback with git revert or reset, restoring in Fabric and the readiness checklist."
    }
   ]
  },
  {
   "id": "06-shared-libraries",
   "number": "06",
   "title": "Shared Python Libraries",
   "short": "Shared Libraries",
   "summary": "Package vetted Spark utilities as a versioned Python wheel, test and build it in CI, and deliver it through a Fabric Environment so every notebook and pipeline imports the same code.",
   "category": "data-engineering",
   "level": "Intermediate",
   "audience": "Data engineers, platform engineers, technical leads",
   "readingTime": "80 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "Why copied notebook helpers drift, the wheel-plus-Environment approach, when to use it and a map of the playbook."
    },
    {
     "file": "library-design.html",
     "title": "Designing the library",
     "description": "From notebook cells to a library API: the transform, projection and call pattern, full_load_overwrite and incremental merge helpers, and API design rules."
    },
    {
     "file": "packaging.html",
     "title": "Packaging and building a wheel",
     "description": "pyproject.toml with the src layout, repo structure, the complete module code, unit tests and building and validating the wheel locally."
    },
    {
     "file": "environment.html",
     "title": "Installing in a Fabric Environment",
     "description": "Upload, publish and attach the wheel, Quick versus Full publish mode, session start impact, why not %pip in pipelines, and using the library in a notebook."
    },
    {
     "file": "cicd.html",
     "title": "CI/CD with GitHub Actions",
     "description": "Test, build once and promote the same wheel to DEV, TST and PRD Environments with OIDC sign-in and the Fabric Environment REST API."
    },
    {
     "file": "distribution-and-ops.html",
     "title": "Options, operations, checklist",
     "description": "Distribution options compared (Environment, feed, Lakehouse Files, %run), testing without an Environment, governance, troubleshooting and the validation checklist."
    }
   ]
  },
  {
   "id": "07-deployment",
   "number": "07",
   "title": "Deployment Pipelines and Promotion",
   "short": "Deployment Pipelines",
   "summary": "Combine Git with Fabric deployment pipelines to promote lakehouses, notebooks, warehouses, semantic models and reports from DEV to TST to PRD, with pairing, autobinding, rules and a safe layer order.",
   "category": "alm",
   "level": "Advanced",
   "audience": "Platform architects, data engineers, release managers",
   "readingTime": "120 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "What the hybrid Git plus deployment pipeline pattern solves, when to use it, and a map of the playbook."
    },
    {
     "file": "strategy.html",
     "title": "Deployment strategy",
     "description": "The hybrid pattern, an honest comparison with Git-only and code-first promotion, operating rules and anti-patterns."
    },
    {
     "file": "pipeline-setup.html",
     "title": "Pipeline setup and pairing",
     "description": "Create a pipeline, assign workspaces, choose the UI, understand item pairing and resolve common setup problems."
    },
    {
     "file": "manual-deploy.html",
     "title": "The manual deployment",
     "description": "Compare stages, choose full, selective or backward deployment, deploy with a note, review changes and know what is copied."
    },
    {
     "file": "autobinding.html",
     "title": "Autobinding",
     "description": "How dependent items stay connected across stages, what binds and what does not, and how to override it."
    },
    {
     "file": "order-and-layers.html",
     "title": "Deployment order and layers",
     "description": "One pipeline per medallion layer, the dependency order from Bronze to Delivery, and the deploy, hydrate, verify loop."
    },
    {
     "file": "deployment-rules.html",
     "title": "Supported items and rules",
     "description": "The support matrix for Git and pipelines, rule types per item, and worked scenarios for notebooks and semantic models including Direct Lake."
    },
    {
     "file": "automation-and-limits.html",
     "title": "Automation and limits",
     "description": "Deploy from CI with the REST API, code-first alternatives, workarounds for unsupported items, and permissions."
    },
    {
     "file": "appendix.html",
     "title": "Appendix: IDs and rule values",
     "description": "An inventory notebook, queries that return rule values, and a per-stage rule settings template."
    }
   ]
  },
  {
   "id": "08-delta-partitioning",
   "number": "08",
   "title": "Delta Lake Partitioning Strategy",
   "short": "Delta Partitioning",
   "summary": "Decide whether to partition a Delta table, when liquid clustering or compaction is better, how Direct Lake, the SQL endpoint and Warehouse consume the layout, and how to implement and operate it.",
   "category": "data-engineering",
   "level": "Intermediate",
   "audience": "Data engineers, architects, platform and capacity owners",
   "readingTime": "45 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "What the partitioning decision covers, the default answer, and a decision tree for the exceptions."
    },
    {
     "file": "concepts.html",
     "title": "Why and when to partition",
     "description": "Partition pruning, small-file arithmetic, concurrent-writer isolation, cardinality limits and the principles behind the defaults."
    },
    {
     "file": "fabric-features.html",
     "title": "Fabric layout features",
     "description": "V-Order, optimize write, auto compaction, adaptive file size, OPTIMIZE, Z-Order, VACUUM and liquid clustering, and how they combine."
    },
    {
     "file": "patterns.html",
     "title": "Patterns by layer and consumer",
     "description": "Bronze, Silver and Gold layouts, Direct Lake, SQL analytics endpoint and Warehouse considerations, and neutral worked examples."
    },
    {
     "file": "implementation.html",
     "title": "Implementation examples",
     "description": "Create partitioned and clustered tables, append, replace a slice, run concurrent merges, and change a layout safely."
    },
    {
     "file": "operations.html",
     "title": "Validation and operations",
     "description": "Measure layout health, diagnose small files, keep the SQL endpoint in sync, schedule maintenance and use the checklist."
    }
   ]
  },
  {
   "id": "09-variable-libraries",
   "number": "09",
   "title": "Variable Libraries",
   "short": "Variable Libraries",
   "summary": "Hold stage-specific values (item IDs, connections, sizes, flags) in one Fabric item with a value set per stage, and let pipelines, notebooks, dataflows and shortcuts read the active set at run time.",
   "category": "alm",
   "level": "Intermediate",
   "audience": "Data engineers, platform engineers, release managers",
   "readingTime": "65 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "The problem with stage-specific values scattered through items, what a variable library is and is not, when to use it, prerequisites and a map of the playbook."
    },
    {
     "file": "concepts.html",
     "title": "Concepts and anatomy",
     "description": "Variable types, default and alternative value sets, the active value set as workspace state, naming rules, limits and the permission model."
    },
    {
     "file": "build-and-consume.html",
     "title": "Create and consume variables",
     "description": "Create a library, then read it from pipelines, notebooks, dataflows, shortcuts and other items, with the supported types and limits of each consumer."
    },
    {
     "file": "cicd-promotion.html",
     "title": "Promotion, Git and automation",
     "description": "How libraries behave in deployment pipelines and Git, the step after the first deployment, deployment rules compared, the REST API and a scripted activation."
    },
    {
     "file": "example-and-operations.html",
     "title": "Worked example and operations",
     "description": "A DEV, TST and PRD example end to end, anti-patterns, a troubleshooting table and the validation checklist."
    }
   ]
  },
  {
   "id": "10-control-table-pipelines",
   "number": "10",
   "title": "Control-Table-Driven Pipelines and Asset Discovery",
   "short": "Control tables",
   "summary": "Drive Fabric pipelines from a Warehouse control table instead of hard-coded activities, and keep the item IDs it needs fresh with an automated, API-based inventory of every workspace and item.",
   "category": "data-engineering",
   "level": "Advanced",
   "audience": "Data platform engineers, Fabric administrators, orchestration and DevOps owners",
   "readingTime": "100 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "What the control-table framework and asset inventory solve, when to use them, what you build, and how the pages fit together."
    },
    {
     "file": "asset-inventory.html",
     "title": "Asset discovery and inventory",
     "description": "Choose the right API, authenticate safely, build the inventory notebook and tables, and use the catalog for governance, orchestration, cost, security and CI/CD."
    },
    {
     "file": "framework-design.html",
     "title": "Framework design and decisions",
     "description": "Principles, end-to-end flow, prerequisites, topology, a decision table against alternatives, and design guidance for ordering, retries, concurrency and restarts."
    },
    {
     "file": "warehouse-objects.html",
     "title": "Warehouse objects and seed data",
     "description": "Convert T-SQL scripts to stored procedures, create the control table, run log, procedures and views in a Fabric Warehouse, and seed the first tasks."
    },
    {
     "file": "dispatcher.html",
     "title": "Notebook dispatcher (GUID launcher)",
     "description": "Run notebooks by item ID so renames cannot break orchestration: options compared, the dispatcher notebook, polling, identity and capacity behavior."
    },
    {
     "file": "master-pipeline.html",
     "title": "Build the master pipeline",
     "description": "Guard step, stage lookups, ForEach settings, the per-task body with logging, Switch on task type, failure paths and a reusable notification pipeline."
    },
    {
     "file": "extended-scenario.html",
     "title": "Extended scenario and workshop",
     "description": "Scale the plan from five to twenty tasks, populate the control table, inspect the lookups and run timelines, and rebuild the pipeline as a hands-on workshop."
    },
    {
     "file": "operations.html",
     "title": "Operations, security and checklist",
     "description": "Health-check queries, monitoring, troubleshooting, security, CI/CD with variable libraries, observability, and a go-live checklist with references."
    }
   ]
  },
  {
   "id": "11-org-apps",
   "number": "11",
   "title": "Organizational Apps",
   "short": "Org Apps",
   "summary": "Package reports, notebooks, real-time dashboards and other Fabric items into governed, audience-aware org apps, and manage their access, ALM and lifecycle.",
   "category": "analytics",
   "level": "Intermediate",
   "audience": "BI developers, Fabric and Power BI administrators, analytics architects",
   "readingTime": "65 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "What org apps are, when to use them, status of the capabilities, prerequisites at a glance and a map of the playbook."
    },
    {
     "file": "concepts.html",
     "title": "Concepts and choosing an app model",
     "description": "Anatomy of an org app, live references versus snapshots, how access propagates, and a decision table against workspace apps, embedding, template apps and Fabric Apps."
    },
    {
     "file": "prerequisites.html",
     "title": "Prerequisites and governance",
     "description": "Tenant settings, workspace types and capacity, per-user licenses, workspace roles, the write-and-reshare rule and a pre-flight checklist."
    },
    {
     "file": "build.html",
     "title": "Build and customize an org app",
     "description": "Audience-first design, step-by-step creation, content curation, navigation, overview page, branding, preview and save."
    },
    {
     "file": "content.html",
     "title": "Integrating Fabric and Power BI items",
     "description": "Supported item types, what each grants to consumers, Direct Lake and Real-Time Dashboard identity models, and where access is not propagated."
    },
    {
     "file": "access-alm.html",
     "title": "Access, ALM and lifecycle",
     "description": "Sharing, audiences, revoking access, Git integration, deployment pipelines, updating and deleting an org app."
    },
    {
     "file": "practices.html",
     "title": "Practices, pitfalls and roadmap",
     "description": "Best practices, symptom-to-fix troubleshooting, consumer surfaces, how to track capability changes, and a final checklist."
    }
   ]
  },
  {
   "id": "12-power-bi-report-development",
   "number": "12",
   "title": "Power BI Report Development Standards",
   "short": "Report Dev Standards",
   "summary": "Standards for building maintainable, fast Power BI semantic models and thin reports on a Fabric data platform: model settings, storage modes, naming, DAX, rebinding, endorsement and a pre-publish checklist.",
   "category": "analytics",
   "level": "Intermediate",
   "audience": "Power BI developers, analytics engineers, BI leads, report reviewers",
   "readingTime": "75 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "What the standards cover, how the layers fit together, and where to start."
    },
    {
     "file": "semantic-model.html",
     "title": "Semantic model standards",
     "description": "Storage mode choice, auto date/time and auto relationship settings, star schema, hiding, descriptions, calculation groups and PBIP/TMDL projects."
    },
    {
     "file": "report-design.html",
     "title": "Report design and performance",
     "description": "Layout, theme, accessibility, mobile layout, drillthrough, query reduction, Performance Analyzer workflow and optimization levers."
    },
    {
     "file": "naming-dax.html",
     "title": "Naming, DAX and measures tables",
     "description": "Naming rules for measures, columns and tables, DAX patterns, calculation groups and a step-by-step measures table in the UI and in TMDL."
    },
    {
     "file": "rebinding.html",
     "title": "Rebinding reports to a new model",
     "description": "Repoint a report to a different semantic model by REST, semantic-link-labs, PBIP or manual remap, with a schema diff and a verification matrix."
    },
    {
     "file": "collaboration-qa.html",
     "title": "Collaboration, endorsement and QA",
     "description": "Shared semantic models with thin reports, endorsement and certification, Git and pipeline flow, change management and the pre-publish QA checklist."
    }
   ]
  },
  {
   "id": "13-paginated-report-migration",
   "number": "13",
   "title": "Paginated Report Migration",
   "short": "Paginated Migration",
   "summary": "Move paginated (RDL) reports from Power BI Premium capacity workspaces to Fabric workspaces: inventory, workspace reassignment or RDL republishing, deployment pipeline rules, gateways, validation and cutover.",
   "category": "analytics",
   "level": "Intermediate",
   "audience": "BI developers, Power BI and Fabric administrators, migration leads",
   "readingTime": "70 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "What moves, the two migration methods, who can view paginated reports after the move, and a map of the playbook."
    },
    {
     "file": "assessment.html",
     "title": "Phase 1: Inventory and assessment",
     "description": "Catalog every report with REST calls and an RDL parser, classify what needs rework, and decide migrate, modify, redesign or retire."
    },
    {
     "file": "migration-methods.html",
     "title": "Phase 2: Migration methods",
     "description": "Reassign a workspace to Fabric capacity, republish RDL files by Report Builder or REST, handle SSRS and Report Server sources, and choose between them."
    },
    {
     "file": "pipelines-gateways.html",
     "title": "Pipelines, gateways and sources",
     "description": "Data source rules in deployment pipelines, gateway and cloud connection mapping, Fabric Warehouse and Lakehouse SQL endpoint sources, and the REST calls that script them."
    },
    {
     "file": "validation-cutover.html",
     "title": "Phase 3: Validation and cutover",
     "description": "Parity tests for layout, data and exports, performance and capacity checks, subscriptions and permissions, cutover sequence, rollback and decommissioning."
    },
    {
     "file": "troubleshooting.html",
     "title": "Risks, troubleshooting, checklist",
     "description": "Risk register, symptom-to-fix table, a migration readiness checklist and references."
    }
   ]
  },
  {
   "id": "14-deployment-checklist",
   "number": "14",
   "title": "Deployment Checklist",
   "short": "Deployment Checklist",
   "summary": "A release-day runbook for promoting a layered Fabric platform from DEV to TST to PRD: order of operations, per-layer checklists, verified tips, gates and a troubleshooting table.",
   "category": "alm",
   "level": "Intermediate",
   "audience": "Release managers, data engineers",
   "readingTime": "45 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "What the runbook covers, the order of operations for all seven layers, ground rules and prerequisites."
    },
    {
     "file": "layer-checklists.html",
     "title": "Layer checklists",
     "description": "Deploy, configure, hydrate and verify checklists for Bronze, Silver, Gold, warehouse, semantic model, consumption lakehouse and delivery."
    },
    {
     "file": "tips.html",
     "title": "Tips and watch-outs",
     "description": "Five practices that prevent most deployment failures, each with the mechanism behind it, plus further watch-outs."
    },
    {
     "file": "preflight-verify.html",
     "title": "Pre-flight and verification",
     "description": "Checks before, during and after a deployment, the three gates between layers, per-item verification and the evidence to keep."
    },
    {
     "file": "troubleshooting.html",
     "title": "Troubleshooting",
     "description": "Symptom, likely cause and fix tables for blocked, duplicated, wrong-source and empty-data problems, with a triage path."
    }
   ]
  },
  {
   "id": "15-qa-validation",
   "number": "15",
   "title": "QA Validation Frameworks",
   "short": "QA Validation",
   "summary": "Notebook-based, SQL-first validation frameworks for Fabric medallion pipelines: row counts, transformations, schema, freshness and metric reconciliation, with structured results, gates and alerts.",
   "category": "governance",
   "level": "Intermediate",
   "audience": "Data engineers, QA analysts, data architects, DevOps engineers",
   "readingTime": "100 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview",
     "description": "What the validation frameworks give you, when to use them, scope, prerequisites and a map of the playbook."
    },
    {
     "file": "architecture.html",
     "title": "Architecture and design principles",
     "description": "The three frameworks, the validation type matrix, design principles, workspace layout, data flow and naming rules including four-part names and T-SQL versus Spark SQL."
    },
    {
     "file": "results-model.html",
     "title": "Results model and tolerances",
     "description": "The results and run tables, status model, severity, and how to design tolerances, warning bands and expected-reject accounting."
    },
    {
     "file": "core-checks.html",
     "title": "Harness and core checks",
     "description": "The notebook harness and the row count, transformation, schema and freshness checks with copy-ready code, success criteria and example output."
    },
    {
     "file": "advanced-checks.html",
     "title": "Complex and extended checks",
     "description": "Complex metric reconciliation with rolling fiscal windows, plus duplicate, null, referential integrity, drift, layer reconciliation and late-arriving data checks."
    },
    {
     "file": "orchestration.html",
     "title": "Orchestration, gating and reporting",
     "description": "Running validations from pipelines, gating promotion on results, alerting on failure and reporting results through a semantic model."
    },
    {
     "file": "operations.html",
     "title": "Governance and troubleshooting",
     "description": "Ownership roles, change control, adding a validation, versioning, performance guidance, troubleshooting tables and common pitfalls."
    },
    {
     "file": "tools-comparison.html",
     "title": "Comparison with other tools",
     "description": "How the framework compares with Delta constraints, materialized lake view constraints, Purview data quality, Great Expectations, Deequ, Soda and dbt tests, with a decision table and checklist."
    }
   ]
  },
  {
   "id": "16-tenant-settings",
   "number": "16",
   "title": "Tenant Settings Reference and Decision Guide",
   "short": "Tenant Settings",
   "summary": "A vendor-neutral reference for Microsoft Fabric tenant settings: what each controls, defaults, a recommended enterprise posture, safe enablement through security groups, and change control.",
   "category": "governance",
   "level": "Intermediate",
   "audience": "Fabric administrators, security and governance leads, platform owners",
   "readingTime": "90 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview and how settings work",
     "description": "What tenant settings are, where to find them, how scoping, delegation and propagation work, and where each group of settings is covered."
    },
    {
     "file": "framework.html",
     "title": "Decision framework and rollout",
     "description": "A repeatable way to decide each setting, enable it through security groups, pilot it and keep it reviewed."
    },
    {
     "file": "export-sharing.html",
     "title": "Export and sharing settings",
     "description": "Reference and recommended posture for export, sharing, guest and external collaboration settings."
    },
    {
     "file": "content-models.html",
     "title": "Content, models and discovery",
     "description": "Reference for cross-workspace models, information protection, discovery, apps, visuals, legacy dataflows and semantic model settings."
    },
    {
     "file": "integration-api.html",
     "title": "Integration, developer and APIs",
     "description": "Reference for XMLA, Execute Queries, service principal and admin API settings, maps, single sign-on and streaming authentication."
    },
    {
     "file": "workspace-git-onelake.html",
     "title": "Workspaces, Git, OneLake and items",
     "description": "Reference for Fabric item creation, workspace and recovery settings, Git integration, OneLake access, networking and encryption."
    },
    {
     "file": "ai-preview-other.html",
     "title": "AI, preview and experimental",
     "description": "Reference for Copilot and Azure OpenAI, agents, preview item types, experiments, audit and usage settings."
    },
    {
     "file": "matrix.html",
     "title": "Quick reference matrix",
     "description": "Every setting in one table with default, recommended posture, scoping and a link to its detail."
    },
    {
     "file": "operations.html",
     "title": "Change control and troubleshooting",
     "description": "Change records, snapshot-and-diff automation, audit events and a troubleshooting guide from symptom to setting."
    }
   ]
  },
  {
   "id": "17-pr-notifications-codeowners",
   "number": "17",
   "title": "Pull-Request Notifications with CODEOWNERS",
   "short": "PR Notifications",
   "summary": "Route pull requests to the right reviewers with a CODEOWNERS file, require their approval through a ruleset, and understand which notifications GitHub really sends, and to whom.",
   "category": "alm",
   "level": "Intermediate",
   "audience": "Repository admins, platform and workspace leads, Fabric developers and reviewers",
   "readingTime": "35 min",
   "pages": [
    {
     "file": "index.html",
     "title": "Overview and how it works",
     "description": "What CODEOWNERS does and does not do, the path from an opened pull request to a notification, and who controls each step."
    },
    {
     "file": "codeowners-file.html",
     "title": "Creating the CODEOWNERS file",
     "description": "File locations and precedence, syntax and patterns, why order matters, owners and teams, protecting the file and validating it."
    },
    {
     "file": "fabric-example.html",
     "title": "Fabric folders and enforcement",
     "description": "A worked CODEOWNERS file for a Fabric repository, owners per item folder, and enforcing code owner approval with a ruleset."
    },
    {
     "file": "notifications.html",
     "title": "Notifications and troubleshooting",
     "description": "How review requests become notifications, team and personal settings, the pull request UI, and a troubleshooting guide with a go-live checklist."
    }
   ]
  }
 ]
};
