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

import { useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ReportViewer.module.css';

interface ReportViewerProps {
  report: string;
  isVisible: boolean;
}

export default function ReportViewer({ report, isVisible }: ReportViewerProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  
  // Memoize the markdown rendering to improve performance
  const renderedContent = useMemo(() => {
    return (
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
      >
        {report}
      </ReactMarkdown>
    );
  }, [report]);

  // Auto-scroll to the report when it becomes visible
  useEffect(() => {
    if (isVisible && reportRef.current) {
      // Add a small delay to ensure the animation has started
      const timeoutId = setTimeout(() => {
        // Calculate the position to scroll to, leaving a margin at the top
        // The gap between ReportViewer and ResearchProgressList is mt-6 (1.5rem)
        // We want half of that (0.75rem = 12px) between the viewport top and ReportViewer
        const elementPosition = reportRef.current?.getBoundingClientRect().top || 0;
        const offsetPosition = elementPosition + window.pageYOffset - 12; // 12px (0.75rem) margin from top
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isVisible]);

  if (!isVisible) return null;
  
  return (
    <div className={styles.wrapper} ref={reportRef}>
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Research Report</h2>
          </div>
          <div className={styles.reportContent}>
            {renderedContent}
          </div>
        </div>
      </div>
    </div>
  );
} 