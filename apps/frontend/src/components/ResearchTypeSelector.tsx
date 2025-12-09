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

import { useState } from 'react';
import { 
  ArrowsPointingOutIcon, 
  ArrowsPointingInIcon, 
  ViewfinderCircleIcon, 
  MagnifyingGlassIcon,
  PencilIcon 
} from '@heroicons/react/24/outline';
import styles from './ResearchTypeSelector.module.css';

interface ResearchTypeSelectorProps {
  onChange: (strategyId: string) => void;
  defaultStrategyId: string;
  onEditStrategy: (strategyId: string) => void;
  disabled: boolean;
}

export default function ResearchTypeSelector({ 
  onChange, 
  defaultStrategyId = 'default',
  onEditStrategy,
  disabled
}: ResearchTypeSelectorProps) {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(defaultStrategyId);
  const [hoveredStrategyId, setHoveredStrategyId] = useState<string | null>(null);

  const handleSelect = (strategyId: string) => {
    setSelectedStrategyId(strategyId);
    onChange(strategyId);
  };

  const handleEdit = (e: React.MouseEvent, strategyId: string) => {
    e.stopPropagation();
    onEditStrategy(strategyId);
  };

  const options = [
    { 
      id: 'default', 
      label: 'Default', 
      icon: MagnifyingGlassIcon,
      isEditable: false
    },
    { 
      id: 'minimal', 
      label: 'Minimal', 
      icon: ViewfinderCircleIcon,
      isEditable: true
    },
    { 
      id: 'expansive', 
      label: 'Expansive', 
      icon: ArrowsPointingOutIcon,
      isEditable: true
    },
    { 
      id: 'intensive', 
      label: 'Intensive', 
      icon: ArrowsPointingInIcon,
      isEditable: true
    }
  ] as const;

  return (
    <div className={styles.container}>
      {options.map((option) => (
        <button
          key={option.id}
          className={`${styles.button} ${selectedStrategyId === option.id ? styles.selected : ''}`}
          onClick={() => handleSelect(option.id)}
          onMouseEnter={() => setHoveredStrategyId(option.id)}
          onMouseLeave={() => setHoveredStrategyId(null)}
          aria-pressed={selectedStrategyId === option.id}
          type="button"
          disabled={disabled}
        >
          {selectedStrategyId === option.id && hoveredStrategyId === option.id && option.isEditable ? (
            <PencilIcon 
              className={styles.icon} 
              onClick={(e) => handleEdit(e, option.id)}
            />
          ) : (
            <option.icon className={styles.icon} />
          )}
          <span className={styles.label}>{option.label}</span>
        </button>
      ))}
    </div>
  );
} 