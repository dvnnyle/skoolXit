import json
from pathlib import Path

databank_dir = Path('dataBank')
total = 0
found = []

for i in range(1, 6):
    for suffix in ['a', 'b', 'c']:
        filepath = databank_dir / f'modul{i}{suffix}.json'
        if not filepath.exists():
            continue
        
        with open(filepath) as f:
            data = json.load(f)
        
        for q in data:
            if 'options' not in q:
                continue
            
            lengths = [len(opt) for opt in q['options']]
            if min(lengths) > 0:
                ratio = max(lengths) / min(lengths)
                if ratio >= 3.0:
                    found.append((str(filepath.name), q.get('id'), q.get('section'), ratio, lengths))
                    total += 1

for fname, qid, section, ratio, lengths in found:
    print(f'{fname} Q{qid} ({section}): {ratio:.1f}x ratio - {lengths}')

print(f'\nTotal questions with 3x+ disparity: {total}')
