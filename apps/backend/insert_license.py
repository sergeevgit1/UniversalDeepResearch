# SPDX-FileCopyrightText: Copyright (c) 2025 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import os
from typing import List

def add_header_to_python_files(directory_path, header_content, extensions: List[str] = [".py"]):
    """
    Inserts a specified header at the beginning of every .py file
    in the given directory and its subdirectories.

    Args:
        directory_path (str): The path to the directory to process.
        header_content (str): The content of the header to insert.
                              Ensure it includes newlines for proper formatting.
    """
    for root, _, files in os.walk(directory_path):
        for file_name in files:
            if file_name == '.venv':
                continue
            for extension in extensions:
                if file_name.endswith(extension):
                    file_path = os.path.join(root, file_name)
                    try:
                        with open(file_path, 'r+', encoding='utf-8') as f:
                            original_content = f.read()
                            if original_content.startswith(header_content):
                                print(f"Header already exists in: {file_path}")
                                continue
                            f.seek(0)  # Move cursor to the beginning of the file
                            f.write(header_content + original_content)
                        print(f"Header added to: {file_path}")
                    except IOError as e:
                        print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    target_directory = "../frontend"  # Replace with your target directory
    
    # Define your header content here. Use triple quotes for multi-line strings.
    # Ensure a newline character at the end of the header for separation.
    custom_header = """/*
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
"""

    add_header_to_python_files(target_directory, custom_header, extensions=[".js", ".ts", ".tsx", ".jsx", ".css"])