#!/usr/bin/env python3
import sys
import json
import os
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage

async def review_code(code, language):
    """Review code using Emergent LLM"""
    api_key = os.getenv('EMERGENT_LLM_KEY')
    
    if not api_key:
        raise ValueError("EMERGENT_LLM_KEY not found in environment")
    
    system_prompt = """You are an expert code reviewer and mentor. Analyze the provided code and return a comprehensive review in JSON format with the following structure:
{
  "summary": "Brief overview of what the code does",
  "bugs": ["List of bugs or potential issues"],
  "optimizations": ["List of optimization suggestions"],
  "readability": ["List of readability improvements"],
  "refactored": "Complete refactored version of the code with improvements",
  "explanation": "Detailed mentor-style explanation of key concepts and improvements",
  "qualityScore": 8
}

Be thorough, constructive, and educational. Focus on teaching best practices. IMPORTANT: Return ONLY the JSON object, no other text."""
    
    user_prompt = f"""Please review this {language} code:

{code}

Provide a comprehensive code review following the JSON structure specified."""
    
    try:
        # Create chat instance
        chat = LlmChat(
            api_key=api_key,
            session_id=f"review_{hash(code)}",
            system_message=system_prompt
        )
        
        # Use OpenAI GPT-4o model
        chat.with_model("openai", "gpt-4o")
        
        # Send message (await it since it's async)
        user_message = UserMessage(text=user_prompt)
        response = await chat.send_message(user_message)
        
        # Parse response
        try:
            # Clean response if it has markdown
            clean_response = response.strip()
            if clean_response.startswith('```json'):
                clean_response = clean_response[7:]
            if clean_response.startswith('```'):
                clean_response = clean_response[3:]
            if clean_response.endswith('```'):
                clean_response = clean_response[:-3]
            clean_response = clean_response.strip()
            
            review_data = json.loads(clean_response)
            return review_data
        except json.JSONDecodeError:
            # If parsing fails, create structured response
            return {
                "summary": "Code review completed",
                "bugs": [],
                "optimizations": [],
                "readability": [],
                "refactored": code,
                "explanation": response,
                "qualityScore": 5
            }
    
    except Exception as e:
        raise Exception(f"Error reviewing code: {str(e)}")

async def main():
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        code = input_data.get('code')
        language = input_data.get('language')
        
        if not code or not language:
            print(json.dumps({"error": "Code and language are required"}))
            sys.exit(1)
        
        # Review code
        result = await review_code(code, language)
        
        # Output result as JSON
        print(json.dumps(result))
        sys.exit(0)
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
