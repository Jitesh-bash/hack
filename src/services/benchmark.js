/**
 * PhishGuard AI - Real Benchmark Engine Utility
 * Evaluates the 300-message benchmark dataset against the explainable risk engine.
 * Computes Precision, Recall, F1 Score, Accuracy, and per-category breakdown without cheating.
 */

import { BENCHMARK_DATASET } from '../data/benchmarkDataset.js';
import { evaluateExplainableThreat } from './riskEngine.js';

export const runFullBenchmark = () => {
  let totalTests = BENCHMARK_DATASET.length;
  let correctPredictions = 0;
  let incorrectPredictions = 0;

  let truePositives = 0;  // Correctly flagged scam (Subtle or Obvious)
  let trueNegatives = 0;  // Correctly identified safe legitimate message
  let falsePositives = 0; // Legitimate message incorrectly flagged as threat
  let falseNegatives = 0; // Scam message incorrectly passed as safe

  const falsePositiveCases = [];
  const falseNegativeCases = [];

  const categoryStats = {};

  for (const item of BENCHMARK_DATASET) {
    if (!categoryStats[item.category]) {
      categoryStats[item.category] = {
        total: 0,
        tp: 0,
        tn: 0,
        fp: 0,
        fn: 0
      };
    }
    const cat = categoryStats[item.category];
    cat.total++;

    const result = evaluateExplainableThreat(item.message);
    const isExpectedSafe = item.expectedRisk === 'SAFE';
    const isActualSafe = result.riskScore < 20;

    if (isExpectedSafe && isActualSafe) {
      trueNegatives++;
      cat.tn++;
      correctPredictions++;
    } else if (!isExpectedSafe && !isActualSafe) {
      truePositives++;
      cat.tp++;
      correctPredictions++;
    } else if (isExpectedSafe && !isActualSafe) {
      falsePositives++;
      cat.fp++;
      incorrectPredictions++;
      falsePositiveCases.push({
        id: item.id,
        category: item.category,
        message: item.message,
        expected: item.expectedRisk,
        actualScore: result.riskScore,
        actualLevel: result.riskLevel
      });
    } else if (!isExpectedSafe && isActualSafe) {
      falseNegatives++;
      cat.fn++;
      incorrectPredictions++;
      falseNegativeCases.push({
        id: item.id,
        category: item.category,
        message: item.message,
        expected: item.expectedRisk,
        actualScore: result.riskScore,
        actualLevel: result.riskLevel
      });
    }
  }

  const precision = truePositives + falsePositives > 0 ? (truePositives / (truePositives + falsePositives)) * 100 : 100;
  const recall = truePositives + falseNegatives > 0 ? (truePositives / (truePositives + falseNegatives)) * 100 : 100;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 100;
  const accuracy = (correctPredictions / totalTests) * 100;

  // Compute category accuracy & precision
  const categoryResults = Object.entries(categoryStats).map(([catName, stats]) => {
    const catPrecision = stats.tp + stats.fp > 0 ? (stats.tp / (stats.tp + stats.fp)) * 100 : 100;
    const catRecall = stats.tp + stats.fn > 0 ? (stats.tp / (stats.tp + stats.fn)) * 100 : 100;
    const catAccuracy = ((stats.tp + stats.tn) / stats.total) * 100;

    return {
      category: catName,
      total: stats.total,
      precision: catPrecision.toFixed(1),
      recall: catRecall.toFixed(1),
      accuracy: catAccuracy.toFixed(1),
      fp: stats.fp,
      fn: stats.fn
    };
  });

  return {
    totalTests,
    correctPredictions,
    incorrectPredictions,
    truePositives,
    trueNegatives,
    falsePositives,
    falseNegatives,
    precision: precision.toFixed(1),
    recall: recall.toFixed(1),
    f1Score: f1Score.toFixed(1),
    accuracy: accuracy.toFixed(1),
    categoryResults,
    falsePositiveCases,
    falseNegativeCases
  };
};

