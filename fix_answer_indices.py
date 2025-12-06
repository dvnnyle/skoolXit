import json
import random

def fix_answer_indices(questions):
    '''Fix answer indices by finding which option best matches the explanation'''
    
    for q in questions:
        explanation = q['explanation'].lower()
        short_exp = q['shortExplanation'].lower()
        options = q['options']
        
        # Score each option based on how well it matches the explanation
        best_score = -1
        best_index = 0
        
        for i, option in enumerate(options):
            option_lower = option.lower()
            words = [w for w in option_lower.split() if len(w) > 3]
            
            # Count how many key words from the option appear in explanation
            match_count = sum(1 for w in words if w in explanation or w in short_exp)
            score = match_count / len(words) if words else 0
            
            if score > best_score:
                best_score = score
                best_index = i
        
        # Update answerIndex to the best matching option
        q['answerIndex'] = best_index
    
    return questions

# Process all modules
modules = ['modul1a', 'modul1b', 'modul2a', 'modul2b', 'modul2c', 'modul3a', 'modul3b', 'modul3c', 'modul4a', 'modul4b', 'modul5a', 'modul5b']

for module in modules:
    filepath = f'dataBank/{module}.json'
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data = fix_answer_indices(data)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f'Fixed {module}.json')

print('All answer indices corrected!')
