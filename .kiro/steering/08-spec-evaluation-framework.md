---
name: Spec Evaluation Framework
description: Comprehensive evaluation framework for all new specs to ensure completeness, evidence-based design, and clear value delivery
inclusion: fileMatch
fileMatchPattern: "**/.kiro/specs/**/requirements.md"
priority: critical
---

# Spec Evaluation Framework

## Purpose

Establish a comprehensive evaluation framework for all new specs to ensure they are complete, evidence-based, and deliver clear value to users, product, and company. This framework prevents "black holes" in specs where vital content is missing.

## Evaluation Triggers

This framework applies to:
- **All new specs** before implementation begins
- **Major spec revisions** that change scope or approach
- **Cross-system specs** that affect multiple subsystems
- **User-facing feature specs** that impact UX/UI

## Core Evaluation Team (MANDATORY)

### The Product Trio (Always Required)
1. **Product Manager** - Business value, user needs, market fit
2. **Engineering Lead** - Technical feasibility, architecture alignment
3. **UX/UI Designer** - User experience, design consistency, accessibility

## Extended Evaluation Team (Context-Dependent)

### Technical Architecture
- **Senior System Architect** - Required for:
  - Cross-subsystem features
  - New architectural patterns
  - Performance-critical features
  - Scalability concerns

### User Experience
- **Senior UX Designer** - Required for:
  - New user workflows
  - Complex interactions
  - Accessibility requirements
  - User research validation

### Development Specialists
- **Senior Front-End Developer** - Required for:
  - UI/UX implementation specs
  - Browser compatibility concerns
  - Performance optimization
  - Accessibility implementation

- **Senior Back-End Developer** - Required for:
  - API design specs
  - Database schema changes
  - Server-side logic
  - Integration patterns

### Data & Analytics
- **Senior Data Engineer** - Required for:
  - Data pipeline specs
  - Analytics implementation
  - Data storage optimization
  - ETL processes

- **Data Analyst** - Required for:
  - Metrics definition
  - Success criteria validation
  - A/B testing design
  - User behavior analysis

### Security & Compliance
- **Senior Data Security Engineer** - Required for:
  - User data handling
  - Authentication/authorization
  - Compliance requirements (GDPR, etc.)
  - Security vulnerability assessment

### Additional Specialist Roles

- **DevOps Engineer** - Required for:
  - Deployment strategy specs
  - Infrastructure changes
  - CI/CD pipeline modifications
  - Monitoring and alerting

- **QA Engineer** - Required for:
  - Testing strategy validation
  - Quality assurance planning
  - Test automation specs
  - Performance testing requirements

- **Technical Writer** - Required for:
  - Documentation-heavy features
  - API documentation specs
  - User-facing help content
  - Developer onboarding materials

- **Accessibility Specialist** - Required for:
  - WCAG compliance features
  - Screen reader compatibility
  - Keyboard navigation specs
  - Inclusive design validation

- **Performance Engineer** - Required for:
  - Performance-critical features
  - Optimization specs
  - Load testing requirements
  - Resource usage analysis

- **Mobile Developer** - Required for:
  - Mobile-specific features
  - Cross-platform compatibility
  - Touch interaction specs
  - Mobile performance optimization

## Evaluation Criteria Framework

### 1. Business Value Assessment
**Evaluator: Product Manager**

- [ ] **Clear value proposition** - What problem does this solve?
- [ ] **User impact quantified** - How many users benefit and how?
- [ ] **Business metrics defined** - What success looks like
- [ ] **ROI justification** - Cost vs. expected benefit
- [ ] **Market validation** - Evidence of user demand
- [ ] **Competitive analysis** - How this positions us vs. competitors

### 2. Technical Feasibility Review
**Evaluator: Engineering Lead + System Architect**

- [ ] **Architecture alignment** - Fits existing system design
- [ ] **Technical debt assessment** - Impact on code quality
- [ ] **Performance implications** - Resource usage and scalability
- [ ] **Security considerations** - Vulnerability assessment
- [ ] **Integration complexity** - Dependencies and coupling
- [ ] **Maintenance burden** - Long-term support requirements

### 3. User Experience Validation
**Evaluator: UX Designer + UX Researcher**

- [ ] **User journey mapping** - Complete workflow documented
- [ ] **Usability validation** - Evidence from user testing
- [ ] **Accessibility compliance** - WCAG 2.1 AA standards met
- [ ] **Design system consistency** - Follows established patterns
- [ ] **Mobile responsiveness** - Works across device types
- [ ] **Error handling UX** - Clear error states and recovery

### 4. Implementation Completeness
**Evaluator: Technical Leads**

- [ ] **File specifications** - All files to create/modify listed
- [ ] **API contracts defined** - Input/output specifications
- [ ] **Database changes** - Schema modifications documented
- [ ] **Testing strategy** - Unit, integration, and E2E tests planned
- [ ] **Deployment plan** - Release strategy and rollback procedures
- [ ] **Monitoring setup** - Metrics and alerting defined

### 5. Quality Assurance Planning
**Evaluator: QA Engineer**

- [ ] **Test scenarios defined** - Happy path and edge cases
- [ ] **Acceptance criteria testable** - Clear pass/fail conditions
- [ ] **Performance benchmarks** - Measurable performance targets
- [ ] **Browser compatibility** - Supported browsers/versions listed
- [ ] **Regression testing** - Impact on existing features assessed
- [ ] **Load testing plan** - Scalability validation approach

### 6. Security & Compliance Review
**Evaluator: Security Engineer**

- [ ] **Data privacy assessment** - PII handling documented
- [ ] **Authentication/authorization** - Access control specified
- [ ] **Input validation** - Security measures for user input
- [ ] **Compliance requirements** - GDPR, CCPA, etc. addressed
- [ ] **Vulnerability assessment** - Security risks identified
- [ ] **Audit trail requirements** - Logging and monitoring needs

## Spec Content Requirements

### Evidence-Based Documentation
Every spec MUST include:

#### User Research Evidence
- **User interviews** - Direct quotes and insights
- **Usage analytics** - Current behavior data
- **A/B test results** - Previous experiment outcomes
- **Competitive analysis** - Market research findings
- **User feedback** - Support tickets, surveys, reviews

#### Technical Evidence
- **Performance benchmarks** - Current system metrics
- **Error rate analysis** - Existing pain points
- **Scalability projections** - Growth impact assessment
- **Technical debt assessment** - Code quality metrics
- **Integration complexity** - Dependency analysis

#### Business Evidence
- **Market opportunity** - TAM/SAM analysis
- **Revenue impact** - Financial projections
- **Cost analysis** - Development and maintenance costs
- **Risk assessment** - Technical and business risks
- **Success metrics** - KPIs and measurement plan

### Value Proposition Framework
Each spec MUST clearly articulate:

#### User Value
- **Problem statement** - What user pain point is solved
- **User benefit** - How the user's life improves
- **Usage scenarios** - When and why users will use this
- **Success metrics** - How we measure user satisfaction

#### Product Value
- **Feature differentiation** - How this improves our product
- **User engagement** - Expected impact on retention/usage
- **Product strategy alignment** - How this fits our roadmap
- **Competitive advantage** - Market positioning benefit

#### Company Value
- **Revenue impact** - Direct or indirect revenue effect
- **Cost savings** - Operational efficiency gains
- **Strategic value** - Long-term business benefit
- **Risk mitigation** - Problems this prevents

## Task Specification Standards

### File Specification Requirements
Every task MUST specify:

```markdown
- [ ] **Task X.Y: Task Description**
  - Detailed description of work to be done
  - **Value**: Clear statement of user/product/company benefit
  - **Evidence**: Research/data supporting this approach
  - **Files**: Complete list of files to create/modify
    - `src/path/to/NewComponent.tsx` (create)
    - `src/path/to/ExistingService.ts` (modify - add method X)
    - `src/path/to/types.ts` (modify - add interface Y)
  - **Dependencies**: Other tasks that must complete first
  - **Acceptance Criteria**: Testable conditions for completion
  - **Testing**: Specific tests to write/modify
  - **Performance**: Expected performance impact
  - **Security**: Security considerations for this task
```

### Task Quality Checklist
Each task MUST be:

- [ ] **Actionable** - Clear what to do
- [ ] **Specific** - Exact files and changes listed
- [ ] **Testable** - Clear acceptance criteria
- [ ] **Valuable** - Benefit to user/product/company stated
- [ ] **Evidence-based** - Research/data supporting approach
- [ ] **Scoped** - Reasonable size for implementation
- [ ] **Dependencies clear** - Prerequisites identified
- [ ] **Risk-assessed** - Potential issues identified

## Evaluation Process

### Phase 1: Initial Review (Product Trio)
1. **Business case validation** - Is this worth building?
2. **User need confirmation** - Do users actually want this?
3. **Technical feasibility** - Can we build this effectively?
4. **Resource allocation** - Do we have capacity?

### Phase 2: Specialist Review (Context-Dependent)
1. **Identify required specialists** based on spec content
2. **Parallel specialist reviews** - Each evaluates their domain
3. **Cross-functional impact assessment** - Integration concerns
4. **Risk and mitigation planning** - Identify and plan for risks

### Phase 3: Completeness Audit
1. **Content gap analysis** - Missing information identified
2. **Evidence validation** - Research and data verified
3. **Task specification review** - All tasks properly detailed
4. **Value proposition confirmation** - Benefits clearly articulated

### Phase 4: Final Approval
1. **All evaluators sign-off** - No blocking concerns remain
2. **Implementation readiness** - Team can start immediately
3. **Success criteria locked** - Metrics and goals finalized
4. **Risk mitigation approved** - Contingency plans in place

## Evaluation Documentation

### Review Record Template
```markdown
# Spec Evaluation: [Spec Name]

## Evaluation Team
- Product Manager: [Name] ✅/❌
- Engineering Lead: [Name] ✅/❌
- UX Designer: [Name] ✅/❌
- [Additional roles as needed]

## Evaluation Results
### Business Value: ✅/❌
- Value proposition: Clear/Unclear
- User impact: Quantified/Vague
- ROI justification: Strong/Weak

### Technical Feasibility: ✅/❌
- Architecture fit: Good/Poor
- Implementation complexity: Low/Medium/High
- Performance impact: Acceptable/Concerning

### User Experience: ✅/❌
- User journey: Complete/Incomplete
- Accessibility: Compliant/Non-compliant
- Design consistency: Good/Poor

## Action Items
- [ ] [Issue 1] - Owner: [Name] - Due: [Date]
- [ ] [Issue 2] - Owner: [Name] - Due: [Date]

## Final Decision
- [ ] Approved for implementation
- [ ] Requires revisions (see action items)
- [ ] Rejected (see reasoning below)

## Reasoning
[Detailed explanation of decision]
```

## Quality Gates

### Pre-Implementation Gates
1. **All evaluators approved** - No blocking concerns
2. **Evidence validated** - Research and data verified
3. **Tasks fully specified** - Files and changes detailed
4. **Value proposition clear** - Benefits articulated
5. **Success metrics defined** - Measurement plan ready

### Implementation Gates
1. **Task completion verified** - Acceptance criteria met
2. **Testing completed** - All tests pass
3. **Performance validated** - Benchmarks met
4. **Security reviewed** - No vulnerabilities introduced
5. **Documentation updated** - Changes documented

## Continuous Improvement

### Evaluation Effectiveness Metrics
- **Spec quality scores** - Post-implementation assessment
- **Implementation success rate** - Tasks completed as planned
- **Time to market** - Spec to release duration
- **User satisfaction** - Feature adoption and feedback
- **Technical debt impact** - Code quality maintenance

### Process Refinement
- **Monthly evaluation reviews** - Process improvement sessions
- **Evaluator feedback** - Continuous process optimization
- **Template updates** - Based on lessons learned
- **Training updates** - Keep evaluators current on best practices

## Tools and Templates

### Evaluation Checklist Tool
- Interactive checklist for each evaluation phase
- Automated reminders for evaluator assignments
- Progress tracking and bottleneck identification
- Historical evaluation data for process improvement

### Spec Template Generator
- Context-aware template selection
- Required section enforcement
- Evidence requirement prompts
- Value proposition framework integration

This framework ensures every spec is thoroughly evaluated, evidence-based, and delivers clear value while preventing critical gaps in planning and implementation.
