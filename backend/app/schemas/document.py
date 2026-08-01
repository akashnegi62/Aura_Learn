from pydantic import BaseModel, ConfigDict
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    text: str

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: str
    uploaded_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
