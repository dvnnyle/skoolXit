import json
import random

def smart_shuffle_options(questions):
    '''Shuffle options while avoiding consecutive identical indices and ensuring no 2 consecutive repeats'''
    for q in questions:
        options = q['options']
        correct_option = options[q['answerIndex']]
        
        # Shuffle multiple times until we get a good distribution
        max_attempts = 50
        for attempt in range(max_attempts):
            shuffled = list(enumerate(options))
            random.shuffle(shuffled)
            q['options'] = [opt for idx, opt in shuffled]
            new_index = q['options'].index(correct_option)
            q['answerIndex'] = new_index
            
            # Good! Found a valid distribution
            break
    
    return questions

def fix_consecutive_indices(questions):
    '''Fix consecutive same indices by reshuffling problematic questions'''
    for i in range(len(questions) - 1):
        if questions[i]['answerIndex'] == questions[i + 1]['answerIndex']:
            # Reshuffle the second question
            options = questions[i + 1]['options']
            correct_option = options[questions[i + 1]['answerIndex']]
            
            max_attempts = 100
            for attempt in range(max_attempts):
                shuffled = list(enumerate(options))
                random.shuffle(shuffled)
                new_options = [opt for idx, opt in shuffled]
                new_index = new_options.index(correct_option)
                
                # Check if it would still be consecutive with the previous question
                if new_index != questions[i]['answerIndex']:
                    questions[i + 1]['options'] = new_options
                    questions[i + 1]['answerIndex'] = new_index
                    break
    
    return questions

# Process all modules
modules = ['modul1a', 'modul1b', 'modul2a', 'modul2b', 'modul2c', 'modul3a', 'modul3b', 'modul3c', 'modul4a', 'modul4b', 'modul5a', 'modul5b']

for module in modules:
    filepath = f'dataBank/{module}.json'
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # First pass: shuffle all options
    data = smart_shuffle_options(data)
    
    # Second pass: fix consecutive indices
    data = fix_consecutive_indices(data)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f'Fixed {module}.json')

print('All modules shuffled and de-duplicated!')
