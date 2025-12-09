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
import styles from './ResearchStrategyEditor.module.css';
import { ApplicationState } from '@/types/ApplicationState';

interface ResearchStrategyEditorProps {
  editedStrategyInitialContent: string;
  onAccept: (editedStrategyContent: string) => void;
  onRevert: () => void;
  state: ApplicationState;
}

export default function ResearchStrategyEditor({ 
  editedStrategyInitialContent, 
  onAccept, 
  onRevert,
  state 
}: ResearchStrategyEditorProps) {
  const [editedStrategyContent, setEditedStrategyContent] = useState(editedStrategyInitialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDisabled = state.type !== 'idle' && state.type !== 'stopped' && state.type !== 'error' && state.type !== 'done';

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleAccept();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedStrategyContent(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleAccept = () => {
    if (editedStrategyContent.trim() && !isDisabled) {
      onAccept(editedStrategyContent);
    }
  };

  return (
    <div className={styles.strategyContainer}>
      <div className={styles.strategyBody}>
        <textarea
          ref={textareaRef}
          value={editedStrategyContent}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Edit research strategy..."
          className={`${styles.strategyTextarea} ${isDisabled ? styles.disabled : ''}`}
          disabled={isDisabled}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        />
        <div className={styles.strategyButtons}>
          <button
            onClick={onRevert}
            className={`${styles.strategyButton}`}
            disabled={isDisabled}
            aria-label="Revert changes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <button
            onClick={handleAccept}
            className={`${styles.strategyButton}`}
            disabled={isDisabled || !editedStrategyContent.trim()}
            aria-label="Accept changes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 