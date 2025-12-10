import json
import random
import sys

def randomize_answers(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    for question in questions:
        # Get the correct answer
        correct_answer = question['options'][question['answerIndex']]
        
        # Shuffle the options
        random.shuffle(question['options'])
        
        # Find the new index of the correct answer
        question['answerIndex'] = question['options'].index(correct_answer)
    
    # Write back to file
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully randomized {len(questions)} questions in {filename}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        randomize_answers(sys.argv[1])
    else:
        print("Usage: python randomize_answers.py <json_file>")
