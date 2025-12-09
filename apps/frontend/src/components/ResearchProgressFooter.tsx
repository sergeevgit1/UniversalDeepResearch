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

import { ChatBubbleLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import styles from './ResearchProgressFooter.module.css';
import { ApplicationState } from '@/types/ApplicationState';

interface ResearchProgressFooterProps {
  state: ApplicationState;
}

const formatElapsedTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (seconds < 3600) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
};

export default function ResearchProgressFooter({ 
  state
}: ResearchProgressFooterProps) {
  const isActive = state.type === 'researching' || state.type === 'finalizing';
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (!isActive) {
      // If we have an end timestamp, use it to calculate final elapsed time
      let time = 0;
      if (state.researchEndTimestamp > 0) {
        time += Math.floor((state.researchEndTimestamp - state.researchStartTimestamp) / 1000);
        if (state.finalizationEndTimestamp > 0) {
          time += Math.floor((state.finalizationEndTimestamp - state.finalizationStartTimestamp) / 1000);
        }
      }
      setElapsedTime(time);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      let startTime = 0;
      let endTime = now;
      let timePrefix = 0;
      if (state.researchStartTimestamp > 0) {
        startTime = state.researchStartTimestamp;
      }
      if (state.finalizationStartTimestamp > 0) {
        startTime = state.finalizationStartTimestamp;
        timePrefix = state.researchEndTimestamp - state.researchStartTimestamp;
        if (state.finalizationEndTimestamp > 0) {
          endTime = state.finalizationEndTimestamp;
        }
      }
      const newTime = Math.floor((timePrefix + endTime - startTime) / 1000);
      setElapsedTime(newTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, state.researchStartTimestamp, state.researchEndTimestamp, state.finalizationStartTimestamp, state.finalizationEndTimestamp]);

  return (
    <div className={styles.footer}>
      <div className={styles.stats}>
        <span className={styles.time}>{formatElapsedTime(elapsedTime)}</span>
        <div className={styles.searchCount}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <span>{state.searchCount}</span>
        </div>
        <div className={styles.queryCount}>
          <ChatBubbleLeftIcon className={styles.queryIcon} />
          <span>{state.queryCount}</span>
        </div>
      </div>
    </div>
  );
} 