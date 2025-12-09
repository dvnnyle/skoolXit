#!/usr/bin/env python3
"""
Verification script to check the formatting of explanations in modul JSON files.

Validates that explanations are properly formatted with sections and bullet points.
"""

import json
import os
import re
from typing import Dict, List, Tuple


def count_explanations_with_structure(filepath: str) -> Tuple[int, int, List[str]]:
    """
    Count explanations with section headers and bullet points.
    
    Returns:
    - total_explanations: int
    - structured_explanations: int (with sections/bullets)
    - sample_explanations: List[str] (up to 3 samples)
    """
    try:
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        if content.startswith('\ufeff'):
            content = content[1:]
        data = json.loads(content)
    except Exception as e:
        print(f"ERROR reading {filepath}: {e}")
        return 0, 0, []
    
    total = 0
    structured = 0
    samples = []
    
    for item in data:
        if 'explanation' in item:
            total += 1
            explanation = item['explanation']
            
            # Check for section headers (**...**) and bullet points (-)
            has_sections = bool(re.search(r'\*\*[^*]+\*\*:', explanation))
            has_bullets = bool(re.search(r'\n-\s', explanation))
            
            if has_sections or has_bullets:
                structured += 1
                if len(samples) < 3:
                    samples.append({
                        'id': item.get('id', 'unknown'),
                        'has_sections': has_sections,
                        'has_bullets': has_bullets,
                        'preview': explanation[:150] + '...' if len(explanation) > 150 else explanation
                    })
    
    return total, structured, samples


def main():
    """Main entry point."""
    databank_dir = r"c:\Users\Neuye\Documents\skoleIT\slanger\dataBank"
    
    files_to_check = [
        'modul1a.json',
        'modul1b.json',
        'modul2b.json',
        'modul2c.json',
        'modul3a.json',
        'modul3b.json',
        'modul3c.json',
        'modul4a.json',
        'modul4b.json',
        'modul5a.json',
        'modul5b.json',
    ]
    
    print("=" * 80)
    print("EXPLANATION FORMAT VERIFICATION")
    print("=" * 80)
    print()
    
    total_questions = 0
    total_structured = 0
    
    for filename in files_to_check:
        filepath = os.path.join(databank_dir, filename)
        
        if not os.path.exists(filepath):
            print(f"{filename:<20} - FILE NOT FOUND")
            continue
        
        total, structured, samples = count_explanations_with_structure(filepath)
        total_questions += total
        total_structured += structured
        
        percent = (structured / total * 100) if total > 0 else 0
        status = "✓ FORMATTED" if structured > 0 else "- PLAIN TEXT"
        
        print(f"{filename:<20} {total:>3} explanations, {structured:>3} formatted ({percent:>5.1f}%) {status}")
    
    print()
    print("=" * 80)
    print(f"TOTAL: {total_questions} explanations across all files")
    print(f"FORMATTED: {total_structured} ({total_structured/total_questions*100:.1f}%)")
    print("=" * 80)
    print()
    print("✓ Verification complete!")


if __name__ == "__main__":
    main()
