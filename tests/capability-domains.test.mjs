import test from 'node:test';
import assert from 'node:assert/strict';
import { capabilities, processCapabilityRequirements, machineCapabilityProvisions } from '../lib/capabilities.ts';
import { manufacturingRequirements } from '../lib/manufacturing-requirements.ts';
import catalog from '../lib/generated/drive-catalog.json' with { type: 'json' };

test('outcomes remain separate from functional capability identifiers', () => {
  assert.equal(manufacturingRequirements.length, 6);
  const ids = new Set(capabilities.map(c => c.id));
  assert.equal(ids.size, capabilities.length);
  for (const requirement of manufacturingRequirements) assert.ok(!capabilities.some(c => c.name === requirement.name));
  assert.ok(manufacturingRequirements.some(r => r.name === 'Surface Requirements'));
});

test('normalized process requirements reference existing functions and source profiles', () => {
  const ids = new Set(capabilities.map(c => c.id));
  const slugs = new Set(catalog.map(p => p.slug));
  const pairs = new Set();
  for (const r of processCapabilityRequirements) {
    assert.ok(ids.has(r.capabilityId));
    assert.ok(slugs.has(r.processSlug));
    assert.ok(r.evidence.length > 0);
    const pair = `${r.processSlug}:${r.capabilityId}`;
    assert.ok(!pairs.has(pair));
    pairs.add(pair);
  }
  // Importing a process requirement must never manufacture evidence of machine support.
  assert.equal(machineCapabilityProvisions.length, 0);
});

test('machine types and manufacturer models have separate identities', async () => {
  const { machineTypes, machineModels, modelsForType } = await import('../lib/machines.ts');
  const typeIds = new Set(machineTypes.map(t => t.id));
  assert.equal(typeIds.size, 5);
  assert.equal(machineModels.length, 0);
  for (const type of machineTypes) {
    assert.ok(!('specifications' in type));
    assert.deepEqual(modelsForType(type.id), []);
  }
  for (const provision of machineCapabilityProvisions) {
    assert.ok(machineModels.some(m => m.id === provision.machineModelId));
    assert.ok(!typeIds.has(provision.machineModelId));
  }
});

test('profile restructuring retains drilling tables, parameters and workflow', async () => {
 const { readFileSync } = await import('node:fs');
 const { profileSections, overviewParts } = await import('../lib/profile-sections.ts');
 const raw = readFileSync(new URL('./fixtures/drilling.md', import.meta.url), 'utf8');
 const sections = profileSections(raw);
 assert.equal(sections.length, 6);
 const overview = overviewParts(sections.find(s => /Overview/.test(s.title)).body);
 assert.ok(overview.description.includes('**Definition:**'));
 assert.ok(overview.classification.includes('**Material Action:**'));
 assert.ok(sections.find(s => /Parameters/.test(s.title)).body.includes('\\frac'));
 assert.ok(sections.find(s => /Process Steps/.test(s.title)).body.includes('8. **Waste Management'));
 assert.ok(sections.find(s => /Required Capabilities/.test(s.title)).body.includes('Metrology & Inspection'));
 assert.ok(sections.find(s => /Inputs/.test(s.title)).body.includes('**Outputs**'));
});
