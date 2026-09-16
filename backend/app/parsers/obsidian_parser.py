import os
import re
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field


@dataclass
class VaultNote:
    file_path: str
    relative_path: str
    folder: str
    slug: str
    title: str
    frontmatter: Dict[str, Any] = field(default_factory=dict)
    summary: str = ""
    content: str = ""
    sections: Dict[str, str] = field(default_factory=dict)
    wikilinks: List[str] = field(default_factory=list)
    code_snippets: List[Dict[str, str]] = field(default_factory=list)
    difficulty: str = "easy"
    level: str = "beginner"
    tags: List[str] = field(default_factory=list)


class ObsidianVaultParser:
    """Parses an Obsidian Vault directory into structured knowledge objects."""

    FRONTMATTER_PATTERN = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
    WIKILINK_PATTERN = re.compile(r"\[\[([^\|\]]+)(?:\|([^\]]+))?\]\]")
    CODEBLOCK_PATTERN = re.compile(r"```([a-zA-Z0-9_-]*)\s*\n(.*?)\n```", re.DOTALL)
    SECTION_HEADER_PATTERN = re.compile(r"^(#{1,6})\s+(.+)$", re.MULTILINE)

    @classmethod
    def parse_frontmatter(cls, raw_yaml: str) -> Dict[str, Any]:
        """Simple, robust YAML parser for note frontmatter."""
        data: Dict[str, Any] = {}
        lines = raw_yaml.strip().split("\n")
        current_list_key: Optional[str] = None

        for line in lines:
            line_str = line.strip()
            if not line_str or line_str.startswith("#"):
                continue

            if line_str.startswith("- ") and current_list_key:
                val = line_str[2:].strip().strip('"').strip("'")
                if current_list_key not in data or not isinstance(data[current_list_key], list):
                    data[current_list_key] = []
                data[current_list_key].append(val)
                continue

            if ":" in line_str:
                parts = line_str.split(":", 1)
                key = parts[0].strip()
                val = parts[1].strip().strip('"').strip("'")
                if val == "":
                    current_list_key = key
                    data[key] = []
                else:
                    current_list_key = None
                    data[key] = val

        return data

    @classmethod
    def parse_note_file(cls, file_path: str, vault_root: str) -> Optional[VaultNote]:
        """Parses a single Obsidian Markdown note into a VaultNote dataclass."""
        if not file_path.endswith(".md"):
            return None

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                raw_text = f.read()
        except Exception:
            return None

        rel_path = os.path.relpath(file_path, vault_root).replace("\\", "/")
        folder_parts = rel_path.split("/")
        folder = folder_parts[0] if len(folder_parts) > 1 else "Root"

        # Extract Frontmatter
        frontmatter = {}
        body = raw_text
        fm_match = cls.FRONTMATTER_PATTERN.match(raw_text)
        if fm_match:
            frontmatter = cls.parse_frontmatter(fm_match.group(1))
            body = raw_text[fm_match.end():]

        # Extract Title
        title_match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
        if title_match:
            title = title_match.group(1).strip()
        else:
            base_name = os.path.basename(file_path)
            title = os.path.splitext(base_name)[0]

        # Generate slug
        slug = re.sub(r"[^a-zA-Z0-9]+", "_", title.lower()).strip("_")

        # Extract Wikilinks
        wikilinks = []
        for m in cls.WIKILINK_PATTERN.finditer(body):
            target = m.group(1).strip()
            if target not in wikilinks:
                wikilinks.append(target)

        # Extract Code Blocks
        code_snippets = []
        for m in cls.CODEBLOCK_PATTERN.finditer(body):
            lang = m.group(1).strip() or "text"
            code = m.group(2)
            code_snippets.append({"language": lang, "code": code})

        # Extract Sections
        sections = {}
        current_section = "Introduction"
        lines = body.split("\n")
        current_lines: List[str] = []

        for line in lines:
            h_match = re.match(r"^##\s+(.+)$", line)
            if h_match:
                if current_lines:
                    sections[current_section] = "\n".join(current_lines).strip()
                    current_lines = []
                current_section = h_match.group(1).strip()
            else:
                current_lines.append(line)
        if current_lines:
            sections[current_section] = "\n".join(current_lines).strip()

        # Summary extraction (Definition or first paragraph)
        summary = ""
        if "Definition" in sections:
            summary = sections["Definition"]
        elif "Intuition" in sections:
            summary = sections["Intuition"]
        elif "Introduction" in sections:
            summary = sections["Introduction"]

        summary = re.sub(r"\[\[([^\|\]]+)(?:\|([^\]]+))?\]\]", r"\1", summary)
        summary = summary[:500].strip()

        difficulty = str(frontmatter.get("difficulty", "easy")).lower()
        level = str(frontmatter.get("level", "beginner")).lower()
        tags = frontmatter.get("tags", [])
        if isinstance(tags, str):
            tags = [tags]

        return VaultNote(
            file_path=file_path,
            relative_path=rel_path,
            folder=folder,
            slug=slug,
            title=title,
            frontmatter=frontmatter,
            summary=summary,
            content=body,
            sections=sections,
            wikilinks=wikilinks,
            code_snippets=code_snippets,
            difficulty=difficulty,
            level=level,
            tags=tags
        )

    @classmethod
    def scan_vault(cls, vault_root: str) -> List[VaultNote]:
        """Scans the entire Obsidian vault directory and returns all parsed notes."""
        notes: List[VaultNote] = []
        if not os.path.isdir(vault_root):
            return notes

        for root, dirs, files in os.walk(vault_root):
            # Skip hidden folders like .obsidian
            if ".obsidian" in root:
                continue
            for f in sorted(files):
                if f.endswith(".md"):
                    full_path = os.path.join(root, f)
                    note = cls.parse_note_file(full_path, vault_root)
                    if note:
                        notes.append(note)

        return notes
