from solcx import compile_standard, install_solc
import json

def compile_contract(source_code: str, contract_name: str, solc_version="0.8.25"):
    install_solc(solc_version)
    compiled = compile_standard({
        "language": "Solidity",
        "sources": {f"{contract_name}.sol": {"content": source_code}},
        "settings": {
            "outputSelection": {
                "*": {
                    "*": ["abi", "evm.bytecode"]
                }
            }
        }
    }, solc_version=solc_version)
    return compiled["contracts"][f"{contract_name}.sol"][contract_name]
