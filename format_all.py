#!/usr/bin/env python3
"""
Correct formatter: Converts explanations to target format while preserving content.

Target format:
- Intro paragraph (content that explains the concept)
- Blank line
- Section Header:
  - **Bold label:** Description (if has colons)
  - Regular description (if no colons)
- Blank line between sections
"""
import json
import os
import re


def convert_to_target_format(text):
    """Convert explanation to target format."""
    if not text:
        return text
    
    # Check if already properly formatted (has "Header:" pattern followed by "- **")
    if re.search(r'\n[A-Za-z][^:\n]*:\n(- \*\*|$)', text):
        return text
    
    # Clean HTML tags
    text = text.replace('<br><br>', '\n\n').replace('<br>', '\n')
    text = text.replace('<strong>', '**').replace('</strong>', '**')
    
    lines = text.split('\n')
    
    # Parse structure
    intro_text = []
    sections = {}  # {section_name: [items]}
    current_section = None
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        
        # Check if this is a section header (bold **text** or text ending with :)
        is_bold_header = re.match(r'^\*\*[^*]+\*\*$', stripped)
        is_plain_header = stripped.endswith(':') and not stripped.startswith('-')
        
        if is_bold_header or is_plain_header:
            # This is a section header
            if is_bold_header:
                current_section = stripped.strip('*').strip()
            else:
                current_section = stripped.rstrip(':').strip()
            sections[current_section] = []
        elif current_section is not None:
            # We're in a section
            if stripped.startswith('•') or stripped.startswith('-'):
                # Bullet point
                item = re.sub(r'^[•-]\s*', '', stripped)
            else:
                # Regular text in section
                item = stripped
            
            if item:
                sections[current_section].append(item)
        else:
            # Intro text
            if stripped:
                intro_text.append(stripped)
    
    # If no sections found, return original
    if not sections:
        return text
    
    # Build output
    output = []
    
    # Add intro (combine all intro text into paragraphs)
    if intro_text:
        output.extend(intro_text)
        output.append('')  # Blank line before sections
    
    # Add sections
    for i, (section_name, items) in enumerate(sections.items()):
        if i > 0:
            output.append('')  # Blank line between sections
        
        output.append(f"{section_name}:")
        
        for item in items:
            # Format each item
            if item.startswith('- **') or item.startswith('-  **'):
                # Already formatted
                output.append(item)
            elif ':' in item and not item.startswith('**'):
                # Format "Label: Description" as "- **Label:** Description"
                parts = item.split(':', 1)
                label = parts[0].strip().replace('**', '').strip()
                desc = parts[1].strip()
                output.append(f"- **{label}:** {desc}")
            elif item.startswith('**') and item.endswith('**'):
                # Just a bold word, leave as bullet
                output.append(f"- {item}")
            else:
                # Regular text
                output.append(f"- {item}")
    
    return '\n'.join(output)


def process_all():
    """Process all modul files."""
    path = r'dataBank'
    files = [f for f in os.listdir(path) if f.startswith('modul') and f.endswith('.json')]
    
    total_formatted = 0
    
    for filename in sorted(files):
        filepath = os.path.join(path, filename)
        try:
            with open(filepath, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
            
            formatted_count = 0
            for q in data:
                if 'explanation' in q:
                    original = q['explanation']
                    converted = convert_to_target_format(original)
                    
                    if converted != original:
                        q['explanation'] = converted
                        formatted_count += 1
            
            if formatted_count > 0:
                with open(filepath, 'w', encoding='utf-8-sig') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print(f'{filename}: {formatted_count}/{len(data)} formatted')
                total_formatted += formatted_count
            else:
                print(f'{filename}: 0/{len(data)} (already in target format or no structure)')
        
        except Exception as e:
            print(f'{filename}: ERROR - {str(e)[:60]}')
    
    print(f'\nTotal formatted: {total_formatted} questions')


if __name__ == '__main__':
    process_all()
