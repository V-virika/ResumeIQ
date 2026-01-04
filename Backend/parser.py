import sys
import json
import re
import PyPDF2

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ''
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
    except Exception as e:
        return f"Error extracting text: {str(e)}"

def extract_email(text):
    """Extract email addresses"""
    # Look for standard email patterns
    email_pattern = r'\b[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'
    emails = re.findall(email_pattern, text, re.IGNORECASE)
    
    # Also look for emails without @ (PDF extraction issue)
    broken_email_pattern = r'\b([a-zA-Z0-9][a-zA-Z0-9._%+-]*)(gmail|yahoo|outlook|hotmail|email|icloud)\.com\b'
    broken_emails = re.findall(broken_email_pattern, text, re.IGNORECASE)
    
    # Fix broken emails
    if broken_emails and not emails:
        emails = [f"{broken_emails[0][0]}@{broken_emails[0][1]}.com"]
    
    # Filter out invalid emails
    valid_emails = [e for e in emails if len(e) > 5 and '@' in e]
    return valid_emails[0] if valid_emails else "Not detected"

def extract_phone(text):
    """Extract phone numbers"""
    # Look for 10-digit numbers (Indian mobile numbers start with 6, 7, 8, or 9)
    phone_pattern = r'([6-9]\d{9})'
    phones = re.findall(phone_pattern, text)
    
    if phones:
        # Return the first valid phone number found
        return phones[0]
    
    return None

def extract_name(text):
    """Extract name - look for proper name patterns"""
    # Look for pattern: 2-4 capitalized words (name pattern)
    # This works even if name is attached to other text
    name_pattern = r'([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})'
    potential_names = re.findall(name_pattern, text)
    
    # Skip keywords
    skip_keywords = ['University', 'College', 'School', 'Academy', 'Department', 'Institute',
                     'Project', 'Simulation', 'Challenge', 'Technologies', 'Development',
                     'About', 'Skills', 'Education', 'Experience', 'Achievements', 
                     'Publications', 'Certifications', 'Participation', 'Awards',
                     'Blood Group', 'Based Blood', 'Brain Tumor', 'License Plate',
                     'Fingerprint Based', 'Vision Transformers', 'Smart Mobility',
                     'Based Classification', 'Space Apps', 'Innovation Challenge',
                     'Junior College', 'Sales Academy', 'User Segmentation']
    
    # Filter valid names
    for name in potential_names:
        name = name.strip()
        # Skip if contains skip keywords
        if any(skip.lower() in name.lower() for skip in skip_keywords):
            continue
        # Must have 2-4 words, all alphabetic
        words = name.split()
        if 2 <= len(words) <= 4 and all(w.isalpha() for w in words):
            # Prefer 3-word names first (typical full name)
            if len(words) == 3:
                return name
    
    # If no 3-word name found, return first valid 2 or 4-word name
    for name in potential_names:
        name = name.strip()
        if any(skip.lower() in name.lower() for skip in skip_keywords):
            continue
        words = name.split()
        if 2 <= len(words) <= 4 and all(w.isalpha() for w in words):
            return name
    
    return "Name not found"

def extract_skills(text):
    """Extract common skills"""
    # Common skills to look for
    skills_keywords = [
        'Python', 'Java', 'JavaScript', 'C++', 'C#', 'SQL', 'HTML', 'CSS', 
        'React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'Spring',
        'Machine Learning', 'Deep Learning', 'AI', 'Data Science', 'Analytics',
        'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
        'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
        'Communication', 'Leadership', 'Problem Solving', 'Teamwork'
    ]
    
    found_skills = []
    text_lower = text.lower()
    
    for skill in skills_keywords:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    
    return found_skills if found_skills else ['Skills not detected']

def extract_education(text):
    """Extract education information"""
    education_keywords = ['bachelor', 'master', 'phd', 'diploma', 'degree', 'university', 'college', 'b.tech', 'm.tech', 'bsc', 'msc', 'be', 'me']
    education_lines = []
    
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if any(keyword in line.lower() for keyword in education_keywords):
            education_lines.append(line.strip())
            # Get next line too if it exists
            if i + 1 < len(lines):
                education_lines.append(lines[i + 1].strip())
    
    return ' '.join(education_lines[:3]) if education_lines else 'Education not found'

def parse_resume(file_path):
    """Main parsing function"""
    text = extract_text_from_pdf(file_path)
    
    if "Error" in text:
        return {'error': text}
    
    data = {
        'name': extract_name(text),
        'email': extract_email(text),
        'mobile_number': extract_phone(text),
        'skills': extract_skills(text),
        'education': extract_education(text),
        'total_experience': 'Experience parsing not implemented',
        'raw_text': text[:500]  # First 500 chars for reference
    }
    
    return data

if __name__ == '__main__':
    file_path = sys.argv[1]
    result = parse_resume(file_path)
    print(json.dumps(result))
