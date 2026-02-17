export default function calculateShipping(totalQty: number): number {

  if (totalQty <= 0) return 0;

  const limit = 100;
  const bigBoxFee = 120;

  const fullBoxes = Math.floor(totalQty / limit);

  let totalFee = fullBoxes * bigBoxFee;

  const remainingQty = totalQty % limit;
  if (remainingQty > 0) {
    if (remainingQty > 10) {
      totalFee += 120;
    } else {
      totalFee += 50;
    }
  }

  return totalFee;
}
