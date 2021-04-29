import fetch from 'node-fetch';
import { Performance, uniformPerformance } from '../interfaces/performance.interface';
import { createValueSource, ValueSource } from '../interfaces/value-source.interface';

export async function getSwapValueSource(graphUrl: string, name: string, poolAddress: string): Promise<ValueSource> {
  // TODO: Move query to GraphService
  const query = `
    {
      pairDayDatas(first: 30, orderBy: date, orderDirection: desc, where:{pairAddress: "${poolAddress.toLowerCase()}"}) {
        reserveUSD
        dailyVolumeUSD
      }
    }
  `;
  const response = await fetch(graphUrl, {
    method: 'POST',
    body: JSON.stringify({ query }),
  });

  const sourceName = `${name} LP Fees`;
  const unknownValueSource = createValueSource(sourceName, uniformPerformance(0));

  if (!response.ok) {
    return unknownValueSource;
  }

  const pairDayResponse = await response.json();
  if (pairDayResponse.errors) {
    return unknownValueSource;
  }
  const pairDayData = pairDayResponse.data.pairDayDatas;

  let totalApy = 0;
  const performance: Performance = uniformPerformance(0);
  for (let i = 0; i < pairDayData.length; i++) {
    const volume = parseFloat(pairDayData[i].dailyVolumeUSD);
    const poolReserve = parseFloat(pairDayData[i].reserveUSD);
    const fees = volume * 0.003;
    totalApy += (fees / poolReserve) * 365 * 100;
    const currentApy = totalApy / (i + 1);
    if (i === 0) performance.oneDay = currentApy;
    if (i === 2) performance.threeDay = currentApy;
    if (i === 6) performance.sevenDay = currentApy;
    if (i === 29) performance.thirtyDay = currentApy;
  }

  return createValueSource(sourceName, performance);
}
