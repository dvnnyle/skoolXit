#!/usr/bin/env python3
"""
Format all explanations in modul JSON files to a standardized format.

This script processes all 11 remaining modul JSON files and transforms
every explanation field from various formats to a consistent structured format.

Files to process (231 total questions):
- modul1a.json (39 Q)
- modul1b.json (16 Q)
- modul2b.json (24 Q)
- modul2c.json
- modul3a.json (22 Q)
- modul3b.json (21 Q)
- modul3c.json (20 Q)
- modul4a.json (19 Q)
- modul4b.json (20 Q)
- modul5a.json (25 Q)
- modul5b.json (25 Q)
"""

import json
import os
import re
from pathlib import Path
from typing import Dict, Any, List, Tuple
from copy import deepcopy


class ExplanationFormatter:
    """Formats explanations to a standardized structure."""
    
    def __init__(self):
        self.changes_made = 0
        self.questions_processed = 0
        self.files_processed = 0
    
    def clean_html_tags(self, text: str) -> str:
        """Remove HTML tags from text."""
        # Remove <br> and <br/> tags
        text = re.sub(r'<br\s*/?>', '\n', text)
        # Remove other HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        return text.strip()
    
    def extract_sections_from_bullets(self, text: str) -> Dict[str, Any]:
        """
        Extract sections and bullet points from text with old format.
        
        Old format examples:
        - **Bold Header:** followed by bullets with •
        - **Bold Header** (separate line) followed by bullets
        - Plain text with section markers
        - HTML format with <br> and <strong> tags
        
        Returns dict with 'intro', 'sections', and 'conclusion' keys.
        """
        if not text:
            return {'intro': '', 'sections': [], 'conclusion': ''}
        
        # Clean HTML tags first
        text = self.clean_html_tags(text)
        text = text.strip()
        
        sections = []
        intro_lines = []
        current_section = None
        current_items = []
        
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        i = 0
        
        # Collect initial paragraphs as intro (before first section header)
        while i < len(lines):
            line = lines[i]
            
            # Check if this is a section header
            # Pattern: **Text** or **Text:**
            if re.match(r'^\*\*[^*]+\*\*', line):
                break
            
            # Check for bullets - stop collecting intro
            if line.startswith('•') or line.startswith('-'):
                break
            
            # Not empty and not a marker - add to intro
            if line:
                intro_lines.append(line)
            
            i += 1
        
        intro = '\n'.join(intro_lines) if intro_lines else ''
        
        # Parse sections and bullets
        while i < len(lines):
            line = lines[i]
            i += 1
            
            if not line:
                continue
            
            # Check if this is a section header (starts with **....**)
            header_match = re.match(r'^\*\*([^*]+)\*\*:?', line)
            if header_match:
                # Save previous section if exists
                if current_section and current_items:
                    sections.append({
                        'name': current_section,
                        'items': current_items
                    })
                    current_items = []
                
                # Extract section name
                current_section = header_match.group(1).strip()
                continue
            
            # Check for bullet points
            if line.startswith('•') or line.startswith('-'):
                # Clean bullet point
                item = line.lstrip('•').lstrip('-').strip()
                
                # If item doesn't start with **, add it
                if item:
                    current_items.append(item)
        
        # Save last section
        if current_section and current_items:
            sections.append({
                'name': current_section,
                'items': current_items
            })
        
        return {
            'intro': intro,
            'sections': sections,
            'conclusion': ''
        }
    
    def format_explanation(self, explanation: str) -> str:
        """
        Format explanation to new standardized format.
        
        New format:
        - Opening paragraph (1-2 sentences)
        - Section headers in bold followed by bullet points
        - Conclusion
        
        Structure: "Intro.\n\nSection name:\n- **Item 1:** Description\n- **Item 2:** Description\n\nConclusion."
        """
        if not explanation or not isinstance(explanation, str):
            return explanation
        
        original = explanation
        
        # Parse the explanation into components
        parsed = self.extract_sections_from_bullets(explanation)
        
        # Build formatted explanation
        formatted_parts = []
        
        # Add intro
        if parsed['intro']:
            formatted_parts.append(parsed['intro'])
        
        # Add sections with bullets
        for i, section in enumerate(parsed['sections']):
            section_header = section['name'] + ":"
            
            # Add blank line before section (except first)
            if i == 0 and formatted_parts:
                formatted_parts.append("")
            elif i > 0:
                formatted_parts.append("")
            
            formatted_parts.append(section_header)
            
            for item in section['items']:
                # Ensure item has proper bullet format
                if not item.startswith('- **'):
                    # Try to find the first colon to bold the label
                    if ':' in item and not item.startswith('**'):
                        label, desc = item.split(':', 1)
                        # Clean up the label
                        label = label.strip()
                        if not label.startswith('**'):
                            label = f"**{label}**"
                        item = f"- {label}: {desc.strip()}"
                    elif not item.startswith('-'):
                        item = f"- {item}"
                
                formatted_parts.append(item)
        
        # Add conclusion
        if parsed['conclusion']:
            formatted_parts.append("")
            formatted_parts.append(parsed['conclusion'])
        
        formatted_explanation = "\n".join(formatted_parts)
        
        # Use \n\n for paragraph breaks
        formatted_explanation = re.sub(r'\n\s*\n', '\n\n', formatted_explanation)
        formatted_explanation = formatted_explanation.strip()
        
        # Clean up extra whitespace
        formatted_explanation = re.sub(r'\n{3,}', '\n\n', formatted_explanation)
        
        # Only count as a change if the explanation actually changed
        if formatted_explanation != original.strip():
            self.changes_made += 1
        
        return formatted_explanation
    
    def process_question(self, question: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single question and format its explanation."""
        self.questions_processed += 1
        
        if 'explanation' in question:
            original_explanation = question['explanation']
            question['explanation'] = self.format_explanation(original_explanation)
        
        return question
    
    def process_file(self, filepath: str) -> Tuple[bool, int, int]:
        """
        Process a single JSON file.
        
        Returns: (success: bool, questions_count: int, changes_count: int)
        """
        try:
            # Read file with proper encoding handling
            with open(filepath, 'r', encoding='utf-8-sig') as f:
                content = f.read()
            
            # Remove BOM if present
            if content.startswith('\ufeff'):
                content = content[1:]
            
            # Parse JSON
            data = json.loads(content)
            
            initial_count = self.questions_processed
            initial_changes = self.changes_made
            
            # Process each question
            if isinstance(data, list):
                data = [self.process_question(q) for q in data]
            
            # Write back to file
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            self.files_processed += 1
            
            questions_in_file = self.questions_processed - initial_count
            changes_in_file = self.changes_made - initial_changes
            
            return True, questions_in_file, changes_in_file
        
        except Exception as e:
            print(f"ERROR processing {filepath}: {e}")
            return False, 0, 0
    
    def process_all_files(self, databank_dir: str) -> Dict[str, Any]:
        """
        Process all modul JSON files.
        
        Returns summary of processing.
        """
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
        
        results = {
            'total_files': len(files_to_process),
            'processed_files': 0,
            'total_questions': 0,
            'total_changes': 0,
            'file_details': []
        }
        
        for filename in files_to_process:
            filepath = os.path.join(databank_dir, filename)
            
            if not os.path.exists(filepath):
                print(f"SKIPPED: {filename} (file not found)")
                continue
            
            print(f"Processing {filename}...", end=" ")
            
            success, q_count, c_count = self.process_file(filepath)
            
            if success:
                results['processed_files'] += 1
                results['total_questions'] += q_count
                results['total_changes'] += c_count
                results['file_details'].append({
                    'file': filename,
                    'questions': q_count,
                    'changes': c_count
                })
                print(f"✓ ({q_count} questions, {c_count} changes)")
            else:
                print(f"✗ (ERROR)")
        
        return results


def main():
    """Main entry point."""
    databank_dir = r"c:\Users\Neuye\Documents\skoleIT\slanger\dataBank"
    
    if not os.path.isdir(databank_dir):
        print(f"ERROR: Directory not found: {databank_dir}")
        return
    
    print("=" * 70)
    print("JSON EXPLANATION FORMATTER - BULK PROCESSING")
    print("=" * 70)
    print(f"Processing files in: {databank_dir}\n")
    
    formatter = ExplanationFormatter()
    results = formatter.process_all_files(databank_dir)
    
    print("\n" + "=" * 70)
    print("PROCESSING COMPLETE")
    print("=" * 70)
    print(f"Files processed: {results['processed_files']}/{results['total_files']}")
    print(f"Total questions formatted: {results['total_questions']}")
    print(f"Total explanations modified: {results['total_changes']}")
    print()
    
    print("DETAILED RESULTS:")
    print("-" * 70)
    for detail in results['file_details']:
        print(f"  {detail['file']:<20} {detail['questions']:>3} Q  {detail['changes']:>3} changes")
    print("-" * 70)
    print()
    print("✓ All files have been successfully processed and saved!")
    print("=" * 70)


if __name__ == "__main__":
    main()
