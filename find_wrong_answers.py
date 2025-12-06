import json

modules = ['modul1a', 'modul1b', 'modul2a', 'modul2b', 'modul2c', 'modul3a', 'modul3b', 'modul3c', 'modul4a', 'modul4b', 'modul5a', 'modul5b']

for module in modules:
    filepath = f'dataBank/{module}.json'
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    wrong_answers = []
    for q in data:
        answer_text = q['options'][q['answerIndex']].lower()
        explanation = q['explanation'].lower()
        
        # Check if answer text appears in explanation
        # Split answer into key words and check if most appear in explanation
        words = [w for w in answer_text.split() if len(w) > 3]
        if words:
            match_count = sum(1 for w in words if w in explanation)
            match_ratio = match_count / len(words)
            
            if match_ratio < 0.5:  # Less than 50% of key words match
                wrong_answers.append({
                    'q_id': q['id'],
                    'question': q['question'][:50],
                    'answer': answer_text[:60],
                    'match_ratio': match_ratio
                })
    
    if wrong_answers:
        print(f"\n{module.upper()} - {len(wrong_answers)} wrong answers:")
        for w in wrong_answers:
            print(f"  Q{w['q_id']}: {w['question']}... | Answer match: {w['match_ratio']:.0%}")
