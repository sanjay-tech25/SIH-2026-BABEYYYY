import asyncio
import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_root))

from app.core.database import AsyncSessionLocal
from app.services.vault_ingestion_service import VaultIngestionService


async def main():
    vault_path = os.path.join(backend_root.parent, "Quantum_Vault")
    print(f"==================================================")
    print(f"[OBSIDIAN BRAIN INGESTION] Scanning: {vault_path}")
    print(f"==================================================")

    if not os.path.exists(vault_path):
        print(f"[ERROR] Obsidian Vault path not found: {vault_path}")
        return

    async with AsyncSessionLocal() as session:
        result = await VaultIngestionService.ingest_vault(session, vault_path)
        print("\n--- INGESTION REPORT ---")
        for k, v in result.items():
            print(f"  {k}: {v}")
        print("------------------------\n")
        print("[SUCCESS] Obsidian Knowledge Brain is fully connected and ingested into the Backend database!")


if __name__ == "__main__":
    asyncio.run(main())
