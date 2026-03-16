import type { Question } from "@/types/quiz";

export const devopsQuestions: Question[] = [
  // Junior
  {
    id: "devops-j1",
    category: "devops",
    text: "What does API stand for?",
    topic: "apis",
    level: "junior",
    options: [
      { id: "devops-j1a", text: "Application Process Interface" },
      { id: "devops-j1b", text: "Automated Program Integration" },
      { id: "devops-j1c", text: "Application Programming Interface" },
      { id: "devops-j1d", text: "Access Protocol Integration" },
    ],
    correctOptionId: "devops-j1c",
    explanation:
      "API means Application Programming Interface: a contract that lets systems communicate through defined inputs and outputs.",
  },
  {
    id: "devops-j2",
    category: "devops",
    text: "What is CI in CI/CD?",
    topic: "ci-cd",
    level: "junior",
    options: [
      { id: "devops-j2a", text: "Continuous Integration" },
      { id: "devops-j2b", text: "Code Inspection" },
      { id: "devops-j2c", text: "Container Isolation" },
      { id: "devops-j2d", text: "Continuous Infrastructure" },
    ],
    correctOptionId: "devops-j2a",
    explanation:
      "Continuous Integration is the practice of frequently merging code and validating it automatically with builds and tests.",
  },
  {
    id: "devops-j3",
    category: "devops",
    text: "Which Docker command lists running containers?",
    topic: "docker",
    level: "junior",
    options: [
      { id: "devops-j3a", text: "docker images" },
      { id: "devops-j3b", text: "docker ps" },
      { id: "devops-j3c", text: "docker run" },
      { id: "devops-j3d", text: "docker logs" },
    ],
    correctOptionId: "devops-j3b",
    explanation:
      "docker ps shows running containers. Use docker ps -a to include stopped containers.",
  },
  {
    id: "devops-j4",
    category: "devops",
    text: "What is the main goal of CD in CI/CD?",
    topic: "ci-cd",
    level: "junior",
    options: [
      { id: "devops-j4a", text: "Manually deploy less often" },
      { id: "devops-j4b", text: "Automate delivery/deployment safely" },
      { id: "devops-j4c", text: "Eliminate testing" },
      { id: "devops-j4d", text: "Only deploy on weekends" },
    ],
    correctOptionId: "devops-j4b",
    explanation:
      "CD emphasizes repeatable, automated release flows so changes can be delivered frequently with lower risk.",
  },
  {
    id: "devops-j5",
    category: "devops",
    text: "What is a container image?",
    topic: "docker",
    level: "junior",
    options: [
      { id: "devops-j5a", text: "A running process in Kubernetes" },
      { id: "devops-j5b", text: "A blueprint used to create containers" },
      { id: "devops-j5c", text: "A VM snapshot with a full OS kernel" },
      { id: "devops-j5d", text: "A network load balancer" },
    ],
    correctOptionId: "devops-j5b",
    explanation:
      "An image packages app code, runtime, and dependencies. Containers are runtime instances created from images.",
  },
  {
    id: "devops-j6",
    category: "devops",
    text: "Which HTTP method is typically used to fetch data without changing server state?",
    topic: "apis",
    level: "junior",
    options: [
      { id: "devops-j6a", text: "POST" },
      { id: "devops-j6b", text: "PUT" },
      { id: "devops-j6c", text: "GET" },
      { id: "devops-j6d", text: "DELETE" },
    ],
    correctOptionId: "devops-j6c",
    explanation:
      "GET is intended for read operations. It should be safe and idempotent in RESTful APIs.",
  },
  {
    id: "devops-j7",
    category: "devops",
    text: "What does Infrastructure as Code (IaC) mean?",
    topic: "infrastructure",
    level: "junior",
    options: [
      { id: "devops-j7a", text: "Writing application code in YAML" },
      { id: "devops-j7b", text: "Managing infra with versioned, declarative code" },
      { id: "devops-j7c", text: "Installing servers manually" },
      { id: "devops-j7d", text: "Only using cloud providers" },
    ],
    correctOptionId: "devops-j7b",
    explanation:
      "IaC defines infrastructure in code so environments can be reproducible, reviewable, and automated.",
  },
  {
    id: "devops-j8",
    category: "devops",
    text: "In Kubernetes, what is a Pod?",
    topic: "kubernetes",
    level: "junior",
    options: [
      { id: "devops-j8a", text: "A physical server" },
      { id: "devops-j8b", text: "The smallest deployable unit, wrapping one or more containers" },
      { id: "devops-j8c", text: "A package manager" },
      { id: "devops-j8d", text: "A CI pipeline stage" },
    ],
    correctOptionId: "devops-j8b",
    explanation:
      "A Pod is Kubernetes' basic scheduling unit. It groups containers that share network and storage context.",
  },
  {
    id: "devops-j9",
    category: "devops",
    text: "What is the purpose of monitoring in operations?",
    topic: "networking-monitoring",
    level: "junior",
    options: [
      { id: "devops-j9a", text: "Only create dashboards" },
      { id: "devops-j9b", text: "Detect issues and understand system health" },
      { id: "devops-j9c", text: "Replace backups" },
      { id: "devops-j9d", text: "Avoid writing tests" },
    ],
    correctOptionId: "devops-j9b",
    explanation:
      "Monitoring helps teams detect incidents quickly and measure reliability through metrics and alerts.",
  },
  {
    id: "devops-j10",
    category: "devops",
    text: "What is a common reason to use environment variables?",
    topic: "infrastructure",
    level: "junior",
    options: [
      { id: "devops-j10a", text: "To hardcode secrets in git" },
      { id: "devops-j10b", text: "To separate config from code" },
      { id: "devops-j10c", text: "To compile faster" },
      { id: "devops-j10d", text: "To avoid deployments" },
    ],
    correctOptionId: "devops-j10b",
    explanation:
      "Environment variables allow per-environment configuration without changing source code.",
  },

  // Mid
  {
    id: "devops-m1",
    category: "devops",
    text: "What is the key benefit of immutable deployments?",
    topic: "ci-cd",
    level: "mid",
    options: [
      { id: "devops-m1a", text: "Changes are made directly on production servers" },
      { id: "devops-m1b", text: "Each release is built once and promoted unchanged" },
      { id: "devops-m1c", text: "No rollback is needed" },
      { id: "devops-m1d", text: "Databases never change" },
    ],
    correctOptionId: "devops-m1b",
    explanation:
      "Immutable deployments reduce drift by promoting the same tested artifact through environments.",
  },
  {
    id: "devops-m2",
    category: "devops",
    text: "Which Dockerfile instruction is typically used to define the startup command?",
    topic: "docker",
    level: "mid",
    options: [
      { id: "devops-m2a", text: "COPY" },
      { id: "devops-m2b", text: "EXPOSE" },
      { id: "devops-m2c", text: "CMD" },
      { id: "devops-m2d", text: "ENV" },
    ],
    correctOptionId: "devops-m2c",
    explanation:
      "CMD provides the default command for a container. ENTRYPOINT defines the executable itself.",
  },
  {
    id: "devops-m3",
    category: "devops",
    text: "What does blue/green deployment primarily reduce?",
    topic: "ci-cd",
    level: "mid",
    options: [
      { id: "devops-m3a", text: "Log volume" },
      { id: "devops-m3b", text: "Deployment downtime and rollback risk" },
      { id: "devops-m3c", text: "Number of developers" },
      { id: "devops-m3d", text: "Container image size" },
    ],
    correctOptionId: "devops-m3b",
    explanation:
      "Blue/green keeps old and new versions live, enabling traffic switching and fast rollback.",
  },
  {
    id: "devops-m4",
    category: "devops",
    text: "In Kubernetes, what is a Deployment responsible for?",
    topic: "kubernetes",
    level: "mid",
    options: [
      { id: "devops-m4a", text: "Persistent block storage" },
      { id: "devops-m4b", text: "Managing desired state for ReplicaSets and rolling updates" },
      { id: "devops-m4c", text: "Node operating system upgrades" },
      { id: "devops-m4d", text: "DNS across the internet" },
    ],
    correctOptionId: "devops-m4b",
    explanation:
      "Deployments declaratively manage replicas and rollout strategies for stateless workloads.",
  },
  {
    id: "devops-m5",
    category: "devops",
    text: "What is idempotency in infrastructure automation?",
    topic: "infrastructure",
    level: "mid",
    options: [
      { id: "devops-m5a", text: "A script always fails fast" },
      { id: "devops-m5b", text: "Running the same operation repeatedly leads to the same end state" },
      { id: "devops-m5c", text: "Only one engineer can run changes" },
      { id: "devops-m5d", text: "All resources are immutable" },
    ],
    correctOptionId: "devops-m5b",
    explanation:
      "Idempotent automation prevents drift and unintended side effects when rerun.",
  },
  {
    id: "devops-m6",
    category: "devops",
    text: "Which status code best matches 'resource created successfully'?",
    topic: "apis",
    level: "mid",
    options: [
      { id: "devops-m6a", text: "200" },
      { id: "devops-m6b", text: "201" },
      { id: "devops-m6c", text: "204" },
      { id: "devops-m6d", text: "304" },
    ],
    correctOptionId: "devops-m6b",
    explanation:
      "HTTP 201 Created indicates successful creation of a resource.",
  },
  {
    id: "devops-m7",
    category: "devops",
    text: "What is a practical reason to use readiness probes in Kubernetes?",
    topic: "kubernetes",
    level: "mid",
    options: [
      { id: "devops-m7a", text: "To build images faster" },
      { id: "devops-m7b", text: "To control when a Pod starts receiving traffic" },
      { id: "devops-m7c", text: "To encrypt secrets automatically" },
      { id: "devops-m7d", text: "To increase node CPU" },
    ],
    correctOptionId: "devops-m7b",
    explanation:
      "Readiness probes keep unready Pods out of Service endpoints until they can handle requests.",
  },
  {
    id: "devops-m8",
    category: "devops",
    text: "What does MTTR usually stand for in incident management?",
    topic: "networking-monitoring",
    level: "mid",
    options: [
      { id: "devops-m8a", text: "Mean Time To Recover" },
      { id: "devops-m8b", text: "Maximum Throughput To Route" },
      { id: "devops-m8c", text: "Managed Traffic Threshold Ratio" },
      { id: "devops-m8d", text: "Median Time To Retry" },
    ],
    correctOptionId: "devops-m8a",
    explanation:
      "MTTR is a reliability metric representing how quickly systems recover from incidents.",
  },
  {
    id: "devops-m9",
    category: "devops",
    text: "Why are multi-stage Docker builds useful?",
    topic: "docker",
    level: "mid",
    options: [
      { id: "devops-m9a", text: "They require fewer files" },
      { id: "devops-m9b", text: "They reduce final image size by separating build and runtime stages" },
      { id: "devops-m9c", text: "They remove the need for CI" },
      { id: "devops-m9d", text: "They replace orchestration" },
    ],
    correctOptionId: "devops-m9b",
    explanation:
      "Multi-stage builds keep only runtime artifacts in the final image, improving security and speed.",
  },
  {
    id: "devops-m10",
    category: "devops",
    text: "Which metric is most directly tied to API latency monitoring?",
    topic: "networking-monitoring",
    level: "mid",
    options: [
      { id: "devops-m10a", text: "CPU architecture" },
      { id: "devops-m10b", text: "P95 response time" },
      { id: "devops-m10c", text: "Branch name length" },
      { id: "devops-m10d", text: "Container count only" },
    ],
    correctOptionId: "devops-m10b",
    explanation:
      "Latency percentiles like P95 and P99 show user-facing response time beyond simple averages.",
  },

  // Senior
  {
    id: "devops-s1",
    category: "devops",
    text: "What is the biggest risk of storing secrets directly in container images?",
    topic: "docker",
    level: "senior",
    options: [
      { id: "devops-s1a", text: "Images cannot run in Kubernetes" },
      { id: "devops-s1b", text: "Secrets can leak via image registry/history and are hard to rotate" },
      { id: "devops-s1c", text: "Build time always doubles" },
      { id: "devops-s1d", text: "It disables TLS" },
    ],
    correctOptionId: "devops-s1b",
    explanation:
      "Secrets in images persist in layers and registries. Runtime secret injection is safer and easier to rotate.",
  },
  {
    id: "devops-s2",
    category: "devops",
    text: "In CI pipelines, what is the most valuable purpose of a quality gate?",
    topic: "ci-cd",
    level: "senior",
    options: [
      { id: "devops-s2a", text: "Reduce commit frequency" },
      { id: "devops-s2b", text: "Block promotion when critical checks fail" },
      { id: "devops-s2c", text: "Replace code review permanently" },
      { id: "devops-s2d", text: "Eliminate flaky tests by skipping them" },
    ],
    correctOptionId: "devops-s2b",
    explanation:
      "Quality gates enforce non-negotiable standards before deployment, reducing production risk.",
  },
  {
    id: "devops-s3",
    category: "devops",
    text: "What is a key advantage of declarative Kubernetes manifests over imperative commands?",
    topic: "kubernetes",
    level: "senior",
    options: [
      { id: "devops-s3a", text: "They are always shorter" },
      { id: "devops-s3b", text: "They define desired state and support repeatable reconciliation" },
      { id: "devops-s3c", text: "They avoid version control" },
      { id: "devops-s3d", text: "They remove the scheduler" },
    ],
    correctOptionId: "devops-s3b",
    explanation:
      "Declarative config lets controllers continuously reconcile actual state to desired state.",
  },
  {
    id: "devops-s4",
    category: "devops",
    text: "Which deployment strategy is best when you need instant rollback with parallel environments?",
    topic: "ci-cd",
    level: "senior",
    options: [
      { id: "devops-s4a", text: "Recreate" },
      { id: "devops-s4b", text: "Blue/Green" },
      { id: "devops-s4c", text: "Big bang" },
      { id: "devops-s4d", text: "Manual SSH rollout" },
    ],
    correctOptionId: "devops-s4b",
    explanation:
      "Blue/Green maintains two environments so traffic can switch quickly and safely rollback.",
  },
  {
    id: "devops-s5",
    category: "devops",
    text: "What is the primary reason to define SLOs in operations?",
    topic: "networking-monitoring",
    level: "senior",
    options: [
      { id: "devops-s5a", text: "To increase dashboard colors" },
      { id: "devops-s5b", text: "To set measurable reliability targets tied to user experience" },
      { id: "devops-s5c", text: "To avoid incident response" },
      { id: "devops-s5d", text: "To replace all business KPIs" },
    ],
    correctOptionId: "devops-s5b",
    explanation:
      "SLOs make reliability objective and help teams manage error budgets and release velocity.",
  },
  {
    id: "devops-s6",
    category: "devops",
    text: "Why is idempotent API design beneficial for retries?",
    topic: "apis",
    level: "senior",
    options: [
      { id: "devops-s6a", text: "Retries become impossible" },
      { id: "devops-s6b", text: "Repeated requests can complete safely without duplicate side effects" },
      { id: "devops-s6c", text: "It removes authentication needs" },
      { id: "devops-s6d", text: "It guarantees lower latency" },
    ],
    correctOptionId: "devops-s6b",
    explanation:
      "Idempotency is crucial for distributed systems where network retries are expected.",
  },
  {
    id: "devops-s7",
    category: "devops",
    text: "What is a common anti-pattern in Infrastructure as Code repos?",
    topic: "infrastructure",
    level: "senior",
    options: [
      { id: "devops-s7a", text: "Code review for IaC changes" },
      { id: "devops-s7b", text: "Manual drift fixes in cloud console without reconciling code" },
      { id: "devops-s7c", text: "Using modules" },
      { id: "devops-s7d", text: "Automated plan checks" },
    ],
    correctOptionId: "devops-s7b",
    explanation:
      "Out-of-band manual changes create drift, making future plans and incidents harder to reason about.",
  },
  {
    id: "devops-s8",
    category: "devops",
    text: "In Kubernetes, what is the role of a liveness probe?",
    topic: "kubernetes",
    level: "senior",
    options: [
      { id: "devops-s8a", text: "Determines if Pod should receive traffic" },
      { id: "devops-s8b", text: "Determines if container should be restarted when unhealthy" },
      { id: "devops-s8c", text: "Allocates persistent storage" },
      { id: "devops-s8d", text: "Schedules nodes" },
    ],
    correctOptionId: "devops-s8b",
    explanation:
      "Liveness probes detect stuck processes so Kubernetes can restart the container.",
  },
  {
    id: "devops-s9",
    category: "devops",
    text: "What is the strongest reason to pin base image versions in production Dockerfiles?",
    topic: "docker",
    level: "senior",
    options: [
      { id: "devops-s9a", text: "To avoid using registries" },
      { id: "devops-s9b", text: "To improve build reproducibility and control change risk" },
      { id: "devops-s9c", text: "To disable vulnerability scanning" },
      { id: "devops-s9d", text: "To force larger images" },
    ],
    correctOptionId: "devops-s9b",
    explanation:
      "Pinned versions reduce surprise breakage and make supply chain changes explicit and reviewable.",
  },
  {
    id: "devops-s10",
    category: "devops",
    text: "What does a robust post-incident review prioritize?",
    topic: "networking-monitoring",
    level: "senior",
    options: [
      { id: "devops-s10a", text: "Finding one person to blame" },
      { id: "devops-s10b", text: "Learning system improvements and preventing recurrence" },
      { id: "devops-s10c", text: "Hiding timeline details" },
      { id: "devops-s10d", text: "Skipping action items" },
    ],
    correctOptionId: "devops-s10b",
    explanation:
      "Effective postmortems are blameless and action-oriented, focused on system resilience.",
  },
];
