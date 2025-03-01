from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
import requests
import json
import asyncio
from flare_integration import get_flare_contract_address, get_contract_code
from compile_contract import compile_contract

app = FastAPI()

# Pydantic model for input
class SmartContractAnalysisRequest(BaseModel):
    api_key: str
    pre_traineddata_text: str
    prompt: str

@app.post("/analyze_smart_contract")
def analyze_smart_contract(req: SmartContractAnalysisRequest):
    """
    Endpoint that:
      1) Receives {api_key, pre_traineddata_text, prompt}.
      2) Manually calls OpenAI's ChatCompletion endpoint with function-calling constraints
         (no 'import openai' usage).
      3) Forces a structured security report in JSON containing a list of vulnerabilities.
      4) Returns that JSON to the client.
    """

    # Define the function schema with a list of vulnerabilities
    functions = [
        {
            "name": "analyze_smart_contract",
            "description": (
                "Analyzes a given smart contract text and returns a list of vulnerabilities. "
                "Each vulnerability contains: title, severity, description, and codeSnippet. "
                "You must return only valid JSON."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "vulnerabilities": {
                        "type": "array",
                        "description": "List of vulnerabilities found in the smart contract",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {
                                    "type": "string",
                                    "description": "The name or short title of the vulnerability"
                                },
                                "severity": {
                                    "type": "string",
                                    "description": "The severity level (high, medium, or low)"
                                },
                                "description": {
                                    "type": "string",
                                    "description": "A detailed explanation of the vulnerability"
                                },
                                "codeSnippet": {
                                    "type": "string",
                                    "description": "Example code snippet or fix for the vulnerability"
                                }
                            },
                            "required": ["title", "severity", "description", "codeSnippet"]
                        }
                    }
                },
                "required": ["vulnerabilities"]
            }
        }
    ]

    # System & user messages
    messages = [
        {
            "role": "system",
            "content": (
                "You are a security analysis assistant specialized in analyzing smart contracts. "
                "You must produce ONLY valid JSON containing a list of vulnerabilities in the key 'vulnerabilities'. "
                "Each vulnerability must include: 'title', 'severity', 'description', and 'codeSnippet'.\n\n"
                "Here is a MOCKED JSON EXAMPLE (for reference only):\n"
                "{\n"
                "  \"vulnerabilities\": [\n"
                "    {\n"
                "      \"title\": \"Reentrancy Attack\",\n"
                "      \"severity\": \"high\",\n"
                "      \"description\": \"The contract has a reentrancy vulnerability in the withdraw function...\",\n"
                "      \"codeSnippet\": \"// Safe pattern: Use checks-effects-interactions...\"\n"
                "    },\n"
                "    {\n"
                "      \"title\": \"Integer Overflow\",\n"
                "      \"severity\": \"medium\",\n"
                "      \"description\": \"Potential integer overflow in token minting process...\",\n"
                "      \"codeSnippet\": \"// Use SafeMath library or checked arithmetic...\"\n"
                "    }\n"
                "  ]\n"
                "}\n\n"
                "Return only a JSON object with this 'vulnerabilities' list. No extra keys or commentary."
            )
        },
        {
            "role": "user",
            "content": (
                f"use the following pre-trained data to analyze the smart contract: {req.pre_traineddata_text}\n\n"
                f"analyze the smart contract: {req.prompt} "
                "and return a structured security report as a JSON object containing "
                "the key 'vulnerabilities', where each item has (title, severity, description, codeSnippet)."
            )
        }
    ]

    # Build a POST request just like in your Swift code
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {req.api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-4o",  # Or "gpt-4" if you have access
        "messages": messages,
        "functions": functions,
        "function_call": {"name": "analyze_smart_contract"},  # Force the function call
        "max_tokens": 3000,
        "temperature": 0.6,
        "top_p": 0.95
    }

    # Send the request
    response = requests.post(url, headers=headers, json=payload)

    # Raise an error if something went wrong
    response.raise_for_status()

    # Parse the JSON response
    data = response.json()

    # The function call arguments come in data["choices"][0]["message"]["function_call"]["arguments"]
    arguments_str = data["choices"][0]["message"]["function_call"]["arguments"]
    # Convert the string to a Python dict
    result_dict = json.loads(arguments_str)

    # Return that JSON structure back to the client
    return result_dict

@app.get("/flare_contract_details")
def get_contract_details(contract_name: str, source: str):
    try:
        address = get_flare_contract_address(contract_name)
        bytecode = asyncio.run(get_contract_code(address))
        compiled = compile_contract(source, contract_name)
        return {
            "address": address,
            "on_chain_bytecode": bytecode.hex(),
            "compiled_bytecode": compiled["evm"]["bytecode"]["object"],
            "abi": compiled["abi"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/flare_contract")
def get_flare_contract(contract_name: str = Query(..., description="Contract name, e.g., 'WNat'")):
    address = get_flare_contract_address(contract_name)
    return {"contract_name": contract_name, "address": address}

@app.get("/")
def greet_json():
    return {"Hello": "World!"}
