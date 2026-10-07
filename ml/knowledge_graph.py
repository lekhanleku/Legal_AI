"""
LegalAI Statute Knowledge Graph for Preconditions & Cross-References (Idea 4)
Uses NetworkX to build a directed statutory graph:
- Triples: (action, requires_condition, condition), (article, exception_to, article),
           (action, has_statutory_basis, section), (section, cross_references, section),
           (new_section, supersedes, old_section).
- Returns structured condition checklists and exception chains for multi-step reasoning.
"""

import networkx as nx
from typing import Dict, List, Any, Optional


class LegalKnowledgeGraph:
    """Directed graph representing statutory prerequisites, exceptions, and inter-law cross references."""

    def __init__(self):
        self.graph = nx.DiGraph()
        self._build_default_graph()

    def _build_default_graph(self):
        """Constructs statutory knowledge graph covering key legal doctrines."""
        G = self.graph

        # =========================================================================
        # 1. CRIMINAL LAW: CHEATING & FRAUD (BNS § 318(4) & IPC § 420)
        # =========================================================================
        G.add_node("action:prosecute_cheating_bns", type="action", label="Prosecute / File Charge for Cheating (BNS § 318(4))")
        G.add_node("statute:bns_318_4", type="statute", label="Bharatiya Nyaya Sanhita § 318(4)", act="BNS", jurisdiction="India")
        G.add_node("statute:ipc_420", type="statute", label="Indian Penal Code § 420 (Legacy)", act="IPC", jurisdiction="India")
        G.add_node("condition:deception_at_inception", type="precondition", label="Fraudulent or dishonest intent existed at inception of promise")
        G.add_node("condition:delivery_of_property", type="precondition", label="Complainant delivered property induced by fraudulent deception")
        G.add_node("exception:civil_breach_of_contract", type="exception", label="Mere subsequent inability to pay / pure commercial breach of contract")

        G.add_edge("action:prosecute_cheating_bns", "statute:bns_318_4", relation="governed_by")
        G.add_edge("action:prosecute_cheating_bns", "condition:deception_at_inception", relation="requires_condition")
        G.add_edge("action:prosecute_cheating_bns", "condition:delivery_of_property", relation="requires_condition")
        G.add_edge("exception:civil_breach_of_contract", "action:prosecute_cheating_bns", relation="exception_to")
        G.add_edge("statute:bns_318_4", "statute:ipc_420", relation="supersedes", effective_date="2024-07-01")

        # Procedural cross-reference
        G.add_node("statute:bnss_173", type="statute", label="BNSS § 173 (Registration of FIR / e-FIR)", act="BNSS")
        G.add_edge("statute:bns_318_4", "statute:bnss_173", relation="cross_references")

        # =========================================================================
        # 2. CRIMINAL PROCEDURE: ANTICIPATORY BAIL (BNSS § 482)
        # =========================================================================
        G.add_node("action:seek_anticipatory_bail", type="action", label="Seek Anticipatory (Pre-Arrest) Protective Bail")
        G.add_node("statute:bnss_482", type="statute", label="BNSS § 482 (Anticipatory Bail)", act="BNSS", jurisdiction="India")
        G.add_node("condition:apprehension_of_arrest", type="precondition", label="Reasonable grounds to apprehend arrest on accusation of non-bailable offence")
        G.add_node("condition:join_investigation", type="precondition", label="Undertaking to make oneself available for interrogation as required")
        G.add_node("condition:surrender_passport", type="precondition", label="Surrender travel documents / not leave India without court leave")
        G.add_node("exception:humanitarian_bail_proviso", type="exception", label="Special humanitarian discretion for women, minors under 16, or sick/infirm")

        G.add_edge("action:seek_anticipatory_bail", "statute:bnss_482", relation="governed_by")
        G.add_edge("action:seek_anticipatory_bail", "condition:apprehension_of_arrest", relation="requires_condition")
        G.add_edge("action:seek_anticipatory_bail", "condition:join_investigation", relation="requires_condition")
        G.add_edge("action:seek_anticipatory_bail", "condition:surrender_passport", relation="requires_condition")
        G.add_edge("exception:humanitarian_bail_proviso", "statute:bnss_482", relation="humanitarian_exception_for")

        # =========================================================================
        # 3. TENANT LAW: WITHHOLD RENT FOR HABITABILITY (Javins / Restatement)
        # =========================================================================
        G.add_node("action:withhold_rent_habitability", type="action", label="Withhold Rent for Habitability Code Violations")
        G.add_node("statute:habitability_restatement_5_5", type="statute", label="Restatement (Second) of Property § 5.5", jurisdiction="USA")
        G.add_node("condition:substantial_code_violation", type="precondition", label="Defect materially affects health, safety, heating, water, or plumbing")
        G.add_node("condition:written_14_day_notice", type="precondition", label="Written notice served on landlord with reasonable 14-day cure window")
        G.add_node("condition:escrow_deposit", type="precondition", label="Withheld rental funds deposited into designated municipal/court escrow")
        G.add_node("exception:tenant_caused_damage", type="exception", label="Damage caused by tenant's own willful acts, abuse, or unauthorized alterations")

        G.add_edge("action:withhold_rent_habitability", "statute:habitability_restatement_5_5", relation="governed_by")
        G.add_edge("action:withhold_rent_habitability", "condition:substantial_code_violation", relation="requires_condition")
        G.add_edge("action:withhold_rent_habitability", "condition:written_14_day_notice", relation="requires_condition")
        G.add_edge("action:withhold_rent_habitability", "condition:escrow_deposit", relation="requires_condition")
        G.add_edge("exception:tenant_caused_damage", "action:withhold_rent_habitability", relation="exception_to")

        # =========================================================================
        # 4. TENANT LAW: SECURITY DEPOSIT TREBLE DAMAGES (Cal Civ § 1950.5 / URLTA)
        # =========================================================================
        G.add_node("action:claim_deposit_penalty", type="action", label="Claim Statutory Penalty / Treble Damages for Unreturned Deposit")
        G.add_node("statute:cal_civ_1950_5", type="statute", label="Cal. Civ. Code § 1950.5 / URLTA § 2.101", jurisdiction="USA")
        G.add_node("condition:vacated_and_surrendered", type="precondition", label="Tenant vacated premises and formally returned keys/possession")
        G.add_node("condition:statutory_deadline_expired", type="precondition", label="Statutory return window (21 days) expired without return or accounting")
        G.add_node("condition:bad_faith_retention", type="precondition", label="Landlord acted in bad faith or made fraudulent itemized deductions")
        G.add_node("exception:ordinary_wear_and_tear", type="exception", label="Deductions for normal wear and tear are strictly prohibited by law")

        G.add_edge("action:claim_deposit_penalty", "statute:cal_civ_1950_5", relation="governed_by")
        G.add_edge("action:claim_deposit_penalty", "condition:vacated_and_surrendered", relation="requires_condition")
        G.add_edge("action:claim_deposit_penalty", "condition:statutory_deadline_expired", relation="requires_condition")
        G.add_edge("action:claim_deposit_penalty", "condition:bad_faith_retention", relation="requires_condition")
        G.add_edge("exception:ordinary_wear_and_tear", "statute:cal_civ_1950_5", relation="statutory_exception_for")

        # =========================================================================
        # 5. DUTCH TENANCY: HUURCOMMISSIE RENT REDUCTION (Art. 7:247 & 7:249 BW)
        # =========================================================================
        G.add_node("action:dutch_huurcommissie_petition", type="action", label="Petition Huurcommissie (Rent Tribunal) to Lower Rent")
        G.add_node("statute:dutch_art_7_247", type="statute", label="Burgerlijk Wetboek Boek 7, Art. 247", jurisdiction="Netherlands")
        G.add_node("statute:dutch_art_7_249", type="statute", label="Burgerlijk Wetboek Boek 7, Art. 249", jurisdiction="Netherlands")
        G.add_node("condition:within_6_months_lease_start", type="precondition", label="Petition submitted strictly within 6 months of lease commencement date")
        G.add_node("condition:wws_points_below_ceiling", type="precondition", label="Woningwaarderingsstelsel (WWS) quality points calculate below agreed rent")
        G.add_node("exception:liberalized_exemption_after_6mo", type="exception", label="After 6 months, liberalized tenancy (vrije sector) cannot be challenged at tribunal")

        G.add_edge("action:dutch_huurcommissie_petition", "statute:dutch_art_7_247", relation="governed_by")
        G.add_edge("statute:dutch_art_7_247", "statute:dutch_art_7_249", relation="cross_references")
        G.add_edge("action:dutch_huurcommissie_petition", "condition:within_6_months_lease_start", relation="requires_condition")
        G.add_edge("action:dutch_huurcommissie_petition", "condition:wws_points_below_ceiling", relation="requires_condition")
        G.add_edge("exception:liberalized_exemption_after_6mo", "action:dutch_huurcommissie_petition", relation="exception_to")

        # =========================================================================
        # 6. EMPLOYMENT / AI: NYC LOCAL LAW 144 AEDT COMPLIANCE
        # =========================================================================
        G.add_node("action:deploy_hiring_ai_nyc", type="action", label="Deploy AI Screening / Automated Decision Tool in NYC Hiring")
        G.add_node("statute:nyc_ll144", type="statute", label="NYC Admin. Code § 20-871 (LL144)", jurisdiction="USA - New York")
        G.add_node("condition:annual_independent_bias_audit", type="precondition", label="Independent third-party bias audit completed within prior 365 days")
        G.add_node("condition:public_audit_summary_posted", type="precondition", label="Summary of bias audit impact ratios published publicly on careers website")
        G.add_node("condition:ten_day_applicant_notice", type="precondition", label="10 business days advance written notice provided to NYC applicant")
        G.add_node("exception:purely_clerical_tools", type="exception", label="Tools performing purely administrative/clerical tasks without scoring or filtering")

        G.add_edge("action:deploy_hiring_ai_nyc", "statute:nyc_ll144", relation="governed_by")
        G.add_edge("action:deploy_hiring_ai_nyc", "condition:annual_independent_bias_audit", relation="requires_condition")
        G.add_edge("action:deploy_hiring_ai_nyc", "condition:public_audit_summary_posted", relation="requires_condition")
        G.add_edge("action:deploy_hiring_ai_nyc", "condition:ten_day_applicant_notice", relation="requires_condition")
        G.add_edge("exception:purely_clerical_tools", "action:deploy_hiring_ai_nyc", relation="exception_to")

        # =========================================================================
        # 7. FAMILY LAW: CHILD CUSTODY & TERMINATION / MODIFICATION
        # =========================================================================
        G.add_node("action:modify_child_custody", type="action", label="Petition Court to Modify Legal / Physical Custody")
        G.add_node("statute:umda_402_custody", type="statute", label="Uniform Marriage and Divorce Act § 402", jurisdiction="USA")
        G.add_node("condition:substantial_change_circumstances", type="precondition", label="Material and substantial change in parental circumstances since prior decree")
        G.add_node("condition:best_interests_standard", type="precondition", label="Proposed modification directly advances the 'best interests of the child'")
        G.add_node("condition:stable_emotional_environment", type="precondition", label="Proof of continuous emotional stability and suitable home environment")
        G.add_node("exception:unfit_parent_domestic_violence", type="exception", label="Presumption against custody for parent with documented domestic abuse history")

        G.add_edge("action:modify_child_custody", "statute:umda_402_custody", relation="governed_by")
        G.add_edge("action:modify_child_custody", "condition:substantial_change_circumstances", relation="requires_condition")
        G.add_edge("action:modify_child_custody", "condition:best_interests_standard", relation="requires_condition")
        G.add_edge("action:modify_child_custody", "condition:stable_emotional_environment", relation="requires_condition")
        G.add_edge("exception:unfit_parent_domestic_violence", "action:modify_child_custody", relation="exception_to")

        # =========================================================================
        # 8. CONSTITUTIONAL LAW: SUPPRESSION OF STATEMENTS (MIRANDA)
        # =========================================================================
        G.add_node("action:suppress_custodial_statement", type="action", label="Suppress Interrogation Statements Under 5th Amendment")
        G.add_node("statute:const_amend_5_miranda", type="statute", label="U.S. Const. Amend. V / Miranda Doctrine", jurisdiction="USA")
        G.add_node("condition:in_custody", type="precondition", label="Defendant was in formal police custody (not free to terminate encounter)")
        G.add_node("condition:law_enforcement_interrogation", type="precondition", label="Police conducted express questioning or functional equivalent")
        G.add_node("condition:absence_of_valid_waiver", type="precondition", label="No knowing, voluntary, and intelligent waiver given prior to questioning")
        G.add_node("exception:public_safety_quarles", type="exception", label="Public safety exception for immediate unwarned questions about weapon location")
        G.add_node("exception:impeachment_use", type="exception", label="Statements voluntary in fact may be used solely for impeachment if defendant testifies")

        G.add_edge("action:suppress_custodial_statement", "statute:const_amend_5_miranda", relation="governed_by")
        G.add_edge("action:suppress_custodial_statement", "condition:in_custody", relation="requires_condition")
        G.add_edge("action:suppress_custodial_statement", "condition:law_enforcement_interrogation", relation="requires_condition")
        G.add_edge("action:suppress_custodial_statement", "condition:absence_of_valid_waiver", relation="requires_condition")
        G.add_edge("exception:public_safety_quarles", "action:suppress_custodial_statement", relation="exception_to")
        G.add_edge("exception:impeachment_use", "action:suppress_custodial_statement", relation="exception_to")

    def query_preconditions(self, query: str) -> Dict[str, Any]:
        """
        Extracts relevant legal actions and returns a structured checklist of mandatory preconditions
        and attached exception chains rather than unstructured prose.
        """
        query_lower = query.lower()
        matched_actions = []

        if any(w in query_lower for w in ["cheat", "fraud", "420", "318", "swindle", "funds stolen"]):
            matched_actions.append("action:prosecute_cheating_bns")
        if any(w in query_lower for w in ["bail", "anticipatory", "arrest apprehension", "482", "438"]):
            matched_actions.append("action:seek_anticipatory_bail")
        if any(w in query_lower for w in ["withhold rent", "broken heat", "habitability", "mold", "water broken"]):
            matched_actions.append("action:withhold_rent_habitability")
        if any(w in query_lower for w in ["security deposit", "deposit return", "landlord kept deposit", "treble damages"]):
            matched_actions.append("action:claim_deposit_penalty")
        if any(w in query_lower for w in ["huurcommissie", "dutch rent", "art 247", "article 247", "netherlands rent", "liberalis"]):
            matched_actions.append("action:dutch_huurcommissie_petition")
        if any(w in query_lower for w in ["ll144", "aedt", "bias audit", "hiring ai", "algorithmic screening"]):
            matched_actions.append("action:deploy_hiring_ai_nyc")
        if any(w in query_lower for w in ["custody", "visitation", "child", "terminate custody", "modify custody"]):
            matched_actions.append("action:modify_child_custody")
        if any(w in query_lower for w in ["miranda", "remain silent", "interrogation", "suppress statement", "police question"]):
            matched_actions.append("action:suppress_custodial_statement")

        results = []
        for action_node in matched_actions:
            action_data = self.graph.nodes.get(action_node, {})
            label = action_data.get("label", action_node)

            # Find preconditions (out-edges with relation 'requires_condition')
            preconditions = []
            for u, v, data in self.graph.out_edges(action_node, data=True):
                if data.get("relation") == "requires_condition":
                    cond_node = self.graph.nodes.get(v, {})
                    preconditions.append({
                        "id": v,
                        "condition": cond_node.get("label", v),
                        "mandatory": True
                    })

            # Find governing statute
            statutes = []
            for u, v, data in self.graph.out_edges(action_node, data=True):
                if data.get("relation") == "governed_by":
                    stat_node = self.graph.nodes.get(v, {})
                    statutes.append({
                        "id": v,
                        "label": stat_node.get("label", v),
                        "jurisdiction": stat_node.get("jurisdiction", "General")
                    })

            # Find exceptions (in-edges with relation 'exception_to')
            exceptions = []
            for u, v, data in self.graph.in_edges(action_node, data=True):
                if data.get("relation") == "exception_to":
                    exc_node = self.graph.nodes.get(u, {})
                    exceptions.append({
                        "id": u,
                        "exception": exc_node.get("label", u)
                    })

            results.append({
                "action_id": action_node,
                "action_label": label,
                "governing_statutes": statutes,
                "mandatory_preconditions": preconditions,
                "statutory_exceptions": exceptions
            })

        return {
            "has_graph_matches": len(results) > 0,
            "actions_identified": len(results),
            "checklists": results
        }

    def export_graph_summary(self) -> Dict[str, Any]:
        """Exports graph topology metrics for the evaluation report and UI visualizer."""
        return {
            "node_count": self.graph.number_of_nodes(),
            "edge_count": self.graph.number_of_edges(),
            "nodes": [
                {"id": n, "type": d.get("type", "node"), "label": d.get("label", n)}
                for n, d in self.graph.nodes(data=True)
            ],
            "edges": [
                {"source": u, "target": v, "relation": d.get("relation", "linked")}
                for u, v, d in self.graph.edges(data=True)
            ]
        }


legal_kg = LegalKnowledgeGraph()
