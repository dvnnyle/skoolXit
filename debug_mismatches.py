import json

modules = ['modul1a', 'modul1b', 'modul2a']

for module in modules[:1]:  # Just check modul1a
    filepath = f'dataBank/{module}.json'
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    problem_qs = [7, 9, 10, 13, 17, 19]
    for qid in problem_qs:
        q = data[qid - 1]
        answer_text = q['options'][q['answerIndex']]
        print(f"\n=== Q{qid} ===")
        print(f"Answer: {answer_text}")
        print(f"Explanation: {q['explanation'][:150]}...")
