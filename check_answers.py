import json

def check_modules():
    issues = {
        'same_index_in_row': [],
        'answer_mismatch': []
    }
    
    modules = ['modul1a', 'modul1b', 'modul2a', 'modul2b', 'modul2c', 'modul3a', 'modul3b', 'modul3c', 'modul4a', 'modul4b', 'modul5a', 'modul5b']
    
    for module in modules:
        filepath = f'dataBank/{module}.json'
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Check for same indices in a row
        prev_index = None
        for q in data:
            curr_index = q['answerIndex']
            if curr_index == prev_index:
                issues['same_index_in_row'].append(f'{module} Q{q["id"]}: index {curr_index} (same as previous)')
            prev_index = curr_index
        
        # Check if answer matches question explanation
        for q in data:
            answer_text = q['options'][q['answerIndex']]
            explanation = q['explanation'].lower()
            answer_lower = answer_text.lower()
            
            # Check if the correct answer appears in the explanation
            # Use substring matching with key parts of the answer
            key_phrases = [p.strip() for p in answer_lower.split(' ') if len(p.strip()) > 3]
            found = False
            
            # Check if at least 70% of key phrases appear in explanation
            matches = sum(1 for phrase in key_phrases if phrase in explanation)
            if len(key_phrases) > 0 and matches >= len(key_phrases) * 0.7:
                found = True
            
            if not found:
                issues['answer_mismatch'].append(f'{module} Q{q["id"]}: Answer mismatch')
    
    return issues

issues = check_modules()

print('=== SAME INDEX IN ROW (PATTERN ISSUES) ===')
if issues['same_index_in_row']:
    for issue in issues['same_index_in_row']:
        print(f'  {issue}')
else:
    print('  ✓ No consecutive same indices found')

print('\n=== ANSWER MISMATCH WITH EXPLANATION ===')
if issues['answer_mismatch']:
    for issue in issues['answer_mismatch'][:30]:
        print(f'  {issue}')
    if len(issues['answer_mismatch']) > 30:
        print(f'  ... and {len(issues["answer_mismatch"]) - 30} more')
else:
    print('  ✓ All answers match their explanations')

print(f'\nTotal issues found: {len(issues["same_index_in_row"]) + len(issues["answer_mismatch"])}')
