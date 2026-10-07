"""
LegalAI Layperson-Facing Adapter & Escalation Engine (Idea 10)
Solves the gap from the Dutch paper and AILQA:
- Complex statutory legalese confuses non-lawyers, while terse summaries lack actionability.
- Generates a Dual-Perspective Advisory:
    1. Plain-Language Actionable Summary (easy reading level, actionable checklist, jargon eliminated).
    2. Deep Statutory Analysis with "Verify This Article" attribution pills.
    3. Mandatory "When to Consult a Lawyer" Escalation Trigger with defined procedural thresholds.
"""

from typing import Dict, List, Any, Optional


class LaypersonAdapter:
    """Adapts statutory legal output for non-lawyer comprehension with confidence & escalation cues."""

    def adapt_response(
        self,
        category: str,
        expert_answer: str,
        retrieved_sources: List[Dict[str, Any]],
        confidence_percent: str,
        temporal_alert: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        primary_doc = retrieved_sources[0] if retrieved_sources else None
        citation = primary_doc.get("citation", "Statutory Rule") if primary_doc else "Applicable Law"
        preconditions = primary_doc.get("preconditions", []) if primary_doc else []
        checklist = primary_doc.get("action_checklist", []) if primary_doc else []

        # Plain language summary generator
        plain_summary = self._synthesize_plain_language(category, primary_doc, temporal_alert)

        # Escalation criteria: When must the layperson hire an attorney immediately?
        escalation_rule = self._determine_escalation_triggers(category, primary_doc)

        return {
            "layperson_mode": True,
            "plain_language_summary": plain_summary,
            "confidence_display": {
                "score_percent": confidence_percent,
                "label": "High Confidence Match" if float(confidence_percent.replace("%", "")) >= 80 else "Moderate Match",
                "verification_cta": f"Verify This Article: {citation}",
                "primary_citation": citation
            },
            "when_to_consult_lawyer": escalation_rule,
            "plain_action_steps": checklist[:3] if checklist else [
                "Preserve all written notices, messages, and receipts in a secure folder.",
                "Do not make oral commitments or sign waivers without legal counsel.",
                "Consult a licensed attorney before missing statutory deadlines."
            ]
        }

    def _synthesize_plain_language(
        self,
        category: str,
        doc: Optional[Dict[str, Any]],
        temporal_alert: Optional[Dict[str, Any]]
    ) -> str:
        if not doc:
            return "Based on the information provided, your situation involves legal rules that require strict compliance with deadlines and written evidence."

        title = doc.get("title", "")
        domain = doc.get("domain", category)

        summary_parts = [
            f"Here is what this means in plain language for your **{domain}** issue:",
            f"Under **{doc.get('citation', '')}**, you have specific rights that protect you."
        ]

        if temporal_alert and temporal_alert.get("has_temporal_alerts"):
            summary_parts.append(
                "⚡ **Important Law Update:** Indian criminal laws changed on July 1, 2024. "
                "Old IPC sections have been replaced by new BNS sections."
            )

        if doc.get("preconditions"):
            summary_parts.append(
                f"However, to use this right, you must satisfy key conditions: "
                f"**{doc['preconditions'][0]}**."
            )

        summary_parts.append(
            "Below, you can toggle between this simplified summary and the exact statutory section text."
        )

        return " ".join(summary_parts)

    def _determine_escalation_triggers(self, category: str, doc: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Provides unambiguous criteria for when a layperson CANNOT handle the case alone."""
        triggers = {
            "Criminal Law": [
                "You have been arrested or summoned for police interrogation",
                "An FIR has been registered or a warrant has been issued",
                "Facing non-bailable allegations or risk of custodial remand"
            ],
            "Tenant Law": [
                "You have received a formal Court Summons / Notice to Quit",
                "Landlord filed an Unlawful Detainer lawsuit with a hearing date",
                "Damages exceed small claims court statutory limits ($10,000)"
            ],
            "Employment Law": [
                "Employer has given you a Severance Release with a 21-day signature deadline",
                "EEOC Right-to-Sue letter received (strict 90-day federal filing window begins)",
                "Retaliation or whistleblower termination involving substantial lost earnings"
            ],
            "Corporate Law": [
                "Substantial founder dispute involving equity dilution or IP ownership",
                "Formal breach of fiduciary duty or shareholder derivative demand",
                "Drafting custom commercial contracts or venture capital term sheets"
            ]
        }

        default_triggers = [
            "Formal court pleadings or summons have been served upon you",
            "Statutory notice deadline expires within 14 calendar days",
            "Disputed financial harm exceeds small claims jurisdictional limits"
        ]

        active_triggers = triggers.get(category, default_triggers)

        return {
            "must_escalate_immediately": True,
            "escalation_title": f"⚠️ Mandatory Legal Escalation Triggers for {category}",
            "triggers": active_triggers,
            "recommendation": "Do NOT represent yourself if any of the above conditions apply. Use the matched attorney card to schedule an expedited consultation."
        }


layperson_adapter = LaypersonAdapter()
