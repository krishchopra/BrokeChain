import asyncio
import aiohttp
import json
from web3 import AsyncHTTPProvider, AsyncWeb3
from web3.middleware import ExtraDataToPOAMiddleware

FLARE_RPC_URL = "https://coston2-api.flare.network/ext/C/rpc"
EXPLORER_API_URL = "https://coston2-explorer.flare.network/api"
REGISTRY_ADDRESS = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019"

async def fetch_contract_abi():
    params = {
        "module": "contract",
        "action": "getabi",
        "address": REGISTRY_ADDRESS
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(EXPLORER_API_URL, params=params) as response:
            result = await response.json()
            return json.loads(result["result"])

async def query_flare_contract(contract_name: str):
    w3 = AsyncWeb3(
        AsyncHTTPProvider(FLARE_RPC_URL),
        middleware=[ExtraDataToPOAMiddleware],
    )
    abi = await fetch_contract_abi()
    registry = w3.eth.contract(
        address=w3.to_checksum_address(REGISTRY_ADDRESS),
        abi=abi
    )
    return await registry.functions.getContractAddressByName(contract_name).call()

def get_flare_contract_address(contract_name: str) -> str:
    return asyncio.run(query_flare_contract(contract_name))

async def get_contract_code(contract_address: str):
    w3 = AsyncWeb3(
        AsyncHTTPProvider(FLARE_RPC_URL),
        middleware=[ExtraDataToPOAMiddleware],
    )
    return await w3.eth.get_code(w3.to_checksum_address(contract_address))


