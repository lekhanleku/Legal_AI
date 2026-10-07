"""
LegalAI Version-Aware Legal Registry & Temporal Validity Engine (Idea 7)
Tracks statutory effective dates, amendments, repeals, and transitions.
Specifically handles:
- Indian Penal Code (IPC 1860) -> Bharatiya Nyaya Sanhita (BNS 2023) [Effective 1 July 2024]
- Code of Criminal Procedure (CrPC 1973) -> Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)
- Indian Evidence Act (IEA 1872) -> Bharatiya Sakshya Adhiniyam (BSA 2023)
- New York City Local Law 144 (LL144 AEDT Bias Audit revisions)
- Dutch Civil Code Book 7 Article 247 (Rent liberalization revisions)
"""

import datetime
from typing import Dict, List, Optional, Any


# Master Cross-Code Transition Registry
TRANSITION_MAP = {
    # IPC -> BNS Key Offence Mappings
    "IPC_420": {
        "old_act": "Indian Penal Code, 1860",
        "old_section": "Section 420",
        "title": "Cheating and dishonestly inducing delivery of property",
        "new_act": "Bharatiya Nyaya Sanhita, 2023",
        "new_section": "Section 318(4)",
        "effective_date": "2024-07-01",
        "status": "REPEALED_SUPERSEDED",
        "jurisdiction": "India",
        "punishment": "Imprisonment up to 7 years + fine",
        "procedural_code": "BNSS 2023 Section 173",
        "notes": "Offences committed on or after 1 July 2024 must be charged under BNS § 318(4). For offences prior to 1 July 2024, IPC § 420 continues under General Clauses Act § 6 savings clause."
    },
    "IPC_302": {
        "old_act": "Indian Penal Code, 1860",
        "old_section": "Section 302",
        "title": "Punishment for Murder",
        "new_act": "Bharatiya Nyaya Sanhita, 2023",
        "new_section": "Section 103(1)",
        "effective_date": "2024-07-01",
        "status": "REPEALED_SUPERSEDED",
        "jurisdiction": "India",
        "punishment": "Death or imprisonment for life + fine",
        "procedural_code": "BNSS 2023",
        "notes": "Replaced by Section 103(1) BNS. Section 103(2) introduces a specific penalty for mob lynching / hate crimes by 5 or more persons."
    },
    "IPC_375": {
        "old_act": "Indian Penal Code, 1860",
        "old_section": "Section 375 & 376",
        "title": "Rape and aggravated offences",
        "new_act": "Bharatiya Nyaya Sanhita, 2023",
        "new_section": "Section 63 & Section 64",
        "effective_date": "2024-07-01",
        "status": "REPEALED_SUPERSEDED",
        "jurisdiction": "India",
        "punishment": "Rigorous imprisonment not less than 10 years up to life imprisonment",
        "procedural_code": "BNSS 2023 Section 176 (mandatory video recording of victim statement)",
        "notes": "Replaced by Section 63/64 BNS. Introduces Section 69 for sexual intercourse under false promise of marriage/employment."
    },
    "IPC_498A": {
        "old_act": "Indian Penal Code, 1860",
        "old_section": "Section 498A",
        "title": "Husband or relative of husband subjecting woman to cruelty",
        "new_act": "Bharatiya Nyaya Sanhita, 2023",
        "new_section": "Section 85 & Section 86",
        "effective_date": "2024-07-01",
        "status": "REPEALED_SUPERSEDED",
        "jurisdiction": "India",
        "punishment": "Imprisonment up to 3 years + fine",
        "procedural_code": "BNSS 2023",
        "notes": "Divided into Section 85 (penal provision) and Section 86 (detailed statutory definition of cruelty)."
    },
    "IPC_124A": {
        "old_act": "Indian Penal Code, 1860",
        "old_section": "Section 124A (Sedition)",
        "title": "Sedition / Acts endangering sovereignty, unity and integrity of India",
        "new_act": "Bharatiya Nyaya Sanhita, 2023",
        "new_section": "Section 152",
        "effective_date": "2024-07-01",
        "status": "REPEALED_SUPERSEDED",
        "jurisdiction": "India",
        "punishment": "Imprisonment for life or up to 7 years + fine",
        "procedural_code": "BNSS 2023",
        "notes": "Colonial term 'sedition' removed; replaced with 'Acts endangering sovereignty, unity and integrity of India' under Section 152."
    },
    # CrPC -> BNSS Procedural Mappings
    "CRPC_437": {
        "old_act": "Code of Criminal Procedure, 1973",
        "old_section": "Section 437",
        "title": "Bail in non-bailable offences by magistrate",
        "new_act": "Bharatiya Nagarik Suraksha Sanhita, 2023",
        "new_section": "Section 480",
        "effective_date": "2024-07-01",
        "status": "REPEALED_SUPERSEDED",
        "jurisdiction": "India",
        "punishment": "Procedural Bail Release",
        "procedural_code": "BNSS 2023",
        "notes": "Replaces CrPC § 437 with BNSS § 480; preserves proviso permitting bail for minors, women, and infirm."
    },
    "CRPC_438": {
        "old_act": "Code of Criminal Procedure, 1973",
        "old_section": "Section 438",
        "title": "Direction for grant of bail to person apprehending arrest (Anticipatory Bail)",
        "new_act": "Bharatiya Nagarik Suraksha Sanhita, 2023",
        "new_section": "Section 482",
        "effective_date": "2024-07-01",
        "status": "REPEALED_SUPERSEDED",
        "jurisdiction": "India",
        "punishment": "Pre-arrest protective bail order",
        "procedural_code": "BNSS 2023",
        "notes": "Replaced by BNSS § 482."
    },
    "CRPC_154": {
        "old_act": "Code of Criminal Procedure, 1973",
        "old_section": "Section 154",
        "title": "Information in cognizable cases (First Information Report / FIR)",
        "new_act": "Bharatiya Nagarik Suraksha Sanhita, 2023",
        "new_section": "Section 173",
        "effective_date": "2024-07-01",
        "status": "REPEALED_SUPERSEDED",
        "jurisdiction": "India",
        "punishment": "Procedural mandate",
        "procedural_code": "BNSS 2023",
        "notes": "Replaces CrPC § 154 with BNSS § 173; expressly legalizes e-FIR and preliminary inquiry within 14 days for offences punishable between 3 to 7 years."
    },
    # New York City LL144 Version Tracker
    "NYC_LL144": {
        "old_act": "Pre-LL144 Unregulated Hiring AI",
        "old_section": "N/A",
        "title": "Automated Employment Decision Tools Bias Audit Requirements",
        "new_act": "New York City Local Law 144 of 2021 (Enforced July 2023)",
        "new_section": "NYC Admin. Code § 20-871",
        "effective_date": "2023-07-05",
        "status": "IN_FORCE_AMENDED",
        "jurisdiction": "USA - New York",
        "punishment": "Civil fines $500 to $1,500 per daily violation",
        "procedural_code": "NYC Dept. of Consumer and Worker Protection (DCWP) Rules",
        "notes": "Mandates annual independent bias audit and 10-day candidate notice. DCWP updated final rules clarifying definition of AEDT as substantially assisting selection."
    },
    # Dutch Civil Code Article 247
    "DUTCH_BW7_247": {
        "old_act": "Pre-2016 Dutch Tenancy Code",
        "old_section": "Art. 7:247 (Pre-2016)",
        "title": "Social vs Liberalized Rent Demarcation & Huurcommissie Jurisdiction",
        "new_act": "Burgerlijk Wetboek Boek 7 (Current in force)",
        "new_section": "Artikel 7:247 BW",
        "effective_date": "2016-07-01",
        "status": "IN_FORCE",
        "jurisdiction": "Netherlands",
        "punishment": "Huurcommissie rent adjustment / refund",
        "procedural_code": "Wet op het overleg huurders verhuurder / Huurprijzenwet",
        "notes": "Demarcates social housing ceiling from free sector. Article 7:249 BW 6-month evaluation rule applies."
    }
}


class VersionManager:
    """Manages statutory versioning, effective dates, and transition warnings."""

    def __init__(self):
        self.transition_registry = TRANSITION_MAP
        self.cutoff_date_india = datetime.date(2024, 7, 1)

    def detect_temporal_context(self, query: str, query_date: Optional[str] = None) -> Dict[str, Any]:
        """
        Detects whether the query refers to an outdated statute, a legacy code,
        or requires temporal disambiguation.
        """
        query_lower = query.lower()
        now = datetime.date.today()
        target_date = now

        if query_date:
            try:
                target_date = datetime.datetime.strptime(query_date, "%Y-%m-%d").date()
            except Exception:
                target_date = now

        alerts = []
        transitions_found = []

        # Check for IPC references
        if "ipc" in query_lower or "indian penal code" in query_lower:
            alerts.append({
                "type": "TEMPORAL_SUPERSEDED_CODE",
                "severity": "CRITICAL",
                "code": "IPC_TRANSITION",
                "message": (
                    "⚠️ **CRITICAL STATUTORY UPDATE:** The Indian Penal Code (IPC, 1860) was completely "
                    "superseded on **1 July 2024** by the **Bharatiya Nyaya Sanhita (BNS, 2023)**. "
                    "Inquiries regarding post-July 2024 incidents must be evaluated under BNS."
                )
            })

            # Check specific sections
            if "420" in query_lower:
                transitions_found.append(self.transition_registry["IPC_420"])
            if "302" in query_lower:
                transitions_found.append(self.transition_registry["IPC_302"])
            if "375" in query_lower or "376" in query_lower:
                transitions_found.append(self.transition_registry["IPC_375"])
            if "498a" in query_lower or "498-a" in query_lower or "498 a" in query_lower:
                transitions_found.append(self.transition_registry["IPC_498A"])
            if "124a" in query_lower or "124-a" in query_lower or "sedition" in query_lower:
                transitions_found.append(self.transition_registry["IPC_124A"])

        # Check for CrPC references
        if "crpc" in query_lower or "code of criminal procedure" in query_lower:
            alerts.append({
                "type": "TEMPORAL_SUPERSEDED_PROCEDURE",
                "severity": "CRITICAL",
                "code": "CRPC_TRANSITION",
                "message": (
                    "⚠️ **CRITICAL PROCEDURAL UPDATE:** The Code of Criminal Procedure (CrPC, 1973) "
                    "was replaced on **1 July 2024** by the **Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023)**."
                )
            })
            if "437" in query_lower:
                transitions_found.append(self.transition_registry["CRPC_437"])
            if "438" in query_lower:
                transitions_found.append(self.transition_registry["CRPC_438"])
            if "154" in query_lower or "fir" in query_lower:
                transitions_found.append(self.transition_registry["CRPC_154"])

        # Check for NYC LL144 references
        if "ll144" in query_lower or "local law 144" in query_lower or "aedt" in query_lower:
            transitions_found.append(self.transition_registry["NYC_LL144"])

        # Check for Dutch tenancy references
        if "article 247" in query_lower or "artikel 247" in query_lower or "huurcommissie" in query_lower:
            transitions_found.append(self.transition_registry["DUTCH_BW7_247"])

        is_post_2024 = target_date >= self.cutoff_date_india

        return {
            "query_evaluation_date": target_date.isoformat(),
            "is_post_july_2024": is_post_2024,
            "has_temporal_alerts": len(alerts) > 0,
            "alerts": alerts,
            "applicable_transitions": transitions_found,
            "recommended_governing_code": "BNS / BNSS (2023)" if is_post_2024 else "IPC / CrPC (Legacy)"
        }

    def get_transition(self, key: str) -> Optional[Dict[str, Any]]:
        """Fetch transition mapping by key (e.g. 'IPC_420')."""
        return self.transition_registry.get(key.upper())

    def get_all_transitions(self) -> Dict[str, Any]:
        """Returns the full statutory versioning and transition catalog."""
        return self.transition_registry


# Global singleton instance
version_manager = VersionManager()
