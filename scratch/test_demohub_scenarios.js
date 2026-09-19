import { SAMPLE_SCAMS } from '../src/data/sampleScams.js';
import { evaluateExplainableThreat } from '../src/services/riskEngine.js';

console.log(`Checking ${SAMPLE_SCAMS.length} scenarios...`);
let safeCount = 0;
let threatCount = 0;

SAMPLE_SCAMS.forEach((s, idx) => {
  const evalResult = evaluateExplainableThreat(s.content);
  if (s.expectedClassification === 'SAFE') safeCount++;
  else threatCount++;

  console.log(`[${idx + 1}/${SAMPLE_SCAMS.length}] ${s.category} | ${s.title}`);
  console.log(`   Expected: ${s.expectedClassification} | Live Score: ${evalResult.riskScore} (${evalResult.riskLevel})`);
});

console.log(`\nSummary: ${SAMPLE_SCAMS.length} total (${safeCount} Safe, ${threatCount} Threats)`);

