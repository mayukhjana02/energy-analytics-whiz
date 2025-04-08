
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhysicsParameters } from '@/types/riceData';
import { calculatePowerRequirement } from '@/utils/physicsCalculations';

interface RiceMillingPhysicsProps {
  params: PhysicsParameters;
  width?: number;
  height?: number;
}

const RiceMillingPhysics: React.FC<RiceMillingPhysicsProps> = ({ 
  params, 
  width = 640, 
  height = 480 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [power, setPower] = useState(0);
  
  // Calculate derived values from physics parameters
  useEffect(() => {
    const powerRequired = calculatePowerRequirement(params.motorTorque, params.rollerSpeed);
    setPower(powerRequired);
  }, [params]);
  
  // Physics animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Rice particles
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];
    const rollerWidth = width * 0.6;
    const rollerHeight = height * 0.15;
    const rollerY = height * 0.6;
    const rollerX = (width - rollerWidth) / 2;
    
    // Rice input rate depends on parameters
    const riceInputRate = params.rollerSpeed / 100;
    
    // Create initial particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.4,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2,
        size: 3 + Math.random() * 3,
        color: `rgba(255, 255, 240, ${0.7 + Math.random() * 0.3})`
      });
    }
    
    // Animation variables
    let rollerRotation = 0;
    let lastTimestamp = 0;
    
    // Animation function
    const animate = (timestamp: number) => {
      if (!ctx) return;
      
      // Calculate time delta
      const delta = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0.016;
      lastTimestamp = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw background
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, width, height);
      
      // Draw machine housing
      ctx.fillStyle = '#475569';
      ctx.fillRect(rollerX - 20, rollerY - 20, rollerWidth + 40, rollerHeight + 40);
      
      // Draw vibration effect
      const vibrationOffset = params.vibrationLevel / 500;
      const shakeX = (Math.random() - 0.5) * vibrationOffset * width;
      const shakeY = (Math.random() - 0.5) * vibrationOffset * height;
      
      // Draw rollers
      ctx.save();
      ctx.translate(shakeX, shakeY);
      
      // Update roller rotation based on RPM
      const rotationSpeed = params.rollerSpeed / 60 * 2 * Math.PI;
      rollerRotation += rotationSpeed * delta;
      
      // First roller (input)
      ctx.save();
      ctx.translate(rollerX + rollerWidth * 0.25, rollerY + rollerHeight / 2);
      ctx.rotate(rollerRotation);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-rollerHeight / 2, -rollerHeight / 2, rollerHeight, rollerHeight);
      ctx.restore();
      
      // Second roller (output)
      ctx.save();
      ctx.translate(rollerX + rollerWidth * 0.75, rollerY + rollerHeight / 2);
      ctx.rotate(-rollerRotation * 0.9); // Slightly different speed
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-rollerHeight / 2, -rollerHeight / 2, rollerHeight, rollerHeight);
      ctx.restore();
      
      // Draw temperature indicator
      const tempGradient = ctx.createLinearGradient(0, rollerY + rollerHeight + 30, 0, rollerY + rollerHeight + 50);
      tempGradient.addColorStop(0, 'rgba(255, 0, 0, 0.1)');
      tempGradient.addColorStop(1, 'rgba(255, 0, 0, 0.5)');
      
      ctx.fillStyle = tempGradient;
      const tempHeight = params.temperature - 15; // Baseline at 15°C
      ctx.fillRect(rollerX, rollerY + rollerHeight + 20, rollerWidth, tempHeight);
      
      // Draw pressure indicator
      ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
      const pressureWidth = (params.pressureLevel / 100) * rollerWidth;
      ctx.fillRect(rollerX, rollerY - 10, pressureWidth, 5);
      
      // Draw rice particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Apply gravity
        p.vy += 0.1;
        
        // Check for roller collision
        if (p.y > rollerY && p.y < rollerY + rollerHeight && 
            p.x > rollerX && p.x < rollerX + rollerWidth) {
          // Particle being processed
          p.vy = -p.vy * 0.5; // Bounce
          p.vx += (p.x < rollerX + rollerWidth / 2) ? 1 : -1; // Move along rollers
          
          // Color change based on processing
          p.color = 'rgba(255, 255, 200, 0.9)';
          p.size *= 0.95; // Particle gets smaller (processed)
        }
        
        // Bottom boundary
        if (p.y > height) {
          // Reset particle to top (continuous flow)
          p.y = 0;
          p.x = rollerX + Math.random() * rollerWidth;
          p.vy = 1 + Math.random() * 2;
          p.size = 3 + Math.random() * 3;
          p.color = `rgba(255, 255, 240, ${0.7 + Math.random() * 0.3})`;
        }
        
        // Side boundaries
        if (p.x < 0 || p.x > width) {
          p.vx = -p.vx;
        }
        
        // Draw particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size * 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Add new particles based on input rate
      if (Math.random() < riceInputRate * delta) {
        particles.push({
          x: rollerX + Math.random() * rollerWidth,
          y: 0,
          vx: (Math.random() - 0.5) * 2,
          vy: 1 + Math.random() * 2,
          size: 3 + Math.random() * 3,
          color: `rgba(255, 255, 240, ${0.7 + Math.random() * 0.3})`
        });
      }
      
      // Draw friction indicator
      ctx.fillStyle = 'rgba(255, 165, 0, 0.5)';
      const frictionWidth = 5;
      const frictionHeight = (params.frictionCoefficient * 100);
      ctx.fillRect(rollerX - 15, rollerY, frictionWidth, frictionHeight);
      
      ctx.restore();
      
      // Continue animation
      requestAnimationFrame(animate);
    };
    
    // Start animation
    const animationId = requestAnimationFrame(animate);
    
    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [params, width, height]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rice Milling Physics Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <canvas 
            ref={canvasRef} 
            className="border border-border rounded-md"
            style={{ width: '100%', height: 'auto', maxWidth: width }}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-4 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Roller Speed:</span>
              <span className="font-medium">{params.rollerSpeed.toFixed(0)} RPM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Power Required:</span>
              <span className="font-medium">{power.toFixed(2)} kW</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Friction:</span>
              <span className="font-medium">{params.frictionCoefficient.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Pressure:</span>
              <span className="font-medium">{params.pressureLevel.toFixed(1)} kPa</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Temperature:</span>
              <span className="font-medium">{params.temperature.toFixed(1)}°C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Vibration:</span>
              <span className="font-medium">{params.vibrationLevel.toFixed(1)} Hz</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiceMillingPhysics;
