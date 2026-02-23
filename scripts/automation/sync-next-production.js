#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const roadmapPath = path.join(root, 'docs/ROADMAP_PRODUCTION_PHASED.md');
const outPath = path.join(root, 'tasks/NEXT_PRODUCTION.md');
const evidenceLatestPath = path.join(root, '.codex/local-evidence/latest.json');
const evidenceRootPath = path.join(root, '.codex/local-evidence');
const routesPath = path.join(root, 'apps/api/src/routes.ts');
const serverPath = path.join(root, 'apps/api/src/server.ts');
const smokeIdpayPath = path.join(root, 'scripts/automation/smoke-idpay-callback.sh');
const dbBackupPath = path.join(root, 'scripts/automation/db-backup.sh');
const dbRestorePath = path.join(root, 'scripts/automation/db-restore.sh');
const packageJsonPath = path.join(root, 'package.json');
const productionEvidenceRootPath = path.join(root, '.codex/production-evidence');
const releaseRcGatesPath = path.join(root, 'scripts/release/run-rc-gates.mjs');
const releaseRollbackValidatePath = path.join(root, 'scripts/release/validate-rollback-drill.mjs');
const releaseChecklistPath = path.join(root, 'docs/release-candidate-checklist.json');
const rollbackChecklistPath = path.join(root, 'docs/rollback-drill-checklist.json');
const releaseRcLatestReportPath = path.join(root, 'docs/release/reports/rc-gates-latest.json');
const releaseGoNoGoLatestPath = path.join(root, 'docs/release/reports/go-no-go-latest.md');

if (!fs.existsSync(roadmapPath)) {
  console.error(`ERROR: missing ${roadmapPath}`);
  process.exit(1);
}

const roadmap = fs.readFileSync(roadmapPath, 'utf8');
const phaseMatches = [...roadmap.matchAll(/^##\s+Production Phase\s+([A-Z])\s+-\s+(.+)$/gm)];
if (phaseMatches.length === 0) {
  console.error('ERROR: no production phases found');
  process.exit(1);
}

function readJsonIfExists(p) {
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

const evidenceLatest = readJsonIfExists(evidenceLatestPath);
function findMostRecentAllEvidence() {
  if (!fs.existsSync(evidenceRootPath)) return null;
  const dirs = fs
    .readdirSync(evidenceRootPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
    .reverse();
  for (const d of dirs) {
    const payload = readJsonIfExists(path.join(evidenceRootPath, d, 'result.json'));
    if (payload && payload.mode === 'all' && payload.overallOk === true && Array.isArray(payload.items)) return payload;
  }
  return null;
}
const evidenceAll = evidenceLatest && evidenceLatest.mode === 'all' ? evidenceLatest : findMostRecentAllEvidence();
const routes = fs.existsSync(routesPath) ? fs.readFileSync(routesPath, 'utf8') : '';
const server = fs.existsSync(serverPath) ? fs.readFileSync(serverPath, 'utf8') : '';
const smokeIdpay = fs.existsSync(smokeIdpayPath) ? fs.readFileSync(smokeIdpayPath, 'utf8') : '';
const packageJson = fs.existsSync(packageJsonPath) ? fs.readFileSync(packageJsonPath, 'utf8') : '';

function hasProductionEvidenceTag(tag) {
  if (!fs.existsSync(productionEvidenceRootPath)) return false;
  const entries = fs.readdirSync(productionEvidenceRootPath, { withFileTypes: true });
  return entries.some((e) => e.isDirectory() && e.name.endsWith(`-${tag}`) && fs.existsSync(path.join(productionEvidenceRootPath, e.name, 'summary.md')));
}

function hasOk(payload, pattern) {
  if (!payload || !Array.isArray(payload.items)) return false;
  return payload.items.some((x) => x.ok === true && typeof x.cmd === 'string' && x.cmd.includes(pattern));
}

const gates = {
  docs: hasOk(evidenceLatest, 'pnpm -w docs:validate') || hasOk(evidenceAll, 'pnpm -w docs:validate'),
  lint: hasOk(evidenceLatest, 'pnpm -w lint') || hasOk(evidenceAll, 'pnpm -w lint'),
  typecheck: hasOk(evidenceLatest, 'pnpm -w typecheck') || hasOk(evidenceAll, 'pnpm -w typecheck'),
  localFirst: hasOk(evidenceLatest, 'pnpm -w local-first:scan') || hasOk(evidenceAll, 'pnpm -w local-first:scan'),
  test: hasOk(evidenceLatest, 'pnpm -w test') || hasOk(evidenceAll, 'pnpm -w test'),
  build: hasOk(evidenceLatest, 'pnpm -w build') || hasOk(evidenceAll, 'pnpm -w build'),
  contracts: hasOk(evidenceLatest, 'pnpm -w contracts:check') || hasOk(evidenceAll, 'pnpm -w contracts:check'),
  perf: hasOk(evidenceLatest, 'pnpm -w perf:check') || hasOk(evidenceAll, 'pnpm -w perf:check'),
  smokeAll: hasOk(evidenceLatest, 'pnpm -w smoke:all') || hasOk(evidenceAll, 'pnpm -w smoke:all'),
  evidenceAll:
    (evidenceLatest && evidenceLatest.mode === 'all' && evidenceLatest.overallOk === true) ||
    (evidenceAll && evidenceAll.mode === 'all' && evidenceAll.overallOk === true) ||
    hasOk(evidenceLatest, 'pnpm -w evidence:record') ||
    hasOk(evidenceAll, 'pnpm -w evidence:record'),
};

const phaseEvidence = {
  a: hasProductionEvidenceTag('phase-a'),
  b: hasProductionEvidenceTag('phase-b'),
  c: hasProductionEvidenceTag('phase-c'),
  d: hasProductionEvidenceTag('phase-d'),
  e: hasProductionEvidenceTag('phase-e'),
  f: hasProductionEvidenceTag('phase-f'),
  g: hasProductionEvidenceTag('phase-g'),
};

const checks = {
  aProviderLocalFlow: smokeIdpay.includes('idpay'),
  bBackupRestoreScripts: fs.existsSync(dbBackupPath) && fs.existsSync(dbRestorePath) && phaseEvidence.b,
  cCorsCsrf:
    phaseEvidence.c &&
    server.includes('allowOrigins') &&
    server.includes('csrfEnabled') &&
    server.includes('registerApiBasics'),
  cSessionVisibility:
    phaseEvidence.c &&
    routes.includes('/api/v1/auth/sessions') &&
    routes.includes('/api/v1/auth/sessions/:sessionId'),
  dOpsBaseline: phaseEvidence.d,
  eRollbackAndRc:
    phaseEvidence.e &&
    fs.existsSync(releaseRcGatesPath) &&
    fs.existsSync(releaseRollbackValidatePath) &&
    fs.existsSync(releaseChecklistPath) &&
    fs.existsSync(rollbackChecklistPath) &&
    fs.existsSync(releaseRcLatestReportPath) &&
    fs.existsSync(releaseGoNoGoLatestPath) &&
    packageJson.includes('release:rc:gates') &&
    packageJson.includes('release:rollback:validate') &&
    packageJson.includes('release:go-no-go:evidence'),
  fPerfBaseline: phaseEvidence.f && gates.perf,
  gRecurringEvidence: phaseEvidence.g,
};

function mark(done) {
  return done ? 'x' : ' ';
}

const lines = [];
lines.push('# Next Production Tasks (No Timeline)');
lines.push('');
lines.push(`> Updated: ${new Date().toISOString().slice(0, 10)}`);
lines.push('> Rule: production phases close only with evidence-backed exits in real/prod-like environments.');
lines.push('');
lines.push('## Weekly Reality Checklist (Not Actually Closed Yet)');
lines.push('- [ ] Phase A: اجرای E2E واقعی با provider بیرونی (نه callback شبیه‌سازی‌شده محلی)');
lines.push('- [ ] Phase A: تایید owner برای go-live provider + incident runbook امضاشده');
lines.push('- [ ] Phase B: پیاده‌سازی backup incremental + retention policy قابل اجرا');
lines.push('- [ ] Phase B: DR drill روی staging/prod-sim مستقل + سند RPO/RTO تاییدشده');
lines.push(`- [${mark(checks.cCorsCsrf)}] Phase C: enforce baseline CORS/CSRF policy در API (local/prod-sim)`);
lines.push('- [ ] Phase C: dependency vulnerability workflow چرخه‌ای (scan/triage/fix/evidence)');
lines.push(`- [${mark(checks.cSessionVisibility)}] Phase C: device visibility برای sessionها`);
lines.push('- [ ] Phase D: metrics + alerts واقعی برای API/DB/Payments');
lines.push('- [ ] Phase D: تعریف و پایش SLO/SLI + error budget review');
lines.push('- [ ] Phase E: strategy deployment (rolling/blue-green) + dry-run مستند');
lines.push('- [ ] Phase E: artifact provenance + reproducible build evidence');
lines.push('- [ ] Phase F: profiling مسیرهای داغ + برنامه cache/index با before/after metrics');
lines.push('- [ ] Phase F: cost guardrails برای runtime/infra');
lines.push('- [ ] Phase G: least-privilege governance با automation قابل audit');
lines.push(`- [${mark(checks.gRecurringEvidence)}] Phase G: چرخه دوره‌ای production-readiness review با evidence تکرارشونده`);
lines.push('');
lines.push('## Production Phase Board');
for (const m of phaseMatches) {
  const id = m[1];
  const title = m[2].trim();
  lines.push(`### Production Phase ${id} - ${title}`);
  if (id === 'A') {
    lines.push('- [ ] Run real provider E2E in controlled prod-like environment');
    lines.push(`- [${mark(checks.aProviderLocalFlow && phaseEvidence.a)}] Verify callback/reconcile idempotency in local/prod-sim evidence`);
    lines.push('- [ ] Finalize and sign off payment incident runbook');
  } else if (id === 'B') {
    lines.push('- [ ] Add incremental backup workflow');
    lines.push('- [ ] Define retention/data integrity checks');
    lines.push(`- [${mark(checks.bBackupRestoreScripts)}] Execute and record DR drill (local/prod-sim evidence)`);
    lines.push('- [ ] Publish approved RPO/RTO targets');
  } else if (id === 'C') {
    lines.push(`- [${mark(checks.cCorsCsrf)}] Enforce baseline CORS/CSRF policy and verification checks`);
    lines.push('- [ ] Implement dependency vulnerability pipeline and triage process');
    lines.push(`- [${mark(checks.cSessionVisibility)}] Add device/session visibility controls`);
  } else if (id === 'D') {
    lines.push(`- [${mark(checks.dOpsBaseline)}] Implement ops baseline (health/contracts/perf/RBAC evidence)`);
    lines.push('- [ ] Define and test critical alert rules');
    lines.push('- [ ] Define SLO/SLI and error-budget review cadence');
  } else if (id === 'E') {
    lines.push('- [ ] Implement and test rolling/blue-green deployment plan');
    lines.push(`- [${mark(checks.eRollbackAndRc)}] Validate rollback procedure with post-rollback smoke + RC gates`);
    lines.push('- [ ] Add artifact provenance + reproducible build checks');
  } else if (id === 'F') {
    lines.push(`- [${mark(checks.fPerfBaseline)}] Performance baseline checks (perf + regression evidence)`);
    lines.push('- [ ] Define caching/index strategy with benchmark evidence');
    lines.push('- [ ] Add runtime/infra cost guardrails and report');
  } else if (id === 'G') {
    lines.push('- [ ] Enforce least-privilege access governance workflow');
    lines.push('- [ ] Validate audit trail completeness on periodic cycle');
    lines.push(`- [${mark(checks.gRecurringEvidence)}] Execute recurring production-readiness review with archived evidence`);
  } else {
    lines.push(`- [ ] Implement scope items for Phase ${id}`);
    lines.push(`- [ ] Validate exit criteria for Phase ${id}`);
  }
  lines.push('');
}

lines.push('## Global Production Gates');
lines.push(`- [${gates.docs ? 'x' : ' '}] \`pnpm -w docs:validate\``);
lines.push(`- [${gates.lint ? 'x' : ' '}] \`pnpm -w lint\``);
lines.push(`- [${gates.typecheck ? 'x' : ' '}] \`pnpm -w typecheck\``);
lines.push(`- [${gates.localFirst ? 'x' : ' '}] \`pnpm -w local-first:scan\``);
lines.push(`- [${gates.test ? 'x' : ' '}] \`pnpm -w test\``);
lines.push(`- [${gates.build ? 'x' : ' '}] \`pnpm -w build\``);
lines.push(`- [${gates.contracts ? 'x' : ' '}] \`pnpm -w contracts:check\``);
lines.push(`- [${gates.perf ? 'x' : ' '}] \`pnpm -w perf:check\``);
lines.push(`- [${gates.smokeAll ? 'x' : ' '}] \`pnpm -w smoke:all\``);
lines.push(`- [${gates.evidenceAll ? 'x' : ' '}] \`pnpm -w evidence:record\``);
lines.push('');

lines.push('## Automation Commands');
lines.push('- `pnpm -w roadmap:sync-next:production`');
lines.push('- `pnpm -w production:phase-a`');
lines.push('- `pnpm -w production:phase-b`');
lines.push('- `pnpm -w production:phase-c`');
lines.push('- `pnpm -w production:phase-d`');
lines.push('- `pnpm -w production:phase-e`');
lines.push('- `pnpm -w production:phase-f`');
lines.push('- `pnpm -w production:phase-g`');
lines.push('');

fs.writeFileSync(outPath, lines.join('\n') + '\n');
console.log(`SYNC_NEXT_PRODUCTION_OK phases=${phaseMatches.length} output=${path.relative(root, outPath)}`);
