Critically audit the provided IMPLEMENTATION_PLAN.md to ensure it provides a viable, low-risk, and verifiable path to delivery. Evaluate the plan against the following criteria:

   1. Phase Granularity: Is each phase focused on exactly one primary goal? Identify any "hidden" deliverables that would make a phase too large for a single review cycle.
   2. Logical Sequencing: Are dependencies handled correctly? Verify that foundational logic (data structures/state management) is established and tested before UI/UX layers are built upon them.
   3. Risk Isolation: Are high-complexity items—such as recursive expansion logic, first-click safety, or state transitions—isolated or prioritized early enough to prevent late-stage architectural rework?
   4. Verification & Exit Criteria: Are the 'Tests and checks to run' and 'Exit criteria' binary and verifiable? Check for vague language like "ensure it works" and replace with specific behavioral expectations or test patterns.
   5. Requirement Traceability: Does the plan map 1:1 to the REQUIREMENTS.md? Flag any missing features or potential scope creep not supported by the core requirements.
   6. Delivery Strategy: Evaluate the choice of vertical slices versus layering. Does the strategy minimize the "integration tax" at the end of the project?
   7. Operational Integrity: Ensure the 'Review check' gates are strict enough to prevent technical debt or "mostly finished" tasks from moving to DONE.md.

  Identify specific gaps, logical contradictions, or missing file patterns that could stall execution, and suggest concrete adjustments to improve the plan's robustness.
