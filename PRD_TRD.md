__KFPL__

__Agent Portal__

PRD \+ TRD ΓÇö Version 1\.0 \(Frontend Only\)

*Includes: Auto Commission Engine ┬╖ Rewards & Redemption ┬╖ Withdrawal ┬╖ Service Requests*

Stack: React 18 ┬╖ Tailwind CSS ┬╖ Custom CSS

Theme: Deep Forest Green \(\#061D13\) ┬╖ Vibrant Emerald \(\#10B981\)

Prepared for: Milind

Document Version 1\.0

# Table of Contents

# 1\. Executive Overview & Goals

The KFPL Agent Portal is the partner\-facing web application for individuals and entities who bring investors \(clients\) to KFPL\. It gives agents a clear, self\-service view of the clients they have onboarded, automatic visibility into the commission they have earned, and a structured way to track and redeem rewards ΓÇö reducing dependence on manual admin communication for routine commission and status queries\.

__Goal__

__Success Metric__

__Priority__

Commission transparency

Agent sees auto\-calculated one\-time and monthly commission without contacting admin

P0 ΓÇö Critical

Client visibility

Agent sees full list of their clients with investment and ROI status within 2 seconds of login

P0 ΓÇö Critical

Reward motivation

Agent can see exactly what is needed to unlock each reward and claim it in\-app

P1 ΓÇö High

Self\-service withdrawal

Agent can raise a commission withdrawal request without admin assistance

P1 ΓÇö High

Self\-service requests

Any query can be raised as a trackable Service Request in under 1 minute

P1 ΓÇö High

Growth engagement

Agent can use the income calculator to model new client scenarios

P2 ΓÇö Medium

Support accessibility

Support reachable within 2 taps/clicks from any page

P2 ΓÇö Medium

# 2\. User Role ΓÇö Agent

An Agent is a referral partner onboarded by the Super Admin\. Agents log in to track the clients they have brought to KFPL and the commission generated from those clients' investments\. Agents have read\-only visibility into their clients' investment data and limited visibility into agreements \(view only, no download ΓÇö per SOW\)\.

__Attribute__

__Detail__

Login Method

Email \+ Password \(JWT session stored in httpOnly cookie\)

Account Creation

Created by Super Admin only ΓÇö agent completes Nominee details on first login

Session Timeout

30 minutes of inactivity

Access Scope

Own profile, own client list \(read\-only investment data\), own commission, own rewards, withdrawal requests, service requests

Cannot Access

Other agents' data, client agreement download, Super Admin panel, slab/reward configuration

Password Recovery

Email\-based OTP reset \(6\-digit, expires in 10 minutes\)

# 3\. Agent Dashboard ΓÇö Commission Summary

__*SOW / Client Requirement:  *__*In the agent's page there should be one field where the agent can see his commissions paid, pending, reward, etc\.*

The dashboard is the agent's home screen ΓÇö a single\-glance summary of earnings and activity, before they drill into the detailed Commission or Rewards pages\.

__\#__

__Feature__

__Description__

__Priority__

AD\-01

Commission Summary Card

One prominent card/field showing three figures together: Commission Paid \(Γé╣\), Commission Pending \(Γé╣\), Rewards Earned \(count or Γé╣ value\)

P0 ΓÇö Critical

AD\-02

Total Clients Card

Count of clients brought in by this agent, with a link through to the My Clients page

P0 ΓÇö Critical

AD\-03

This Month's Commission

Current month's projected/accrued monthly commission, auto\-calculated from active client investments

P0 ΓÇö Critical

AD\-04

Active Rewards Strip

Horizontal strip of reward cards ΓÇö locked \(greyed, target text below\) and unlocked \(clickable, ΓÇ£Claim NowΓÇ¥\) states

P0 ΓÇö Critical

AD\-05

Quick Chart Preview

Small monthly commission trend chart with a ΓÇ£View Full ChartΓÇ¥ link to the Commission page

P1 ΓÇö High

AD\-06

Recent Activity Feed

Last 5 events: new client added, ROI processed for a client, commission credited, reward unlocked

P2 ΓÇö Medium

# 4\. Profile Management

__*SOW / Client Requirement:  *__*Profile ΓÇö Edit, Update, Alter personal information\. Agent can see his clients' agreement but cannot download it\. \(Extended to include Nominee Details\.\)*

__\#__

__Feature__

__Description__

__Priority__

P\-01

View Profile Summary

Name, email, phone, address, Agent ID, joining date, account status

P0 ΓÇö Critical

P\-02

Edit Personal Information

Editable: phone, address, bank details for commission payout\. Name/email read\-only \(admin\-managed\)

P0 ΓÇö Critical

P\-03

Nominee Details Card

Nominee Name, Relation \(dropdown: Spouse / Parent / Child / Sibling / Other\), Contact, optional Email ΓÇö same pattern as Client Portal

P0 ΓÇö Critical

P\-04

Change Password

Current \+ new password \+ confirm, with strength meter

P1 ΓÇö High

P\-05

Account Details Card

Agent ID \(KFPL\-AG\-XXXX\), Account Status, Member Since date, current commission slab tier

P0 ΓÇö Critical

# 5\. My Clients

__*SOW / Client Requirement:  *__*Client Section ΓÇö Client list with contact details, their Investment Amount, Monthly ROI they are getting, Contract Period, Date of Investment\.*

This table mirrors the structure used on the Super Admin's view of an individual agent's clients, so the same data is consistent everywhere it appears\.

__\#__

__Feature__

__Description__

__Priority__

C\-01

Client List Table

Required column order: Client ID ΓåÆ Date of Joining ΓåÆ Name ΓåÆ Email ΓåÆ Mobile ΓåÆ Total Investment ΓåÆ ROI % ΓåÆ Commission Paid \(for that client, to this agent\) ΓåÆ Status

P0 ΓÇö Critical

C\-02

Contract Period Column

Additional column showing contract period per client investment, as required by SOW

P0 ΓÇö Critical

C\-03

Client Detail Drawer

Clicking a row opens a read\-only drawer with fuller investment breakdown by segment

P1 ΓÇö High

C\-04

Agreement Preview \(No Download\)

Agent can view the client's signed agreement in an in\-browser preview modal; the download button is hidden/disabled for agents

P0 ΓÇö Critical

C\-05

Search & Filter

Search by name/Client ID; filter by status \(Active/Inactive\) and by investment segment

P1 ΓÇö High

C\-06

Sort

Sortable by Date of Joining, Total Investment, ROI %, Commission Paid

P1 ΓÇö High

# 6\. Agents Commission

__*SOW / Client Requirement:  *__*One\-Time Commission \(% of invested amount\); Monthly Commission \(slabs 0\.5% / 0\.75% / 1% per month of investment amount\); Special Commission \(runs only during special plans\); Rewards \(listed, redeemed from portal\)\. New requirement: one\-time and monthly commission must auto\-calculate from client investment, slab\-wise; special commission is updated from Super Admin backend\.*

### 6\.1 One\-Time Commission

__\#__

__Feature__

__Description__

__Priority__

OC\-01

Auto\-Calculated Total

System computes one\-time commission automatically the moment a client investment is assigned, using the active slab for that investment amount ΓÇö no manual entry by agent or admin

P0 ΓÇö Critical

OC\-02

Per\-Client Breakdown

Table: Client Name, Investment Amount, Slab % Applied, One\-Time Commission Earned, Date Credited

P0 ΓÇö Critical

OC\-03

Slab Reference Table

Read\-only view of the current one\-time commission slabs \(investment range ΓåÆ %\), so the agent understands how the number was derived

P1 ΓÇö High

### 6\.2 Monthly Commission

__\#__

__Feature__

__Description__

__Priority__

MC\-01

Auto\-Calculated Monthly Total

Recurring monthly commission auto\-calculated from the combined active investment of all the agent's clients, using the 0\.5% / 0\.75% / 1% slab applicable that month

P0 ΓÇö Critical

MC\-02

Per\-Client Monthly Breakdown

Table: Client Name, Month, Investment Base, Slab % Applied, Commission Amount

P0 ΓÇö Critical

MC\-03

Monthly Commission Chart

One\-click chart \(bar or line\) of monthly commission earned over the last 12 months

P0 ΓÇö Critical

MC\-04

Download Statement

Download button next to the chart ΓÇö exports the monthly commission statement as PDF or Excel

P0 ΓÇö Critical

### 6\.3 Special Commission

__\#__

__Feature__

__Description__

__Priority__

SC\-01

Special Commission Card

Displayed only when active ΓÇö shows amount and the special plan/reason it relates to\. Read\-only; entirely set by Super Admin backend, not editable or calculated by the agent's own data

P1 ΓÇö High

SC\-02

History

Past special commission credits with date and reason note

P2 ΓÇö Medium

__Business Rules:__

- Slab values for both One\-Time and Monthly commission are configured by Super Admin \(see the Super Admin Commission Slab Configuration module\) ΓÇö exact slab boundaries are pending from the client and will be wired in once received\.
- Special commission is always additive on top of slab\-calculated commission, never a replacement\.
- Commission figures shown here must always match the ΓÇ£Commission PaidΓÇ¥ values visible to Super Admin for the same agent and client ΓÇö single source of truth is the backend calculation engine\.

# 7\. Rewards & Redemption

__*SOW / Client Requirement:  *__*Rewards ΓÇö We will list them; the agents have to redeem the reward from the portal\. New requirement: rewards section shows all rewards, non\-clickable with the target mentioned below until achieved; once the target is achieved the reward unlocks and becomes clickable, opening a claim form to fill and submit\.*

__\#__

__Feature__

__Description__

__Priority__

RW\-01

Rewards Grid

Card per reward: reward name/image, short description, target condition text

P0 ΓÇö Critical

RW\-02

Locked State

Greyed\-out card, not clickable, with the target requirement printed below it \(e\.g\. ΓÇ£Bring 10 clients to unlockΓÇ¥\) and a progress indicator if measurable \(e\.g\. ΓÇ£7 / 10 clientsΓÇ¥\)

P0 ΓÇö Critical

RW\-03

Unlocked State

Once the backend marks the target as met, the card becomes fully coloured and clickable, labelled ΓÇ£Claim NowΓÇ¥

P0 ΓÇö Critical

RW\-04

Claim Form

Clicking an unlocked reward opens a form \(e\.g\. delivery address for a physical reward, or bank confirmation for a cash reward\) ΓÇö agent fills and submits

P0 ΓÇö Critical

RW\-05

Claim Status Tracking

After submission, the reward card shows a status: Claim Submitted / Under Review / Fulfilled

P1 ΓÇö High

RW\-06

Rewards History

List of all previously claimed and fulfilled rewards with dates

P1 ΓÇö High

*Target conditions, exact reward catalog, and reward artwork will be supplied by the client and wired into the Rewards Grid once received ΓÇö the UI is built to be data\-driven so new rewards can be added without frontend code changes\.*

# 8\. Grow with KFPL

__*SOW / Client Requirement:  *__*Grow with KFPL ΓÇö Different offers, New Plans, Income Calculator, etc\.*

__\#__

__Feature__

__Description__

__Priority__

G\-01

Offers & New Plans Feed

Card feed of current offers/plans agents can pitch to prospective clients ΓÇö admin\-published content, similar pattern to the Client Portal's Media section

P0 ΓÇö Critical

G\-02

Income Calculator

Interactive tool: agent enters a hypothetical client investment amount ΓåÆ calculator shows projected one\-time commission and projected monthly commission using the live slab rates

P0 ΓÇö Critical

G\-03

Plan Detail View

Clicking an offer/plan opens full details ΓÇö useful talking points for the agent to share with prospects

P1 ΓÇö High

# 9\. Withdrawal

__*SOW / Client Requirement:  *__*Withdrawal ΓÇö Agent can put a withdrawal request\.*

__\#__

__Feature__

__Description__

__Priority__

W\-01

Raise Withdrawal Request

Form: amount \(capped at current Commission Pending balance\), bank account \(pre\-filled from profile\), optional note

P0 ΓÇö Critical

W\-02

Request History

Table of past withdrawal requests: amount, date, status \(Pending / Approved / Rejected\), admin note

P0 ΓÇö Critical

W\-03

Status Email Notification

Agent receives email when admin approves or rejects a withdrawal request

P1 ΓÇö High

# 10\. Service Requests

__*SOW / Client Requirement:  *__*Both for client and agent, give a service request option in their portal where they can raise any request, which will be seen in Super Admin under a Service Requests section with their details and request\.*

Identical pattern to the Client Portal's Service Requests module ΓÇö a formal, trackable ticket system distinct from the quick\-contact Support channels in Section 11\.

__\#__

__Feature__

__Description__

__Priority__

SR\-01

Raise New Request

Form: Category \(Commission Query / Client Query / Reward Issue / Withdrawal Issue / Other\), Subject, Description, optional attachment

P0 ΓÇö Critical

SR\-02

My Requests List

Table of all requests raised: Request ID, Category, Subject, Date, Status

P0 ΓÇö Critical

SR\-03

Request Detail View

Full description, status timeline, admin response/notes

P0 ΓÇö Critical

SR\-04

Status Tracking

Status badge: Open / In Progress / Resolved / Closed

P0 ΓÇö Critical

SR\-05

Email on Status Change

Agent notified by email whenever Super Admin updates the request status

P1 ΓÇö High

# 11\. Support

__*SOW / Client Requirement:  *__*Support ΓÇö WhatsApp Chat, Mail, Phone\.*

__\#__

__Feature__

__Description__

__Priority__

S\-01

Support Page

Dedicated /support page with all contact options

P0 ΓÇö Critical

S\-02

WhatsApp / Email / Phone

Deep links pre\-filled with agent name \+ Agent ID

P0 ΓÇö Critical

S\-03

Support Widget \(FAB\)

Floating icon on every page expanding to WhatsApp / Email / Phone

P1 ΓÇö High

# 12\. Email Notifications ΓÇö Agent Receives

__Trigger Event__

__Sent By__

__Subject Line Template__

__Priority__

Account created / welcome

System \(Admin action\)

Welcome to KFPL ΓÇö Your Agent Account is Ready\!

P0

New client onboarded under agent

System \(Admin action\)

A New Client Has Been Added Under Your Referral

P1

One\-time commission credited

System \(Auto\-calculated\)

One\-Time Commission Credited ΓÇö Γé╣\{Amount\}

P0

Monthly commission credited

System \(Auto\-calculated\)

Your Monthly Commission for \{Month\} ΓÇö Γé╣\{Amount\}

P0

Special commission credited

System \(Admin action\)

Special Commission Credited ΓÇö Γé╣\{Amount\}

P1

Reward unlocked

System \(Auto, target met\)

You've Unlocked a New Reward ΓÇö Claim It Now\!

P1

Reward claim status update

System \(Admin action\)

Update on Your Reward Claim ΓÇö \{Status\}

P1

Withdrawal approved / rejected

System \(Admin action\)

Update on Your Withdrawal Request ΓÇö Γé╣\{Amount\}

P0

Service request submitted

System \(Agent action\)

We've Received Your Request ΓÇö \#\{RequestID\}

P1

Service request status updated

System \(Admin action\)

Update on Your Request \#\{RequestID\} ΓÇö \{Status\}

P1

# 13\. Non\-Functional Requirements

__Category__

__Requirement__

Performance

Initial page load under 2\.5s; dashboard render under 2s; smooth 60fps chart animation

Responsiveness

Mobile\-first ΓÇö fully functional 375px\+, tablet 768px\+, desktop 1280px\+

Security

JWT in httpOnly cookie; no PII in URL params or localStorage; HTTPS enforced; agreement preview via signed, non\-downloadable URL

Accessibility

WCAG 2\.1 AA ΓÇö keyboard navigation, ARIA labels, 4\.5:1 contrast minimum, visible focus rings

Browser Support

Chrome 90\+, Firefox 88\+, Edge 90\+, Safari 14\+, iOS/Android latest

Loading / Empty States

Skeleton loaders on all data\-fetching sections; helpful empty\-state illustrations with CTAs

Data Consistency

Commission figures must always reconcile with Super Admin's records ΓÇö frontend never performs its own commission math, only displays backend\-calculated values

# 14\. Technology Stack

__Layer__

__Package / Version__

__Purpose__

Framework

React 18 \(Vite 5\)

Component\-based UI, fast HMR, optimised production build

Routing

React Router DOM v6

Client\-side routing, nested layouts, lazy\-loaded routes, protected routes

Styling ΓÇö Core

Tailwind CSS v3

Utility\-first layout, spacing, responsive breakpoints

Styling ΓÇö Custom

agent\.css \(hand\-written\)

Animations, reward cards, chart wrappers, slab tables, glow effects

Fonts

Inter ┬╖ Plus Jakarta Sans ┬╖ JetBrains Mono

UI text ┬╖ Display numbers ┬╖ IDs / amounts

State ΓÇö Global

Zustand v4

Auth state, UI state \(modals, sidebar\)

State ΓÇö Server

TanStack Query v5

API caching, background refetch, optimistic updates

Forms

React Hook Form \+ Zod

Profile, Nominee, withdrawal, reward claim, service requests, income calculator

Charts

Recharts v2

Monthly commission bar/line chart

HTTP Client

Axios v1

API calls; JWT interceptor; 401 auto\-logout

Notifications

React Hot Toast

Toast system, emerald themed

Icons

Lucide React

All UI icons

Modals / Drawer

Headless UI \+ Radix UI

Accessible modal, drawer, dropdown, tooltip

Animation

Framer Motion v10

Page transitions, card entrance, reward unlock animation

Date Handling

date\-fns v3

Commission date formatting, filters

File Export

jsPDF \+ SheetJS \(xlsx\)

Monthly commission statement download \(PDF / Excel\)

# 15\. Project Folder Structure

__Path__

__Purpose__

src/components/dashboard/

CommissionSummaryCard\.jsx, RewardsStrip\.jsx, ActivityFeed\.jsx

src/components/clients/

ClientTable\.jsx, ClientDetailDrawer\.jsx, AgreementPreviewModal\.jsx

src/components/commission/

OneTimeCommissionTable\.jsx, MonthlyCommissionTable\.jsx, CommissionChart\.jsx, SlabReferenceTable\.jsx, SpecialCommissionCard\.jsx, StatementDownloadButton\.jsx

src/components/rewards/

RewardCard\.jsx, RewardClaimForm\.jsx, RewardsHistory\.jsx

src/components/grow/

OfferCard\.jsx, IncomeCalculator\.jsx, PlanDetailModal\.jsx

src/components/withdrawal/

WithdrawalForm\.jsx, WithdrawalHistory\.jsx

src/components/service\-requests/

NewRequestForm\.jsx, RequestList\.jsx, RequestDetail\.jsx, RequestStatusBadge\.jsx

src/components/onboarding/

NomineeForm\.jsx \(shared pattern with Client Portal\)

src/components/support/

SupportWidget\.jsx, SupportPage\.jsx

src/pages/dashboard/

DashboardHome\.jsx

src/pages/profile/

Profile\.jsx, EditProfile\.jsx, ChangePassword\.jsx

src/pages/clients/

MyClients\.jsx

src/pages/commission/

CommissionOverview\.jsx

src/pages/rewards/

RewardsAndRedemption\.jsx

src/pages/grow/

GrowWithKFPL\.jsx

src/pages/withdrawal/

Withdrawal\.jsx

src/pages/service\-requests/

ServiceRequests\.jsx, NewServiceRequest\.jsx, ServiceRequestDetail\.jsx

src/pages/support/

Support\.jsx

src/services/

api\.js, clientService\.js, commissionService\.js, rewardsService\.js, withdrawalService\.js, serviceRequestService\.js

src/store/

authStore\.js, uiStore\.js

src/validations/

nomineeSchema\.js, withdrawalSchema\.js, rewardClaimSchema\.js, serviceRequestSchema\.js

src/constants/

COMMISSION\_SLABS\.js \(pending values\), REQUEST\_CATEGORIES\.js

# 16\. CSS Architecture ΓÇö Theme & Custom Classes

### 16\.1 Design Tokens \(globals\.css ΓÇö shared with Client Portal & Super Admin\)

__CSS Variable__

__Hex / Value__

__Role__

\-\-color\-navy

\#061D13

Deep Forest Green ΓÇö sidebar, header background

\-\-color\-gold

\#10B981

Vibrant Emerald ΓÇö primary buttons, brand accent

\-\-color\-gold\-dark

\#059669

Dark Emerald ΓÇö hover states, focus rings

\-\-color\-gold\-light

\#ECFDF5

Soft Mint ΓÇö callout / badge backgrounds

\-\-color\-surface

\#F3F7F5

App\-wide page background

\-\-color\-surface\-alt

\#E5ECE8

Tab panels, grouped section backgrounds

\-\-color\-text\-primary

\#11221A

Headings, primary body text

\-\-color\-text\-muted

\#6D7E75

Placeholders, secondary labels

\-\-color\-border

\#C8D8CF

Table lines, card borders

\-\-color\-success / \-bg

\#065F46 / \#D1FAE5

Paid, Active, Approved, Resolved

\-\-color\-warning / \-bg

\#92400E / \#FEF3C7

Pending, In Progress

\-\-color\-danger / \-bg

\#991B1B / \#FEE2E2

Rejected, Closed \(declined\)

### 16\.2 New Custom Classes \(agent\.css\)

__Class__

__Purpose & Behaviour__

\.kfpl\-commission\-summary

Hero dashboard card: 3\-column split \(Paid / Pending / Reward\), large numerals, divider lines between columns

\.kfpl\-reward\-card\-\-locked

Greyscale filter applied, cursor: not\-allowed, target text below in \-\-color\-text\-muted, optional thin progress bar

\.kfpl\-reward\-card\-\-unlocked

Full colour, emerald glow shadow on hover, ΓÇ£Claim NowΓÇ¥ ribbon badge top\-right

\.kfpl\-slab\-table

Compact reference table style: navy header, alternating rows, used for slab and income calculator output

\.kfpl\-income\-calculator

Two\-column layout \(inputs left, projected results right on desktop; stacked on mobile\), results panel with \-\-gold\-light background

\.kfpl\-request\-status

Service request status pill: Open \(amber\), In Progress \(emerald tint\), Resolved \(success green\), Closed \(muted grey\)

# 17\. Font System & Typography

__Use Case__

__Font__

__Weight__

__Size__

Commission summary numbers

Plus Jakarta Sans

700

36px

Page headings \(H1\)

Plus Jakarta Sans

700

28px

Section headings \(H2\)

Inter

600

22px

Body text

Inter

400

14px

Table headers

Inter

600

11px uppercase

Agent / Client IDs & amounts

JetBrains Mono

400

13px

# 18\. Agent Dashboard UI/UX Specifications

__Component__

__Background__

__Text / Accent__

__Notes__

Page background

\#F3F7F5

ΓÇö

App\-wide

Sidebar

\#061D13

\#F3F7F5 / active \#10B981 left border

Desktop only

Commission Summary Card

White, gradient accent strip

\#10B981 numerals

3\-column split: Paid / Pending / Reward

Reward Cards \(locked\)

Greyscale overlay

\#6D7E75 muted text

Target text \+ progress bar below

Reward Cards \(unlocked\)

White, emerald border

\#10B981 ΓÇ£Claim NowΓÇ¥ ribbon

Glow shadow on hover

Income Calculator

White card, results panel \#ECFDF5

\#11221A inputs, \#059669 result figures

Split layout desktop, stacked mobile

Service Request status badges

Tinted per status

Status colour text

Open=amber, In Progress=emerald tint, Resolved=green, Closed=grey

Primary buttons

\#10B981

White text

Hover \#059669, emerald glow shadow

# 19\. Key Component Specifications

### 19\.1 CommissionSummaryCard\.jsx

__Prop__

__Type__

__Description__

commissionPaid

number

Total commission paid to date

commissionPending

number

Total commission accrued but not yet paid out

rewardsEarned

number

Count of rewards currently unlocked/claimed

isLoading

boolean

Shows skeleton while data fetches

### 19\.2 RewardCard\.jsx

__Prop__

__Type__

__Description__

reward

\{id,title,description,targetLabel,targetValue,currentValue,status\}

Reward definition plus the agent's current progress and status

isLocked

boolean

Controls greyscale / clickable state

onClaim

function

Opens RewardClaimForm when an unlocked card is clicked

### 19\.3 IncomeCalculator\.jsx

__Prop__

__Type__

__Description__

slabs

Array<\{min,max,oneTimePercent,monthlyPercent\}>

Live slab data fetched from backend \(pending exact values from client\)

onCalculate

function

Recomputes projected one\-time and monthly commission as the agent types a hypothetical amount

### 19\.4 CommissionChart\.jsx

__Prop__

__Type__

__Description__

data

Array<\{month,amount\}>

Last 12 months of monthly commission

onDownload

function\(format: 'pdf'|'xlsx'\)

Triggers statement export

# 20\. API Integration Contract \(Frontend Expectations\)

All calls use the Axios instance in src/services/api\.js\. JWT auto\-injected via interceptor; 401 triggers logout\.

GET   /agent/dashboard                         ΓåÆ \{ commissionPaid, commissionPending, rewardsEarned, totalClients \}  
GET   /agent/clients                           ΓåÆ \{ clients: \[\{clientId,dateOfJoining,name,email,mobile,  
                                                     totalInvestment,roiPercent,commissionPaid,contractPeriod,status\}\] \}  
GET   /agent/clients/:id/agreement               ΓåÆ \{ previewUrl \}   \(no download permission\)  
GET   /agent/commission/one\-time                ΓåÆ \{ entries: \[\.\.\.\], slabs: \[\.\.\.\] \}  
GET   /agent/commission/monthly                 ΓåÆ \{ entries: \[\.\.\.\], chartData: \[\.\.\.\], slabs: \[\.\.\.\] \}  
GET   /agent/commission/special                 ΓåÆ \{ entries: \[\.\.\.\] \}  
GET   /agent/commission/statement?format=pdf|xlsx  ΓåÆ file stream  
GET   /agent/rewards                            ΓåÆ \{ rewards: \[\{id,title,target,progress,status\}\] \}  
POST  /agent/rewards/:id/claim                  Body: \{ formData \}  
GET   /agent/grow/offers                        ΓåÆ \{ offers: \[\.\.\.\] \}  
GET   /agent/grow/calculator\-slabs               ΓåÆ \{ slabs: \[\.\.\.\] \}  
POST  /agent/withdrawal                          Body: \{ amount, bankAccountId, note \}  
GET   /agent/withdrawal                          ΓåÆ \{ requests: \[\.\.\.\] \}  
PUT   /agent/nominee                             Body: \{ name, relation, contact, email \}  
GET   /agent/service\-requests                    ΓåÆ \{ requests: \[\.\.\.\] \}  
POST  /agent/service\-requests                    Body: \{ category, subject, description, attachment? \}

# 21\. Route Structure

__Route__

__Component__

__Access__

/dashboard

DashboardHome\.jsx

Auth ΓÇö default after login

/profile

Profile\.jsx

Auth ΓÇö includes Nominee card

/clients

MyClients\.jsx

Auth

/commission

CommissionOverview\.jsx

Auth ΓÇö One\-Time \+ Monthly \+ Special tabs

/rewards

RewardsAndRedemption\.jsx

Auth

/grow

GrowWithKFPL\.jsx

Auth ΓÇö offers \+ income calculator

/withdrawal

Withdrawal\.jsx

Auth

/service\-requests

ServiceRequests\.jsx

Auth

/service\-requests/new

NewServiceRequest\.jsx

Auth

/service\-requests/:id

ServiceRequestDetail\.jsx

Auth

/support

Support\.jsx

Auth

# 22\. State Management & Code Standards

__Store__

__State / Actions__

authStore\.js

agent \{id,agentId,name,email,onboardingComplete\}, token ΓÇö login\(\), logout\(\), updateProfile\(\)

uiStore\.js

isMobileSidebarOpen, isSupportWidgetOpen, modal \{isOpen,type,data\}

Commission, Clients, Rewards, Withdrawal, and Service Requests data are treated as server state via TanStack Query \(not Zustand\) ΓÇö cached, background\-refetched, with optimistic updates on submission\. The frontend never recalculates commission itself; it only renders backend\-calculated values to guarantee a single source of truth with Super Admin's records\.

__Comment Standard:__

- Every file \(component, hook, service, store, util, CSS\) carries a header comment block \(Component / Description / Last Updated\) and a closing end\-comment\.
- All API calls, commission\-related calculations, and reward\-unlock logic carry inline comments\.

# 23\. Development Phases

__Phase__

__Scope__

Phase 1

Project setup: Vite \+ React 18, Tailwind, shared design tokens, fonts, Zustand, Axios, Router, auth flow, layout shell

Phase 2

Dashboard: CommissionSummaryCard, Total Clients card, Rewards strip, Activity feed

Phase 3

Profile \+ Nominee: profile view/edit, NomineeForm, change password

Phase 4

My Clients: ClientTable \(full column spec\), ClientDetailDrawer, AgreementPreviewModal \(no download\)

Phase 5

Commission module: One\-Time table, Monthly table, CommissionChart, SlabReferenceTable, Special Commission card, statement download

Phase 6

Rewards & Redemption: RewardCard \(locked/unlocked\), RewardClaimForm, RewardsHistory

Phase 7

Grow with KFPL: OfferCard feed, IncomeCalculator, PlanDetailModal

Phase 8

Withdrawal: request form, request history

Phase 9

Service Requests module: NewRequestForm, RequestList, RequestDetail

Phase 10

Support page \+ floating SupportWidget

Phase 11

QA pass: mobile\-first testing, accessibility audit, empty/error states, cross\-browser, performance, commission\-figure reconciliation testing against Super Admin data

*Document Scope: This PRD \+ TRD v1\.0 covers the KFPL Agent Portal frontend only \(React 18 \+ Tailwind CSS v3 \+ Custom CSS\)\. Theme: Deep Forest Green \(\#061D13\) \+ Vibrant Emerald \(\#10B981\) ΓÇö consistent with the Super Admin and Client Portal documents\. Commission slab values and the reward catalog are placeholders pending final values from the client; the UI is built data\-driven so these can be wired in without structural changes\.*

