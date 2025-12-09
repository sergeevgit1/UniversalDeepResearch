/*
 * SPDX-FileCopyrightText: Copyright (c) 2025 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface AppConfig {
  // Backend API Configuration
  backend: {
    baseUrl: string;
    port: number;
    apiVersion: 'v1' | 'v2';
  };
  
  // Runtime Configuration
  runtime: {
    dryRun: boolean;
    enableV2Api: boolean;
  };
  
  // Frontend Configuration
  frontend: {
    port: number;
    host: string;
    url: string;
  };
}

// Helper function to validate environment variables
const validateEnvVar = (value: string | undefined, defaultValue: string): string => {
  if (!value) {
    console.warn(`Environment variable not set, using default value: ${defaultValue}`);
    return defaultValue;
  }
  return value;
};

// Helper to determine the backend base URL when an explicit env variable isn't provided.
const resolveBackendBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (envUrl && envUrl.trim()) {
    return envUrl.trim();
  }

  // When running in the browser, fall back to the current origin so deployed
  // frontends talk to their colocated backend without extra configuration.
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  // Use the platform-provided host when available (e.g., Vercel).
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Development fallback.
  return 'http://localhost:8000';
};

// Helper function to parse boolean environment variables
const parseBoolEnv = (value: string | undefined, defaultValue: boolean): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Default configuration
const defaultConfig: AppConfig = {
  backend: {
    baseUrl: resolveBackendBaseUrl(),
    port: 0, // Port is now included in baseUrl
    apiVersion: (validateEnvVar(process.env.NEXT_PUBLIC_API_VERSION, 'v2') as 'v1' | 'v2'),
  },
  runtime: {
    dryRun: parseBoolEnv(process.env.NEXT_PUBLIC_DRY_RUN, false),
    enableV2Api: parseBoolEnv(process.env.NEXT_PUBLIC_ENABLE_V2_API, true),
  },
  frontend: {
    port: parseInt(validateEnvVar(process.env.NEXT_PUBLIC_FRONTEND_PORT, '3000')),
    host: validateEnvVar(process.env.NEXT_PUBLIC_FRONTEND_HOST, 'localhost'),
    url: validateEnvVar(process.env.NEXT_PUBLIC_FRONTEND_URL, 'http://localhost:3000'),
  },
};

// Helper function to get the full backend URL
export const getBackendUrl = (config: AppConfig = defaultConfig): string => {
  // Ensure no trailing slash for correct API endpoint construction
  return config.backend.baseUrl.replace(/\/$/, '');
};

// Helper function to get the API endpoint
export const getApiEndpoint = (config: AppConfig = defaultConfig): string => {
  const baseUrl = getBackendUrl(config);
  const endpoint = config.runtime.enableV2Api ? '/api/research2' : '/api/research';
  return `${baseUrl}${endpoint}`;
};

// Helper function to get the frontend URL
export const getFrontendUrl = (config: AppConfig = defaultConfig): string => {
  // Ensure no trailing slash for correct URL construction
  return config.frontend.url.replace(/\/$/, '');
};

// Helper function to check if running in development
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// Helper function to check if running in production
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export default defaultConfig;