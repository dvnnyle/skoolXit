#!/usr/bin/env python3
"""
Comprehensive formatter: Format ALL explanation fields uniformly.

For structured explanations: Convert to proper Header: + bullets format
For plain text: Add basic structure with explanation section
"""
import json
import os
import re


def format_explanation(text):
    """Format any explanation to target format."""
    if not text:
        return text
    
    # Already properly formatted?
    if re.search(r'\n[A-Za-z][^:\n]*:\n(- |$)', text):
        return text
    
    # Clean HTML
    text = text.replace('<br><br>', '\n\n').replace('<br>', '\n')
    text = text.replace('<strong>', '**').replace('</strong>', '**')
    
    lines = text.split('\n')
    
    # Try to parse structured format
    intro_text = []
    sections = {}
    current_section = None
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        
        # Check for section headers
        is_bold_header = re.match(r'^\*\*[^*]+\*\*$', stripped)
        is_plain_header = stripped.endswith(':') and not stripped.startswith('-')
        
        if is_bold_header or is_plain_header:
            if is_bold_header:
                current_section = stripped.strip('*').strip()
            else:
                current_section = stripped.rstrip(':').strip()
            sections[current_section] = []
        elif current_section is not None:
            # In a section
            item = re.sub(r'^[•-]\s*', '', stripped) if stripped.startswith(('•', '-')) else stripped
            if item:
                sections[current_section].append(item)
        else:
            # Intro text
            if stripped:
                intro_text.append(stripped)
    
    # Build output
    output = []
    
    if sections:
        # Structured format detected
        if intro_text:
            output.extend(intro_text)
            output.append('')
        
        for i, (section_name, items) in enumerate(sections.items()):
            if i > 0:
                output.append('')
            output.append(f"{section_name}:")
            
            for item in items:
                if item.startswith('- **'):
                    output.append(item)
                elif ':' in item and not item.startswith('**'):
                    parts = item.split(':', 1)
                    label = parts[0].strip().replace('**', '').strip()
                    desc = parts[1].strip()
                    output.append(f"- **{label}:** {desc}")
                else:
                    output.append(f"- {item}")
        
        return '\n'.join(output)
    else:
        # Plain text format - create basic structure
        # Join intro text and wrap in explanation section
        if intro_text:
            output.append('Explanation:')
            for item in intro_text:
                output.append(f"- {item}")
            return '\n'.join(output)
        else:
            return text


def process_all():
    """Format all module files."""
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
                    formatted = format_explanation(original)
                    
                    if formatted != original:
                        q['explanation'] = formatted
                        formatted_count += 1
            
            if formatted_count > 0:
                with open(filepath, 'w', encoding='utf-8-sig') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print(f'{filename}: {formatted_count}/{len(data)} formatted')
                total_formatted += formatted_count
            else:
                print(f'{filename}: {len(data)} (unchanged)')
        
        except Exception as e:
            print(f'{filename}: ERROR - {str(e)[:60]}')
    
    print(f'\nTotal formatted: {total_formatted} questions')


if __name__ == '__main__':
    process_all()
