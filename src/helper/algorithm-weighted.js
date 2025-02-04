export function weightedRandomNum(numbers, weights) {
  // Convert weights object to array matching numbers array
  const validNumbers = numbers.filter(num => weights[num] !== 0);
  const weightArray = validNumbers.map(num => weights[num] || 1);

  // Calculate sum of weights
  const weightSum = weightArray.reduce((sum, weight) => sum + weight, 0);
  // Generate random value between 0 and sum of weights
  let random = Math.random() * weightSum;

  // Find the number that corresponds to the random value
  for (let i = 0; i < validNumbers.length; i++) {
    random -= weightArray[i];
    if (random <= 0) {
      return validNumbers[i];
    }
  }

  // Fallback to last number (shouldn't happen unless weights sum to 0)
  return validNumbers[validNumbers.length - 1];
}

export function weightedLotteryHandler(total, won = [], num, weights = {}) {
  const arr = [];
  for (let i = 1; i <= total; i++) {
    if (!won.includes(i)) {
      arr.push(i);
    }
  }

  const result = [];
  const availableNumbers = [...arr];

  for (let i = 0; i < num && availableNumbers.length > 0; i++) {
    const selected = weightedRandomNum(availableNumbers, weights);
    result.push(selected);
    const index = availableNumbers.indexOf(selected);
    availableNumbers.splice(index, 1);
  }

  return result;
}
