export const SERVICE_TYPES = ['supabase', 'appwrite', 'postgresql', 'proxy', 'docker', 'other'];

export const SERVICE_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  ERROR: 'error',
  UNKNOWN: 'unknown',
};

export const INITIAL_SERVICES = [
  {
    id: '1',
    name: 'Coolify Panel',
    type: 'docker',
    url: 'https://coolify.local',
    status: 'healthy',
    lastChecked: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Supabase API',
    type: 'supabase',
    url: 'https://supabase.local',
    status: 'healthy',
    lastChecked: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Appwrite API',
    type: 'appwrite',
    url: 'https://appwrite.local',
    status: 'warning',
    lastChecked: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'PostgreSQL',
    type: 'postgresql',
    url: 'https://postgres.local',
    status: 'unknown',
    lastChecked: null,
  },
];
