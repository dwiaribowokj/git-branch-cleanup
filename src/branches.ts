import { Command } from 'commander';
import { execFileSync } from 'node:child_process';
import { exitCodeFromFindings, Finding, printFindings, printJson } from './output.js';

interface BranchOptions {
  stale: string;
  delete: boolean;
  dryRun: boolean;
  protected: string;
  json: boolean;
}

export interface BranchInfo {
  name: string;
  current: boolean;
  unixTime: number;
  merged: boolean;
  protected: boolean;
  ageDays: number;
}

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8' });
}

export function analyzeBranches(staleDays: number, protectedBranches: string[]): BranchInfo[] {
  git(['rev-parse', '--is-inside-work-tree']);
  const protectedSet = new Set(protectedBranches);
  const merged = new Set(git(['branch', '--format=%(refname:short)', '--merged']).split(/\r?\n/).map((x) => x.trim()).filter(Boolean));
  const rows = git(['branch', '--format=%(refname:short)|%(HEAD)|%(committerdate:unix)'])
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const now = Date.now() / 1000;

  return rows.map((row) => {
    const [name, head, unix] = row.split('|');
    const unixTime = Number(unix);
    return {
      name,
      current: head === '*',
      unixTime,
      merged: merged.has(name),
      protected: protectedSet.has(name),
      ageDays: Math.floor((now - unixTime) / 86400)
    };
  }).filter((branch) => branch.ageDays >= staleDays || branch.merged || branch.protected || branch.current)
    .sort((a, b) => b.ageDays - a.ageDays);
}

function toFindings(branches: BranchInfo[], staleDays: number): Finding[] {
  const findings: Finding[] = [];
  for (const branch of branches) {
    const summary = `${branch.name} (${branch.ageDays}d old${branch.merged ? ', merged' : ', not merged'})`;
    if (branch.current) findings.push({ level: 'info', message: `${summary} - current branch` });
    else if (branch.protected) findings.push({ level: 'info', message: `${summary} - protected` });
    else if (branch.merged && branch.ageDays >= staleDays) findings.push({ level: 'ok', message: `${summary} - safe cleanup candidate` });
    else if (branch.ageDays >= staleDays) findings.push({ level: 'warn', message: `${summary} - stale but not merged` });
  }
  if (findings.length === 0) findings.push({ level: 'ok', message: 'No stale or merged local branches found' });
  return findings;
}

export function gitBranchesCommand(): Command {
  return new Command('git-branches')
    .alias('branches')
    .description('Find stale and merged local git branches with safe deletion defaults.')
    .option('--stale <days>', 'Stale threshold in days', '30')
    .option('--delete', 'Delete safe candidates only. Refuses without --dry-run in MVP.', false)
    .option('--dry-run', 'Preview deletion without changing branches', false)
    .option('--protected <names>', 'Comma-separated protected branches', 'main,master,develop,dev,staging,production')
    .option('--json', 'print machine-readable JSON output', false)
    .action((options: BranchOptions) => {
      const staleDays = Number(options.stale);
      const protectedBranches = options.protected.split(',').map((x) => x.trim()).filter(Boolean);
      const branches = analyzeBranches(staleDays, protectedBranches);
      const findings = toFindings(branches, staleDays);
      const candidates = branches.filter((b) => !b.current && !b.protected && b.merged && b.ageDays >= staleDays);
      if (options.json) {
        printJson('Git Branch Cleanup', findings, { branches, candidates: candidates.map((branch) => branch.name), staleDays, protectedBranches });
      } else {
        printFindings('Git Branch Cleanup', findings);
      }

      if (options.delete) {
        if (!options.dryRun) {
          console.error('\nRefusing actual deletion in MVP without interactive confirmation. Re-run with --delete --dry-run to preview.');
          process.exitCode = 1;
          return;
        }
        if (!options.json) {
          console.log('\nWould delete:');
          for (const candidate of candidates) console.log(`- ${candidate.name}`);
          console.log('\nNo branches deleted because --dry-run was used.');
        }
      }

      process.exitCode = exitCodeFromFindings(findings.filter((f) => f.level === 'error'));
    });
}
