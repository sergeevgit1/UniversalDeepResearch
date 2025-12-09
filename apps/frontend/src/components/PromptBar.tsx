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

import { useState, useRef, KeyboardEvent } from 'react';
import styles from './PromptBar.module.css';
import PromptBarButton from './PromptBarButton';
import ResearchTypeSelector from './ResearchTypeSelector';
import { ApplicationState } from '@/types/ApplicationState';

interface PromptBarProps {
  onResearch: (query: string, strategyId: string) => void;
  onEditStrategy: (strategyId: string) => void;
  state: ApplicationState;
  isAStrategyBeingEdited: boolean;
}

export default function PromptBar({ onResearch, onEditStrategy, state, isAStrategyBeingEdited: disableStrategySelector }: PromptBarProps) {
  const [query, setQuery] = useState('');
  const [researchStrategyId, setResearchStrategyId] = useState<string>('default');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDisabled = state.type !== 'idle' && state.type !== 'stopped' && state.type !== 'error' && state.type !== 'done' || disableStrategySelector;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleResearch();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleResearch = () => {
    if (query.trim() && !isDisabled) {
      onResearch(query, researchStrategyId);
    }
  };

  return (
    <div className={styles.promptContainer}>
      <div className={styles.promptBody}>
        <textarea
          ref={textareaRef}
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Enter your research query..."
          className={`${styles.promptTextarea} ${isDisabled ? styles.disabled : ''}`}
          disabled={isDisabled}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        />
        <PromptBarButton onClick={handleResearch} disabled={isDisabled || !query.trim()} />
      </div>
      <div className={styles.promptBarFooter}>
        <ResearchTypeSelector 
          onChange={setResearchStrategyId}
          defaultStrategyId={researchStrategyId}
          onEditStrategy={onEditStrategy}
          disabled={disableStrategySelector}
        />
        <div className={`${styles.shortcutHint} ${query.length > 0 ? styles.visible : ''}`}>
          <span>Shift + Enter</span>
        </div>
      </div>
    </div>
  );
} 