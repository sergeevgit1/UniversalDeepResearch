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
'use client';

import { CheckIcon, DocumentTextIcon, ExclamationCircleIcon, StopIcon, TrashIcon } from '@heroicons/react/24/outline';
import styles from './ResearchProgressHeader.module.css';
import { ApplicationState } from '@/types/ApplicationState';

interface ResearchProgressHeaderProps {
  state: ApplicationState;
  onStop?: () => void;
  onClear?: () => void;
  onFinalize?: () => void;
  onViewError?: () => void;
}

export default function ResearchProgressHeader({ 
  state, 
  onStop, 
  onClear,
  onFinalize,
  onViewError
}: ResearchProgressHeaderProps) {
  const isActive = state.type === 'researching' || state.type === 'finalizing';
  const getStatusText = (state: ApplicationState): string => {
    switch (state.type) {
      case 'researching':
        return 'Researching...';
      case 'finalizing':
        return 'Compiling the final report...';
      case 'error':
        return 'Error encountered.';
      case 'stopped':
        return 'Stopped.';
      case 'done':
        return 'Done.';
      default:
        return '';
    }
  };

  const renderStatusControls = () => {
    if (isActive) {
      return (
        <button
          className={styles.stopButton}
          onClick={onStop}
          aria-label="Stop research"
        >
          <div className={styles.spinner} />
          <StopIcon className={styles.stopIcon} />
        </button>
      );
    }
    
    if (state.type === 'done') {
      return (
        <div className={styles.checkIconContainer}>
          <CheckIcon className={styles.checkIcon} />
        </div>
      );
    }
    
    if (state.type === 'error') {
      return (
        <div className={styles.actionButtons}>
          <button 
            className={styles.clearButton}
            onClick={onClear}
            aria-label="Clear research"
          >
            <TrashIcon className={styles.clearIcon} />
          </button>
          <button 
            className={styles.errorButton}
            onClick={onViewError}
            aria-label="View error details"
          >
            <ExclamationCircleIcon className={styles.errorIcon} />
          </button>
        </div>
      );
    }
    
    if (state.type === 'stopped') {
      return (
        <div className={styles.actionButtons}>
          <button 
            className={styles.clearButton}
            onClick={onClear}
            aria-label="Clear research"
          >
            <TrashIcon className={styles.clearIcon} />
          </button>
          <button 
            className={styles.reportButton}
            onClick={onFinalize}
            aria-label="Generate report"
          >
            <DocumentTextIcon className={styles.reportIcon} />
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={styles.header}>
      <span className={styles.statusText}>{getStatusText(state)}</span>
      <div className={styles.status}>
        {renderStatusControls()}
      </div>
    </div>
  );
} 