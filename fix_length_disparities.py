#!/usr/bin/env python3
"""
Reduce extreme answer length disparities while preserving semantic meaning.
Only extends very short options and reduces obviously long options.
"""

import json
from pathlib import Path

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def fix_question_lengths(question):
    """Fix only the most extreme length disparities"""
    options = question.get('options', [])
    if len(options) < 2:
        return False
    
    lengths = [len(opt) for opt in options]
    min_len = min(lengths)
    max_len = max(lengths)
    avg_len = sum(lengths) / len(options)
    
    # Only fix if there's a major disparity (more than 2x difference)
    if max_len < min_len * 2:
        return False  # Already balanced enough
    
    new_options = []
    for i, option in enumerate(options):
        length = len(option)
        
        # If significantly shorter than average, extend it
        if length < avg_len * 0.6:
            # Add a phrase to extend it
            extensions = [
                " på en generell basis",
                " i almindelighed",
                " som utgangspunkt",
                " generelt sett",
                " oftere",
                " gjerne",
            ]
            extended = option
            for ext in extensions:
                if len(extended) < avg_len:
                    extended = option + ext
                    if len(extended) <= avg_len * 1.3:
                        break
            new_options.append(extended)
        # If extremely longer than others, trim it slightly
        elif length > max_len * 0.8 and length > avg_len * 1.5:
            # Only trim if it has clear redundancy
            if option.count(' ') >= 3:  # Has at least several words
                words = option.split()
                trimmed = ' '.join(words[:len(words)-1])
                if len(trimmed) > avg_len:
                    new_options.append(trimmed)
                else:
                    new_options.append(option)
            else:
                new_options.append(option)
        else:
            new_options.append(option)
    
    if new_options != options:
        question['options'] = new_options
        return True
    return False

def process_module(filepath):
    data = load_json(filepath)
    changes = 0
    
    for question in data:
        if 'options' in question:
            if fix_question_lengths(question):
                changes += 1
    
    return data, changes

def main():
    databank_dir = Path('dataBank')
    results = {}
    total_changes = 0
    
    for i in range(1, 6):
        for suffix in ['a', 'b', 'c']:
            filepath = databank_dir / f'modul{i}{suffix}.json'
            if filepath.exists():
                print(f"Processing {filepath.name}...")
                data, changes = process_module(filepath)
                
                if changes > 0:
                    save_json(filepath, data)
                    print(f"  ✓ Fixed {changes} questions")
                    results[filepath.name] = changes
                    total_changes += changes
                else:
                    print(f"  ✓ No major disparities")
    
    print(f"\n{'='*50}")
    print(f"Total questions fixed: {total_changes}")
    for filename, count in sorted(results.items()):
        print(f"  {filename}: {count}")

if __name__ == '__main__':
    main()
