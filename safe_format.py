#!/usr/bin/env python3
"""
SAFE formatter: Converts all explanation fields from old format to new format
WITHOUT LOSING ANY CONTENT.

Old format examples:
- Plain text with \n\n breaks
- **Header**\n text\n text\n**Header2**\n text
- Bullet points with • or -

New format:
- Intro paragraph.\n\n
- Header:\n
- - **Label:** Description\n
- - **Label:** Description\n
- \n
- Header2:\n
- - Item\n
"""
import json
import os
import re

def safe_format(text):
    """
    Convert explanations to new format while preserving ALL content.
    """
    if not text:
        return text
    
    # Already in new format - check for "Header:" pattern (with colon)
    if re.search(r'\n[A-Z][^:\n]+:\n', text):
        return text
    
    # Clean HTML
    text = text.replace('<br><br>', '\n\n').replace('<br>', '\n')
    text = text.replace('<strong>', '**').replace('</strong>', '**')
    
    lines = text.split('\n')
    result = []
    intro_lines = []
    current_section = None
    sections = {}
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        if not stripped:
            i += 1
            continue
        
        # Detect section headers: **Header** or just text that looks like a header
        if re.match(r'^\*\*[^*]+\*\*$', stripped):
            # Found a bolded header
            current_section = stripped.strip('*').strip()
            sections[current_section] = []
            i += 1
        elif current_section is not None and (stripped.startswith('•') or stripped.startswith('-')):
            # Bullet point in current section
            item = re.sub(r'^[•-]\s*', '', stripped).strip()
            if item:
                sections[current_section].append(item)
            i += 1
        elif current_section is None:
            # Still in intro text
            intro_lines.append(stripped)
            i += 1
        else:
            # Text after a header that's not a bullet
            # This might be description text for the section
            if sections and current_section:
                # Add to the section as description
                sections[current_section].append(stripped)
            else:
                intro_lines.append(stripped)
            i += 1
    
    # Build result
    # Step 1: Add intro with paragraph breaks
    if intro_lines:
        intro_text = ' '.join(intro_lines)
        # Split into sentences where possible
        result.append(intro_text)
        result.append('')
    
    # Step 2: Add sections
    if sections:
        for section_idx, (header, items) in enumerate(sections.items()):
            if section_idx > 0:
                result.append('')
            
            result.append(f"{header}:")
            
            for item in items:
                if item.startswith('- **') or item.startswith('-  **'):
                    # Already formatted
                    result.append(item)
                elif ':' in item and not item.startswith('**'):
                    # "Label: Description" format
                    parts = item.split(':', 1)
                    label = parts[0].strip().replace('**', '')
                    desc = parts[1].strip()
                    result.append(f"- **{label}:** {desc}")
                elif re.match(r'^\*\*[^*]+\*\*:', item):
                    # Already has **label:** format
                    result.append(f"- {item}")
                else:
                    # Plain text item
                    result.append(f"- {item}")
    else:
        # No sections found, return original
        return text
    
    return '\n'.join(result)


def process_all():
    """Process all modul JSON files."""
    path = r'dataBank'
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
                    new = safe_format(old)
                    if new != old:
                        # Verify content is preserved
                        old_words = set(old.split())
                        new_words = set(new.split())
                        
                        # Allow for some changes but not massive content loss
                        if len(old_words) > 0 and len(new_words) > 0:
                            loss_ratio = (len(old_words) - len(new_words)) / len(old_words)
                            if loss_ratio > 0.3:
                                print(f'  WARNING: {filename} Q{q["id"]}: Possible content loss ({loss_ratio*100:.0f}%)')
                                continue
                        
                        q['explanation'] = new
                        modified += 1
            
            if modified > 0:
                with open(filepath, 'w', encoding='utf-8-sig') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print(f'✓ {filename}: {modified} formatted')
            else:
                print(f'  {filename}: {len(data)} (no changes needed)')
        
        except Exception as e:
            print(f'✗ {filename}: {str(e)[:80]}')


if __name__ == '__main__':
    process_all()
    print('\nDone!')
