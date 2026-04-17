#!/usr/bin/env python3
"""
Remove duplicate keys from JSON translation files.
Keeps the first occurrence of each key.
"""

import json
import sys
from pathlib import Path
from collections import OrderedDict


def remove_duplicates(file_path: Path) -> tuple[int, list[str]]:
    """
    Remove duplicate keys from JSON file.
    Returns (number_of_duplicates_removed, list_of_duplicate_keys)
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse JSON while tracking duplicates
    seen_keys = set()
    duplicates = []
    lines = content.split('\n')
    output_lines = []
    skip_next = False
    
    for i, line in enumerate(lines):
        if skip_next:
            skip_next = False
            continue
            
        # Check if line contains a key
        stripped = line.strip()
        if stripped.startswith('"') and '":' in stripped:
            # Extract key
            key = stripped.split('":')[0].strip('"')
            
            if key in seen_keys:
                # This is a duplicate - skip this line
                duplicates.append(key)
                continue
            else:
                seen_keys.add(key)
        
        output_lines.append(line)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))
    
    return len(duplicates), duplicates


def main():
    files = [
        Path('src/locales/en.json'),
        Path('src/locales/it.json'),
    ]
    
    total_removed = 0
    
    for file_path in files:
        if not file_path.exists():
            print(f"❌ File not found: {file_path}")
            continue
        
        print(f"\n🔍 Processing {file_path}...")
        count, duplicates = remove_duplicates(file_path)
        
        if count > 0:
            print(f"✅ Removed {count} duplicate keys:")
            for key in duplicates:
                print(f"   - {key}")
            total_removed += count
        else:
            print(f"✅ No duplicates found")
    
    print(f"\n🎯 Total duplicates removed: {total_removed}")
    
    if total_removed > 0:
        print("\n⚠️  Please verify the JSON files are still valid:")
        print("   npm run i18n:validate")


if __name__ == '__main__':
    main()
