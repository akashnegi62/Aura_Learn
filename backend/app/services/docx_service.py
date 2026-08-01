from docx import Document
import io

def extract_text_from_docx(file_bytes: bytes) -> str:
    """
    Extracts text from a DOCX file in memory using python-docx.
    """
    text = ""
    try:
        doc = Document(io.BytesIO(file_bytes))
        for para in doc.paragraphs:
            if para.text.strip():
                text += para.text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to process DOCX: {str(e)}")
    
    return text.strip()
