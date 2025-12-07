#!/usr/bin/env python3
"""
Script to analyze and extend shorter answer options to be more similar
in length to the correct answers across all quiz modules.

This prevents length-based clues in multiple choice questions.
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

def analyze_options_length(question_data):
    """Analyze the length of options and return stats"""
    options = question_data.get('options', [])
    answer_idx = question_data.get('answerIndex', -1)
    
    if answer_idx < 0 or answer_idx >= len(options):
        return None
    
    correct_answer = options[answer_idx]
    correct_length = len(correct_answer)
    
    analysis = {
        'question_id': question_data.get('id'),
        'question': question_data.get('question'),
        'correct_answer_length': correct_length,
        'correct_answer': correct_answer,
        'options_lengths': [len(opt) for opt in options],
        'options': options,
        'answer_index': answer_idx,
        'length_imbalance': max(len(opt) for opt in options) - min(len(opt) for opt in options),
    }
    
    return analysis

def extend_option(original_option, target_length, correct_answer, question):
    """
    Extend a shorter option to be closer to target length by adding relevant details
    """
    current_length = len(original_option)
    
    if current_length >= target_length * 0.8:  # If close enough, don't modify
        return original_option
    
    # Strategies to extend the option:
    # 1. Add explanatory phrases
    # 2. Add negations or qualifiers
    # 3. Add context-specific details
    
    extensions = {
        # Generic extensions that make wrong answers more plausible but still wrong
        "fra": ", noe som kan oppfattes som relevant men er ikke helt korrekt",
        "bare": " i alle situasjoner og kontekster",
        "aldri": " under noen omstendigheter",
        "alltid": " uavhengig av konteksten",
        "kan": " muligens eller potensielt",
        "handler": " utelukkende eller primært",
    }
    
    extended = original_option
    
    # Look for key words we can attach qualifiers to
    for keyword, extension in extensions.items():
        if keyword in original_option.lower() and len(extended) < target_length * 0.9:
            # Only add if it makes sense contextually
            if original_option.endswith('.'):
                extended = original_option[:-1] + extension + '.'
            else:
                extended = original_option + extension
            break
    
    # If still too short, add a descriptive suffix
    if len(extended) < target_length * 0.9 and extended == original_option:
        if not original_option.endswith('.'):
            extended = original_option + ", men dette er ikke helt korrekt"
        else:
            extended = original_option[:-1] + ", men dette er ikke helt korrekt."
    
    return extended

def process_module(filepath):
    """Process a single module and extend options"""
    data = load_json(filepath)
    changes_made = 0
    
    for question in data:
        analysis = analyze_options_length(question)
        if not analysis:
            continue
        
        correct_length = analysis['correct_answer_length']
        avg_other_lengths = sum(
            len(opt) for i, opt in enumerate(analysis['options']) 
            if i != analysis['answer_index']
        ) / (len(analysis['options']) - 1) if len(analysis['options']) > 1 else 0
        
        # Check if there's significant imbalance (correct answer much longer than others)
        max_other_length = max(
            len(opt) for i, opt in enumerate(analysis['options']) 
            if i != analysis['answer_index']
        ) if len(analysis['options']) > 1 else 0
        
        if correct_length > max_other_length * 1.3:  # 30% longer = significant imbalance
            # Extend the shorter options
            new_options = []
            for i, option in enumerate(analysis['options']):
                if i != analysis['answer_index']:
                    new_option = extend_option(
                        option, 
                        correct_length * 0.9,  # Target: 90% of correct answer length
                        analysis['correct_answer'],
                        question['question']
                    )
                    if new_option != option:
                        changes_made += 1
                    new_options.append(new_option)
                else:
                    new_options.append(option)
            
            question['options'] = new_options
    
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
                    print(f"  ✓ Extended {changes} options")
                    results[filepath.name] = changes
                    total_changes += changes
                else:
                    print(f"  ✓ No changes needed")
    
    print(f"\n{'='*50}")
    print(f"Total changes made: {total_changes}")
    print(f"Files modified: {len(results)}")
    for filename, count in sorted(results.items()):
        print(f"  {filename}: {count} options extended")

if __name__ == '__main__':
    main()
