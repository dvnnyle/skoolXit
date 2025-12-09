#!/usr/bin/env python3
import json
import os

def format_explanation(old_text):
    """Add structure to simple explanations: make them into intro + sections with bullets"""
    if not old_text or '- **' in old_text:
        return old_text  # Already formatted or empty
    
    # Simple strategy: if text has multiple sentences/paragraphs, keep first as intro
    # Then look for natural section breaks
    
    # Clean HTML if present
    text = old_text.replace('<br><br>', '\n\n').replace('<br>', '\n')
    text = text.replace('<strong>', '**').replace('</strong>', '**')
    
    # If already has bullets with **, just ensure it's in new format
    if '**' in text and ('•' in text or text.count('\n') > 2):
        lines = text.split('\n')
        result = []
        current_section = None
        
        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue
                
            if stripped.startswith('**') and stripped.endswith('**'):
                # Section header
                current_section = stripped.strip('*')
                result.append(f"{current_section}:")
            elif stripped.startswith('•'):
                # Bullet point
                item = stripped.lstrip('•').strip()
                if not item.startswith('-'):
                    item = f"- {item}"
                result.append(item)
            elif stripped.startswith('-'):
                result.append(line.strip())
            else:
                # Regular text - treat as intro or section content
                result.append(stripped)
        
        formatted = '\n\n'.join([p for p in result if p])
        return formatted if formatted != old_text else old_text
    
    # For completely unstructured text, just return as-is (will be kept simple)
    return old_text


def process_file(filepath):
    """Process a single JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        modified_count = 0
        for question in data:
            if 'explanation' in question:
                old_exp = question['explanation']
                new_exp = format_explanation(old_exp)
                if new_exp != old_exp:
                    question['explanation'] = new_exp
                    modified_count += 1
        
        if modified_count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return modified_count
        return 0
    
    except Exception as e:
        print(f"ERROR processing {filepath}: {e}")
        return -1


# Process all files
base_path = r'c:\Users\Neuye\Documents\skoleIT\slanger\dataBank'
files_to_process = [
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

total_modified = 0
for filename in files_to_process:
    filepath = os.path.join(base_path, filename)
    if os.path.exists(filepath):
        modified = process_file(filepath)
        if modified > 0:
            print(f"✓ {filename}: {modified} questions formatted")
            total_modified += modified
        elif modified == 0:
            print(f"- {filename}: already formatted or no changes needed")
        else:
            print(f"✗ {filename}: error during processing")
    else:
        print(f"✗ {filename}: file not found")

print(f"\n{'='*50}")
print(f"Total questions formatted: {total_modified}")
print(f"Processing complete!")
