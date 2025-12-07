#!/usr/bin/env python3
"""
Find questions with extreme length disparities (3x or more difference)
"""

import json
from pathlib import Path

def find_disparities(filepath, threshold=3.0):
    """Find questions where longest option is 3x+ longer than shortest"""
    with open(filepath) as f:
        data = json.load(f)
    
    bad_questions = []
    
    for q in data:
        if 'options' not in q:
            continue
        
        lengths = [len(opt) for opt in q['options']]
        min_len = min(lengths)
        max_len = max(lengths)
        
        if min_len == 0:
            ratio = float('inf')
        else:
            ratio = max_len / min_len
        
        if ratio >= threshold:
            bad_questions.append({
                'id': q.get('id'),
                'section': q.get('section'),
                'question': q.get('question', '')[:50],
                'ratio': ratio,
                'lengths': lengths,
                'options': q['options']
            })
    
    return bad_questions

databank_dir = Path('dataBank')

all_bad = []
for i in range(1, 6):
    for suffix in ['a', 'b', 'c']:
        filepath = databank_dir / f'modul{i}{suffix}.json'
        if filepath.exists():
            bad = find_disparities(filepath)
            if bad:
                print(f"\n{filepath.name} - {len(bad)} questions with 3x+ disparity:")
                for q in bad:
                    print(f"  Q{q['id']} ({q['section']}): {q['ratio']:.1f}x ratio")
                    print(f"    {q['question']}")
                    for j, (opt, length) in enumerate(zip(q['options'], q['lengths'])):
                        print(f"      {j}: ({length:3d}) {opt[:60]}")
                    all_bad.append((filepath.name, q))

print(f"\n\nTotal: {sum(len(find_disparities(Path('dataBank') / f'modul{i}{s}.json')) for i in range(1,6) for s in 'abc')} questions need fixing")
