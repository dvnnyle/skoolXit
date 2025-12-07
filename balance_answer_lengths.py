#!/usr/bin/env python3
"""
Balance answer option lengths to be similar across all options in each question.
This prevents length-based clues by making all options approximately the same length.
"""

import json
import os
from pathlib import Path

def load_json(filepath):
    """Load JSON file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    """Save JSON file"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def shorten_option(option, target_length):
    """Shorten an option to target length by truncating intelligently"""
    if len(option) <= target_length:
        return option
    
    # Try to cut at a word boundary
    truncated = option[:target_length]
    last_space = truncated.rfind(' ')
    
    if last_space > target_length * 0.7:  # If space is found and reasonable
        return truncated[:last_space] + "..."
    return truncated.rstrip() + "..."

def extend_option(option, target_length):
    """Extend option to target length by adding context"""
    if len(option) >= target_length * 0.9:
        return option
    
    extensions = [
        " i alle relevante situasjoner",
        " under alle normale omstendigheter",
        " på en generell basis",
        " i de fleste tilfeller",
        " som regel",
        " typisk sett",
        " vanligvis",
        " ofte",
        " gjerne",
    ]
    
    extended = option
    for ext in extensions:
        if len(extended) < target_length * 0.9:
            extended = option + ext
            if len(extended) <= target_length:
                return extended
    
    # If still short, just add generic padding
    if len(extended) < target_length * 0.9:
        if not option.endswith('.'):
            extended = option + "."
    
    return extended

def balance_options(question):
    """Balance all options to be similar length"""
    options = question.get('options', [])
    if len(options) < 2:
        return question
    
    # Calculate average length
    avg_length = sum(len(opt) for opt in options) / len(options)
    target_length = int(avg_length)
    
    # Adjust options to target length
    balanced = []
    for option in options:
        current_len = len(option)
        
        if current_len < target_length * 0.8:
            # Too short - extend it
            new_option = extend_option(option, target_length)
        elif current_len > target_length * 1.2:
            # Too long - shorten it
            new_option = shorten_option(option, target_length)
        else:
            # Just right
            new_option = option
        
        balanced.append(new_option)
    
    question['options'] = balanced
    return question

def process_module(filepath):
    """Process a single module and balance options"""
    data = load_json(filepath)
    changes_made = 0
    
    for question in data:
        if 'options' not in question:
            continue
        original_options = question.get('options', []).copy()
        balanced_question = balance_options(question)
        
        # Check if anything changed
        if balanced_question.get('options', []) != original_options:
            changes_made += 1
    
    return data, changes_made

def main():
    """Main processing function"""
    databank_dir = Path('dataBank')
    
    results = {}
    total_changes = 0
    
    # Process each module
    for i in range(1, 6):
        for suffix in ['a', 'b', 'c']:
            filepath = databank_dir / f'modul{i}{suffix}.json'
            if filepath.exists():
                print(f"Processing {filepath.name}...")
                data, changes = process_module(filepath)
                
                if changes > 0:
                    save_json(filepath, data)
                    print(f"  ✓ Balanced {changes} questions")
                    results[filepath.name] = changes
                    total_changes += changes
                else:
                    print(f"  ✓ Already balanced")
    
    print(f"\n{'='*50}")
    print(f"Total questions balanced: {total_changes}")
    print(f"Files modified: {len(results)}")
    for filename, count in sorted(results.items()):
        print(f"  {filename}: {count} questions")

if __name__ == '__main__':
    main()
