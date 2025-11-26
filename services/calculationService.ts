import { CalculatorState, EmissionResult } from '../types';
import { EMISSION_FACTORS } from '../constants';

export const calculateCarbonFootprint = (data: CalculatorState): EmissionResult => {
  // Scope 1
  const s1 = data.scope1;
  const gasEmission = s1.naturalGas * EMISSION_FACTORS.scope1.naturalGas;
  const heatingOilEmission = s1.heatingOil * EMISSION_FACTORS.scope1.heatingOil;
  const coalEmission = s1.coal * EMISSION_FACTORS.scope1.coal;
  const dieselEmission = s1.diesel * EMISSION_FACTORS.scope1.diesel;
  const petrolEmission = s1.petrol * EMISSION_FACTORS.scope1.petrol;
  const refrigEmission = s1.refrigerants * EMISSION_FACTORS.scope1.refrigerants;

  const scope1Total = gasEmission + heatingOilEmission + coalEmission + dieselEmission + petrolEmission + refrigEmission;

  // Scope 2
  const s2 = data.scope2;
  const electricityEmission = s2.electricity * EMISSION_FACTORS.scope2.electricity;
  const heatingEmission = s2.districtHeating * EMISSION_FACTORS.scope2.districtHeating;

  const scope2Total = electricityEmission + heatingEmission;

  // Scope 3
  const s3 = data.scope3;
  const waterEmission = s3.water * EMISSION_FACTORS.scope3.water;
  const wasteEmission = s3.waste * EMISSION_FACTORS.scope3.waste;
  const airShortEmission = s3.airTravelShort * EMISSION_FACTORS.scope3.airTravelShort;
  const airLongEmission = s3.airTravelLong * EMISSION_FACTORS.scope3.airTravelLong;
  const railEmission = s3.railTravel * EMISSION_FACTORS.scope3.railTravel;

  const scope3Total = waterEmission + wasteEmission + airShortEmission + airLongEmission + railEmission;

  return {
    scope1: parseFloat(scope1Total.toFixed(2)),
    scope2: parseFloat(scope2Total.toFixed(2)),
    scope3: parseFloat(scope3Total.toFixed(2)),
    total: parseFloat((scope1Total + scope2Total + scope3Total).toFixed(2)),
    breakdown: {
      naturalGas: gasEmission,
      heatingOil: heatingOilEmission,
      coal: coalEmission,
      fleet: dieselEmission + petrolEmission,
      refrigerants: refrigEmission,
      electricity: electricityEmission,
      districtHeating: heatingEmission,
      water: waterEmission,
      waste: wasteEmission,
      travel: airShortEmission + airLongEmission + railEmission,
    }
  };
};
