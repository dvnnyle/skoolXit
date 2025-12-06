import json
import random

# Read the file
with open('dataBank/modul1a.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# For each question, randomize the answer index and shuffle options
for question in data:
    options = question['options']
    correct_answer = options[question['answerIndex']]
    
    # Shuffle options
    shuffled_options = options.copy()
    random.shuffle(shuffled_options)
    
    # Find new index of correct answer
    new_index = shuffled_options.index(correct_answer)
    
    # Update question
    question['options'] = shuffled_options
    question['answerIndex'] = new_index

# Write back
with open('dataBank/modul1a.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✓ Successfully randomized all 30 questions in modul1a.json")
