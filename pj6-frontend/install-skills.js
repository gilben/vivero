#!/usr/bin/env node
// Install all UX/UI skills — works on Windows, Mac and Linux
// Usage: node install-skills.js
import { execSync } from 'child_process';
import { existsSync } from 'fs';

const skills = [
  { cmd: 'npx skills add emilkowalski/skill',           label: 'emilkowalski',          verify: '.agents/skills/emil-design-eng/SKILL.md' },
  { cmd: 'npx impeccable skills install --yes',         label: 'impeccable',            verify: '.agents/skills/impeccable/SKILL.md' },
  { cmd: 'npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"', label: 'design-taste-frontend', verify: '.agents/skills/design-taste-frontend/SKILL.md' },
];

const results = [];
for (const skill of skills) {
  console.log('Installing:', skill.label, '...');
  try {
    execSync(skill.cmd, { stdio: 'inherit' });
  } catch {
    console.error('  command failed for', skill.label);
    if (skill.label === 'impeccable' && process.platform === 'win32') {
      console.error("  Windows: if the error mentions 'unzip', put an unzip.cmd shim on PATH");
      console.error('  that runs:  tar -xf %2 -C %4   (create %4 first), then retry.');
    }
  }
  // Verification rule: a skill counts as installed ONLY if its SKILL.md is on disk
  const ok = existsSync(skill.verify);
  results.push({ ...skill, ok });
  console.log(ok
    ? '\u2713 ' + skill.label + ' (' + skill.verify + ')'
    : '\u2717 ' + skill.label + ' — SKILL.md not found, run manually: ' + skill.cmd);
}

const missing = results.filter(r => !r.ok);
console.log('\n' + (results.length - missing.length) + '/' + results.length + ' skills verified on disk. See SKILLS.md.');
for (const m of missing) console.log('  missing: ' + m.label + ' -> ' + m.cmd);
