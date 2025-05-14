
/**
 * API client for connecting to the OEE Backend Microservice
 * This client handles data fetching from the MariaDB database
 */

// You should replace this with your actual API base URL
const API_BASE_URL = 'http://your-backend-api-url';

/**
 * Fetch data with error handling and timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Energy Metrics API client
 */
export const energyApi = {
  /**
   * Get energy metrics with optional filtering
   */
  getEnergyMetrics: async (params?: {
    machineId?: string;
    tagId?: string;
    fromTime?: string;
    toTime?: string;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.machineId) queryParams.append('machineId', params.machineId);
    if (params?.tagId) queryParams.append('tagId', params.tagId);
    if (params?.fromTime) queryParams.append('fromTime', params.fromTime);
    if (params?.toTime) queryParams.append('toTime', params.toTime);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = `${API_BASE_URL}/energy-metrics?${queryParams.toString()}`;
    
    try {
      const data = await fetchWithTimeout(url);
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching energy metrics:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Get energy incidents with optional filtering
   */
  getEnergyIncidents: async (params?: {
    machineId?: string;
    severity?: string;
    status?: string;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.machineId) queryParams.append('machineId', params.machineId);
    if (params?.severity) queryParams.append('severity', params.severity);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = `${API_BASE_URL}/energy-incidents?${queryParams.toString()}`;
    
    try {
      const data = await fetchWithTimeout(url);
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching energy incidents:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Get machine optimizations
   */
  getMachineOptimizations: async (machineId?: string) => {
    const url = machineId 
      ? `${API_BASE_URL}/machine-optimizations?machineId=${machineId}`
      : `${API_BASE_URL}/machine-optimizations`;
    
    try {
      const data = await fetchWithTimeout(url);
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching machine optimizations:', error);
      return { data: null, error };
    }
  },
  
  /**
   * In case the backend is not available, this function provides fallback mock data
   * to ensure the dashboard can still display something
   */
  getFallbackData: () => {
    return {
      energyMetrics: [],
      energyIncidents: [],
      machineOptimizations: []
    };
  }
};
