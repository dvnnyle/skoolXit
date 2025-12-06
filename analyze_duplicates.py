import json
import os
from collections import defaultdict
from pathlib import Path

# Define the path to the dataBank
databank_path = Path(__file__).parent / "dataBank"

# List of module files to analyze
modules = [
    "modul1a.json",
    "modul1b.json",
    "modul2a.json",
    "modul2b.json",
    "modul2c.json",
    "modul3a.json",
    "modul3b.json",
    "modul3c.json",
    "modul4a.json",
    "modul4b.json",
    "modul5a.json",
    "modul5b.json",
]

# Dictionary to store questions and which files they appear in
questions_map = defaultdict(list)
total_questions = 0

# Load and process each module file
for module in modules:
    file_path = databank_path / module
    
    if not file_path.exists():
        print(f"Warning: {module} not found")
        continue
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract questions (handle both list and dict formats)
        questions = []
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and 'question' in item:
                    questions.append(item['question'])
        elif isinstance(data, dict):
            if 'questions' in data:
                for item in data['questions']:
                    if isinstance(item, dict) and 'question' in item:
                        questions.append(item['question'])
            elif 'question' in data:
                questions.append(data['question'])
        
        # Add questions to the map
        for question in questions:
            questions_map[question].append(module)
            total_questions += 1
        
        print(f"✓ {module}: {len(questions)} questions found")
    
    except json.JSONDecodeError as e:
        print(f"Error decoding {module}: {e}")
    except Exception as e:
        print(f"Error processing {module}: {e}")

print(f"\nTotal questions loaded: {total_questions}")
print(f"Unique questions: {len(questions_map)}")

# Find duplicates
duplicates = {q: files for q, files in questions_map.items() if len(files) > 1}

print(f"\n{'='*80}")
print(f"DUPLICATE QUESTIONS ANALYSIS")
print(f"{'='*80}\n")

if duplicates:
    print(f"Found {len(duplicates)} duplicate question(s):\n")
    
    for i, (question, files) in enumerate(sorted(duplicates.items()), 1):
        print(f"{i}. Question: {question[:100]}{'...' if len(question) > 100 else ''}")
        print(f"   Appears in: {', '.join(files)}")
        print()
else:
    print("No duplicate questions found!")

print(f"\n{'='*80}")
print(f"SUMMARY")
print(f"{'='*80}")
print(f"Total unique questions: {len(questions_map)}")
print(f"Total duplicate questions found: {len(duplicates)}")
print(f"Total questions across all files: {total_questions}")
