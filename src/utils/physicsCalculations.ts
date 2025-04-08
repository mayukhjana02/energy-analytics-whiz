
import { PhysicsParameters, MachineEfficiency } from '@/types/riceData';

// Physics constants
const GRAVITY = 9.81; // m/s²
const AIR_DENSITY = 1.225; // kg/m³
const RICE_DENSITY = 580; // kg/m³
const OPTIMAL_MOISTURE = 14; // %
const OPTIMAL_TEMP = 25; // °C

/**
 * Calculate the power required based on physics parameters
 * Uses torque and angular velocity (RPM)
 */
export const calculatePowerRequirement = (torque: number, rpm: number): number => {
  // Power (W) = Torque (N·m) × Angular velocity (rad/s)
  const angularVelocity = (rpm * 2 * Math.PI) / 60; // Convert RPM to rad/s
  return torque * angularVelocity;
};

/**
 * Calculate the energy efficiency based on physics parameters
 */
export const calculateEnergyEfficiency = (params: PhysicsParameters): number => {
  const { frictionCoefficient, rollerSpeed, pressureLevel, vibrationLevel, motorTorque, temperature, humidity } = params;
  
  // Higher friction = lower efficiency
  const frictionFactor = 1 - (frictionCoefficient * 0.8);
  
  // Optimal roller speed is around 800-1000 RPM for rice milling
  const speedFactor = 1 - Math.abs((rollerSpeed - 900) / 900) * 0.5;
  
  // Optimal pressure depends on rice variety, but too high or too low is inefficient
  const pressureFactor = 1 - Math.abs((pressureLevel - 50) / 50) * 0.7;
  
  // Vibration is generally negative for efficiency
  const vibrationFactor = 1 - (vibrationLevel / 100) * 0.6;
  
  // Temperature affects machine performance
  const tempFactor = 1 - Math.abs((temperature - OPTIMAL_TEMP) / 50) * 0.3;
  
  // Humidity affects both machine and rice processing
  const humidityFactor = 1 - Math.abs((humidity - 60) / 60) * 0.4;
  
  // Calculate overall efficiency (0-100%)
  const efficiency = (frictionFactor * 0.2 + 
                      speedFactor * 0.25 + 
                      pressureFactor * 0.2 + 
                      vibrationFactor * 0.15 + 
                      tempFactor * 0.1 + 
                      humidityFactor * 0.1) * 100;
  
  return Math.min(Math.max(efficiency, 0), 100);
};

/**
 * Calculate the optimal parameter values based on current conditions
 */
export const calculateOptimalParameters = (current: PhysicsParameters): PhysicsParameters => {
  const { humidity, temperature, grainMoisture } = current;
  
  // Adjust optimal roller speed based on moisture content
  const optimalRollerSpeed = grainMoisture > OPTIMAL_MOISTURE ? 
    850 - (grainMoisture - OPTIMAL_MOISTURE) * 10 : 
    850 + (OPTIMAL_MOISTURE - grainMoisture) * 5;
  
  // Adjust pressure based on humidity and temperature
  const optimalPressure = 50 + (humidity > 60 ? (humidity - 60) * 0.2 : 0) - 
                          (temperature > OPTIMAL_TEMP ? (temperature - OPTIMAL_TEMP) * 0.3 : 0);
  
  // Calculate optimal friction coefficient
  const optimalFriction = Math.max(0.1, 0.25 - (grainMoisture - OPTIMAL_MOISTURE) * 0.01);
  
  // Calculate optimal torque based on rice density and speed
  const optimalTorque = (RICE_DENSITY / 580) * (optimalRollerSpeed / 850) * 50;
  
  return {
    frictionCoefficient: optimalFriction,
    rollerSpeed: optimalRollerSpeed,
    pressureLevel: optimalPressure,
    vibrationLevel: 5, // Minimal vibration is always ideal
    motorTorque: optimalTorque,
    temperature: OPTIMAL_TEMP,
    humidity: 60, // Optimal processing humidity
    airResistance: 0.05,
    particleDensity: RICE_DENSITY,
    grainMoisture: OPTIMAL_MOISTURE
  };
};

/**
 * Generate recommendations based on current vs optimal parameters
 */
export const generateRecommendations = (current: PhysicsParameters, optimal: PhysicsParameters): string[] => {
  const recommendations: string[] = [];
  
  if (Math.abs(current.rollerSpeed - optimal.rollerSpeed) > 50) {
    recommendations.push(`Adjust roller speed from ${current.rollerSpeed.toFixed(0)} to ${optimal.rollerSpeed.toFixed(0)} RPM for optimal processing`);
  }
  
  if (Math.abs(current.frictionCoefficient - optimal.frictionCoefficient) > 0.05) {
    recommendations.push(`Reduce friction coefficient from ${current.frictionCoefficient.toFixed(2)} to ${optimal.frictionCoefficient.toFixed(2)} by maintenance or lubrication`);
  }
  
  if (current.vibrationLevel > 20) {
    recommendations.push(`High vibration detected (${current.vibrationLevel.toFixed(1)}). Check for mechanical issues or imbalance`);
  }
  
  if (Math.abs(current.pressureLevel - optimal.pressureLevel) > 10) {
    recommendations.push(`Adjust pressure level from ${current.pressureLevel.toFixed(1)} to ${optimal.pressureLevel.toFixed(1)} for better rice quality`);
  }
  
  if (Math.abs(current.temperature - optimal.temperature) > 5) {
    recommendations.push(`Regulate temperature from ${current.temperature.toFixed(1)}°C to ${optimal.temperature.toFixed(1)}°C to improve energy efficiency`);
  }
  
  if (Math.abs(current.grainMoisture - optimal.grainMoisture) > 2) {
    recommendations.push(`Rice moisture content at ${current.grainMoisture.toFixed(1)}%. Adjust drying process to reach ${optimal.grainMoisture.toFixed(1)}% for optimal milling`);
  }
  
  return recommendations;
};

/**
 * Generate mock machine efficiency data
 */
export const generateMockMachineEfficiencies = (): MachineEfficiency[] => {
  const machines: MachineEfficiency[] = [];
  
  const baseParams: PhysicsParameters[] = [
    {
      frictionCoefficient: 0.28,
      rollerSpeed: 920,
      pressureLevel: 55,
      vibrationLevel: 18,
      motorTorque: 48,
      temperature: 27,
      humidity: 65,
      airResistance: 0.06,
      particleDensity: 585,
      grainMoisture: 15.2
    },
    {
      frictionCoefficient: 0.22,
      rollerSpeed: 880,
      pressureLevel: 48,
      vibrationLevel: 12,
      motorTorque: 45,
      temperature: 26,
      humidity: 62,
      airResistance: 0.05,
      particleDensity: 580,
      grainMoisture: 14.5
    },
    {
      frictionCoefficient: 0.32,
      rollerSpeed: 950,
      pressureLevel: 60,
      vibrationLevel: 25,
      motorTorque: 52,
      temperature: 29,
      humidity: 68,
      airResistance: 0.07,
      particleDensity: 590,
      grainMoisture: 16.8
    },
    {
      frictionCoefficient: 0.24,
      rollerSpeed: 890,
      pressureLevel: 52,
      vibrationLevel: 15,
      motorTorque: 47,
      temperature: 24,
      humidity: 59,
      airResistance: 0.05,
      particleDensity: 575,
      grainMoisture: 13.9
    }
  ];
  
  const machineNames = [
    "Paddy Cleaner",
    "Husker Machine", 
    "Paddy Separator",
    "Whitener"
  ];
  
  baseParams.forEach((params, index) => {
    const optimal = calculateOptimalParameters(params);
    const efficiency = calculateEnergyEfficiency(params);
    const optimalEfficiency = calculateEnergyEfficiency(optimal);
    const recommendations = generateRecommendations(params, optimal);
    
    machines.push({
      id: `machine-${index + 1}`,
      name: machineNames[index],
      currentEfficiency: efficiency,
      optimalEfficiency: optimalEfficiency,
      physicsParams: params,
      recommendations,
      lastUpdated: new Date().toISOString()
    });
  });
  
  return machines;
};

/**
 * Simulate applying physics optimizations
 */
export const simulateOptimization = (machine: MachineEfficiency): MachineEfficiency => {
  const optimal = calculateOptimalParameters(machine.physicsParams);
  
  // Move current parameters partially toward optimal values
  const newParams: PhysicsParameters = {
    frictionCoefficient: machine.physicsParams.frictionCoefficient * 0.7 + optimal.frictionCoefficient * 0.3,
    rollerSpeed: machine.physicsParams.rollerSpeed * 0.7 + optimal.rollerSpeed * 0.3,
    pressureLevel: machine.physicsParams.pressureLevel * 0.7 + optimal.pressureLevel * 0.3,
    vibrationLevel: machine.physicsParams.vibrationLevel * 0.8, // Reduced by 20%
    motorTorque: machine.physicsParams.motorTorque * 0.7 + optimal.motorTorque * 0.3,
    temperature: machine.physicsParams.temperature * 0.8 + optimal.temperature * 0.2,
    humidity: machine.physicsParams.humidity * 0.9 + optimal.humidity * 0.1,
    airResistance: machine.physicsParams.airResistance,
    particleDensity: machine.physicsParams.particleDensity,
    grainMoisture: machine.physicsParams.grainMoisture * 0.9 + optimal.grainMoisture * 0.1
  };
  
  const newEfficiency = calculateEnergyEfficiency(newParams);
  const recommendations = generateRecommendations(newParams, optimal);
  
  return {
    ...machine,
    currentEfficiency: newEfficiency,
    physicsParams: newParams,
    recommendations,
    lastUpdated: new Date().toISOString()
  };
};
