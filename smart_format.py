#!/usr/bin/env python3
"""
Smart formatter: Converts all explanation fields from old format to new format
Old format: **Header**\nBullet points with • or -
New format: Intro paragraph.\n\nHeader:\n- **Bold:** Description
"""
import json
import os
import re

def smart_format(text):
    if not text:
        return text
    
    # Already in new format - check for pattern like "- **label:** description"
    if re.search(r'- \*\*[^*]+\*\*:', text):
        return text
    
    # Clean HTML
    text = text.replace('<br><br>', '\n\n').replace('<br>', '\n')
    text = text.replace('<strong>', '**').replace('</strong>', '**')
    
    lines = text.split('\n')
    intro_lines = []
    sections = {}
    current_section = None
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        
        # Detect section headers: **Header** format (surrounded by **)
        if re.match(r'^\*\*[^*]+\*\*$', stripped):
            header = stripped.strip('*').strip()
            current_section = header
            sections[header] = []
        elif current_section is not None and (stripped.startswith('•') or stripped.startswith('-')):
            # Bullet point under a section
            item = re.sub(r'^[•-]\s*', '', stripped).strip()
            if item:
                sections[current_section].append(item)
        elif current_section is None:
            # Intro text (before first section)
            if stripped:
                intro_lines.append(stripped)
    
    # If no sections found, return original (it's plain text)
    if not sections:
        return text
    
    # Build result with proper format
    result = []
    
    # Add intro
    if intro_lines:
        result.extend(intro_lines)
        result.append('')  # Blank line before sections
    
    # Add sections
    for i, (header, items) in enumerate(sections.items()):
        if i > 0:
            result.append('')  # Blank line between sections
        result.append(f"{header}:")
        
        for item in items:
            # If item has format "Label: Description", keep it; otherwise add dash
            if re.match(r'^\*\*[^*]+\*\*:', item):
                # Already has format "**label:**"
                result.append(f"- {item}")
            elif ':' in item:
                # Has colon, assume "Label: Description" and format it
                parts = item.split(':', 1)
                label = parts[0].strip()
                desc = parts[1].strip()
                # Remove bold marks if already present
                label = label.replace('**', '').strip()
                result.append(f"- **{label}:** {desc}")
            else:
                # No colon, just add dash
                result.append(f"- {item}")
    
    return '\n'.join(result)

def process_all():
    path = r'c:\Users\Neuye\Documents\skoleIT\slanger\dataBank'
    files = [f for f in os.listdir(path) if f.startswith('modul') and f.endswith('.json')]
    
    for filename in sorted(files):
        filepath = os.path.join(path, filename)
        try:
            with open(filepath, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
            
            modified = 0
            for q in data:
                if 'explanation' in q:
                    old = q['explanation']
                    new = smart_format(old)
                    if new != old:
                        q['explanation'] = new
                        modified += 1
            
            if modified > 0:
                with open(filepath, 'w', encoding='utf-8-sig') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print(f'✓ {filename}: {modified} formatted')
            else:
                print(f'  {filename}: {len(data)} (no changes)')
        except Exception as e:
            print(f'✗ {filename}: {str(e)[:60]}')

if __name__ == '__main__':
    process_all()
    print('\nDone!')
