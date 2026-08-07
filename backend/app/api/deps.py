from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

security = HTTPBearer(auto_error=False)

def get_supabase_client() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> Optional[str]:
    """
    Extracts the Supabase user_id from the JWT token.
    Returns None if no token is provided (anonymous user).
    """
    if not credentials:
        return None
        
    token = credentials.credentials
    supabase = get_supabase_client()
    
    try:
        # Verify the JWT using Supabase
        user = supabase.auth.get_user(token)
        if user and user.user:
            return user.user.id
    except Exception:
        # Invalid token
        return None
        
    return None

async def require_current_user(
    user_id: Optional[str] = Depends(get_current_user)
) -> str:
    """
    Strict dependency that requires an authenticated user.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user_id
