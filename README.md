# YAML Family Tree Database Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [File Structure Overview](#file-structure-overview)
3. [ID Format and Generation](#id-format-and-generation)
4. [Field Specifications](#field-specifications)
5. [Adding New Members](#adding-new-members)
6. [Updating Existing Records](#updating-existing-records)
7. [Common Scenarios](#common-scenarios)
8. [Validation Rules](#validation-rules)
9. [Best Practices](#best-practices)

---

## Introduction

This database stores family tree member information in YAML format. Each member has their own YAML file with a standardized structure. This document provides detailed instructions on how to add and update member records correctly.

### Key Principles
- **One file per member**: Each person gets their own YAML file
- **Strict ID format**: IDs must follow the pattern `MID##-G##-###-##`
- **Optional with defaults**: Most fields are optional with sensible defaults
- **Unknown is okay**: Use `UNKNOWN` or `null` when information isn't available

---

## File Structure Overview

### File Naming Convention
```
{ID} - {SHORT_NAME}.yaml
```

**Examples:**
- `MID00-G50-000-01 - Nadeesha Kumari.yaml`
- `MID01-G50-000-01 - Lalith Kumara.yaml`
- `MID01-G51-001-01 - Kavindu Werasuriya.yaml`

### JSON Index File
The `files.json` file maintains a list of all YAML files:
```json
[
    "MID00-G50-000-01 - Nadeesha Kumari.yaml",
    "MID01-G50-000-01 - Lalith Kumara.yaml",
    "MID01-G51-001-01 - Kavindu Werasuriya.yaml"
]
```

**Important:** Always update `files.json` when adding or removing YAML files!

---

## ID Format and Generation

### ID Structure
```
MID##-G##-###-##
```

Breaking down the format:
- `MID##`: Family Tree ID (00-99)
- `G##`: Member Generation ID (typically 45-55)
- `###`: Members Father's Family ID (000-999)
- `##`: Members Father's Child ID (00-99, indicates birth order)

### ID Format Regex
```regex
/^MID\d{2}-G\d{2}-\d{3}-\d{2}$/
```

### Generation Guidelines
- **G45-G48**: Historical ancestors (1800s-early 1900s)
- **G49-G50**: Mid-generation (1930s-1970s)
- **G51-G52**: Recent generation (1980s-2010s)
- **G53+**: Current children and young adults

### Example ID Generation

**For a firstborn child of father with ID MID01-G50-005-03:**
```
MID01-G51-005-01
└─┬─┘ └┬┘ └┬┘ └┬┘
  │    │   │   └─ First child (01)
  │    │   └───── Father's family ID (005)
  │    └───────── Next generation (51)
  └────────────── Same family tree (01)
```

---

## Field Specifications

### 1. ID (REQUIRED)
```yaml
ID: MID01-G50-000-01
```
- **Type:** String
- **Required:** YES
- **Format:** Must match regex pattern
- **Validation:** Must be unique across all files

---

### 2. PROFILE_PICTURE (Optional)
```yaml
PROFILE_PICTURE: /Image/Contemporary/John_Profile.jpg
```
- **Type:** String
- **Required:** NO
- **Default:** `/assets/members-img/person.png`
- **Accepted Values:**
  - Valid image path
  - `UNKNOWN`
  - `null`

**Examples:**
```yaml
# With image
PROFILE_PICTURE: /Image/Historical/Smith_1920.jpg

# Unknown
PROFILE_PICTURE: UNKNOWN

# Using default (leave undefined)
# PROFILE_PICTURE:
```

---

### 3. SHORT_NAME (Optional)
```yaml
SHORT_NAME: John Smith
```
- **Type:** String
- **Required:** NO
- **Default:** `"Unknown Name"`
- **Usage:** Used where space is limited (lists, cards)

---

### 4. FULL_NAME (Optional)
```yaml
FULL_NAME: John Michael Smith
```
- **Type:** String
- **Required:** NO
- **Default:** `"Unknown Name"`
- **Usage:** Used in detailed views and formal contexts

---

### 5. ALTERNATE_NAMES (Optional)
```yaml
ALTERNATE_NAMES:
  - NAME: J. M. Smith
    CONTEXT: OFFICIAL_DOCUMENTS
  - NAME: Johnny
    CONTEXT: NICKNAME
  - NAME: Smith, John
    CONTEXT: LEGAL_NAME
```

- **Type:** List of Objects OR String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Can be:** Empty list `[]`, `UNKNOWN`, `null`, or list of name objects

#### NAME Sub-field (Required if ALTERNATE_NAMES exist)
- **Type:** String
- **Required:** YES (if you add an alternate name entry)
- **Cannot be:** `UNKNOWN` or `null`

#### CONTEXT Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Common Values:**
  - `OFFICIAL_DOCUMENTS`
  - `SOCIAL_REFERENCE`
  - `MAIDEN_NAME`
  - `BAPTISMAL_NAME`
  - `BIRTH_NAME`
  - `LAY_NAME`
  - `NICKNAME`
  - `LEGAL_NAME`

**Example Scenarios:**
```yaml
# Person with multiple known names
ALTERNATE_NAMES:
  - NAME: Elizabeth Windsor
    CONTEXT: BIRTH_NAME
  - NAME: Queen Elizabeth II
    CONTEXT: OFFICIAL_TITLE
  - NAME: Lilibet
    CONTEXT: NICKNAME

# Person with maiden name
ALTERNATE_NAMES:
  - NAME: Mary Johnson
    CONTEXT: MAIDEN_NAME
  - NAME: Mary Smith
    CONTEXT: MARRIED_NAME

# No alternate names known
ALTERNATE_NAMES: []
# OR
ALTERNATE_NAMES: UNKNOWN
```

---

### 6. FAMILY_NAME (Optional)
```yaml
FAMILY_NAME: Smith
```
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Usage:** Surname/Last name for family grouping

---

### 7. GENDER (Optional)
```yaml
GENDER: MALE
```
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Accepted Values:** `MALE`, `FEMALE`, `UNKNOWN`, `null`

---

### 8. GENERAL_DESCRIPTION (Optional)
```yaml
GENERAL_DESCRIPTION: >
  John Smith was a prominent businessman in Colombo during the mid-20th century.
  He established several successful trading companies and was known for his
  philanthropic work in education. He served on multiple charity boards and
  was awarded the title of Justice of the Peace in 1965.
```
- **Type:** String (multi-line supported with `>`)
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Usage:** Biographical summary, achievements, notable facts

**Tips:**
- Use `>` for multi-line text with automatic line wrapping
- Keep it concise but informative
- Include notable achievements, roles, or characteristics

---

### 9. BIRTH (Optional)
```yaml
BIRTH:
  DATE: 1950-05-15
  PLACE: Colombo, Sri Lanka
  NOTES: Born at General Hospital.
```

- **Type:** Object OR String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Can be:** Object with sub-fields, `UNKNOWN`, or `null`

#### DATE Sub-field
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Accepted Formats:**
  - `YYYY` (e.g., `1950`)
  - `YYYY-MM` (e.g., `1950-05`)
  - `YYYY-MM-DD` (e.g., `1950-05-15`)
  - `YYYY-MM-DD HH` (e.g., `1950-05-15 14`)
  - `YYYY-MM-DD HH:MM` (e.g., `1950-05-15 14:30`)
  - `YYYY-MM-DD HH:MM:SS` (e.g., `1950-05-15 14:30:00`)
  - `UNKNOWN` or `null`

#### PLACE Sub-field
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`

#### NOTES Sub-field
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`

**Examples:**
```yaml
# Full details known
BIRTH:
  DATE: 1950-05-15
  PLACE: Colombo, Sri Lanka
  NOTES: Born at General Hospital, Colombo.

# Only year known
BIRTH:
  DATE: 1950
  PLACE: UNKNOWN
  NOTES: UNKNOWN

# Approximate date
BIRTH:
  DATE: 1950-05
  PLACE: Kandy
  NOTES: Exact day unknown, registered in May.

# No birth information
BIRTH: UNKNOWN
```

---

### 10. DEATH (Optional)
```yaml
DEATH:
  DATE: 2020-12-01
  PLACE: Colombo
  NOTES: Passed away peacefully at home.
```

- **Type:** Object OR String
- **Required:** NO
- **Default:** `"ALIVE"`
- **Accepted Values:**
  - Object with sub-fields (DATE, PLACE, NOTES)
  - `"ALIVE"` - Person is currently living
  - `"DECEASED"` - Person has passed but no details available
  - `"UNKNOWN"` - Death status unknown
  - `null` - Assumed alive

#### Sub-fields (DATE, PLACE, NOTES)
Same format and rules as BIRTH fields.

**Examples:**
```yaml
# Person is alive (default - can be omitted)
DEATH:
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN

# Person deceased with details
DEATH:
  DATE: 2020-12-01
  PLACE: Colombo, Sri Lanka
  NOTES: Passed away after a brief illness.

# Person deceased, details unknown
DEATH: DECEASED

# Status unknown
DEATH: UNKNOWN
```

---

### 11. LIVED (Optional)
```yaml
LIVED:
  - PLACE: Kandy, Sri Lanka
    FORM_DATE: 1950
    TO_DATE: 1975
    NOTES: Childhood and education period.
    
  - PLACE: Colombo, Sri Lanka
    FORM_DATE: 1975
    TO_DATE: CURRENT
    NOTES: Established business and family here.
```

- **Type:** List of Objects OR String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Can be:** Empty list `[]`, `UNKNOWN`, `null`, or list of residence objects

#### PLACE Sub-field (Required if LIVED entries exist)
- **Type:** String
- **Required:** YES (for each residence entry)
- **Cannot be:** `UNKNOWN` or `null`

#### FORM_DATE Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Accepted Formats:** Same as BIRTH DATE formats

#### TO_DATE Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Accepted Values:**
  - Date formats (same as FORM_DATE)
  - `"CURRENT"` - Still living there
  - `"UNKNOWN"` - Left but date unknown
  - `null`

#### NOTES Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`

**Examples:**
```yaml
# Person lived in multiple places
LIVED:
  - PLACE: Kandy, Sri Lanka
    FORM_DATE: 1950
    TO_DATE: 1968
    NOTES: Childhood and school years.
    
  - PLACE: London, UK
    FORM_DATE: 1968
    TO_DATE: 1975
    NOTES: University education.
    
  - PLACE: Colombo, Sri Lanka
    FORM_DATE: 1975
    TO_DATE: CURRENT
    NOTES: Returned after studies, established career.

# Only current residence known
LIVED:
  - PLACE: Colombo, Sri Lanka
    FORM_DATE: UNKNOWN
    TO_DATE: CURRENT
    NOTES: Current residence.

# No residence history known
LIVED: UNKNOWN
```

---

### 12. ROLE_AND_STATUS (Optional)
```yaml
ROLE_AND_STATUS:
  - TITLE: Chief Executive Officer
    INSTITUTION: ABC Corporation
    FORM_DATE: 2005
    TO_DATE: CURRENT
    NOTES: Founded and leads the company.
    
  - TITLE: Board Member
    INSTITUTION: Charity Foundation
    FORM_DATE: 2010
    TO_DATE: 2020
    NOTES: Served on advisory board.
```

- **Type:** List of Objects OR String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Usage:** Professional roles, titles, positions held

#### TITLE Sub-field (Required if ROLE_AND_STATUS entries exist)
- **Type:** String
- **Required:** YES (for each role entry)
- **Cannot be:** `UNKNOWN` or `null`

#### INSTITUTION Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`

#### FORM_DATE Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Formats:** Same as BIRTH DATE

#### TO_DATE Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Values:**
  - Date formats
  - `"CURRENT"` - Still holds this position
  - `"UNKNOWN"`

#### NOTES Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`

**Examples:**
```yaml
# Multiple roles over time
ROLE_AND_STATUS:
  - TITLE: Software Engineer
    INSTITUTION: Tech Solutions Ltd
    FORM_DATE: 2000
    TO_DATE: 2005
    NOTES: Started career as developer.
    
  - TITLE: Senior Manager
    INSTITUTION: Tech Solutions Ltd
    FORM_DATE: 2005
    TO_DATE: 2015
    NOTES: Promoted to management.
    
  - TITLE: Chief Technology Officer
    INSTITUTION: Innovation Corp
    FORM_DATE: 2015
    TO_DATE: CURRENT
    NOTES: Current position, leading technology strategy.

# Single current role
ROLE_AND_STATUS:
  - TITLE: Professor of Biology
    INSTITUTION: University of Colombo
    FORM_DATE: 2010
    TO_DATE: CURRENT
    NOTES: Teaching and research.
```

---

### 13. SOURCES (Optional)
```yaml
SOURCES:
  - SOURCE_NAME: Birth Certificate
    NOTE: Official government record.
    PATH: ASSIST/BIRTH_CERT_001.PDF
    
  - SOURCE_NAME: Marriage Registry
    NOTE: Marriage documentation from 1975.
    PATH: ASSIST/MARRIAGE_REG_075.PDF
```

- **Type:** List of Objects OR String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Usage:** Documentation supporting the member's information

#### SOURCE_NAME Sub-field (Required if SOURCES entries exist)
- **Type:** String
- **Required:** YES (for each source entry)
- **Cannot be:** `UNKNOWN` or `null`

#### NOTE Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`

#### PATH Sub-field (Required if SOURCES entries exist)
- **Type:** String (valid file path)
- **Required:** YES (for each source entry)
- **Cannot be:** `UNKNOWN` or `null`

**Examples:**
```yaml
# Multiple sources
SOURCES:
  - SOURCE_NAME: National Identity Card
    NOTE: Verified identity and birth date.
    PATH: ASSIST/NIC_COPY_12345.PDF
    
  - SOURCE_NAME: Employment Records
    NOTE: Career history from company archives.
    PATH: ASSIST/EMPLOYMENT_HISTORY.PDF
    
  - SOURCE_NAME: Family Bible
    NOTE: Handwritten family records from 1850.
    PATH: ASSIST/FAMILY_BIBLE_SCAN.PDF

# No sources available
SOURCES: []
```

---

### 14. PARENTS (Optional)
```yaml
PARENTS:
  FATHER: MID00-G49-002-01
  MOTHER: MID00-G49-003-02
```

- **Type:** Object OR String
- **Required:** NO
- **Default:** `"UNKNOWN"`

#### FATHER Sub-field
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Accepted Values:**
  - Valid member ID (must exist in database)
  - `"UNKNOWN"`
  - `null`

#### MOTHER Sub-field
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Accepted Values:** Same as FATHER

**Examples:**
```yaml
# Both parents known
PARENTS:
  FATHER: MID01-G49-005-01
  MOTHER: MID02-G49-008-02

# Only father known
PARENTS:
  FATHER: MID01-G49-005-01
  MOTHER: UNKNOWN

# Parents unknown
PARENTS:
  FATHER: UNKNOWN
  MOTHER: UNKNOWN
# OR simply
PARENTS: UNKNOWN
```

**Important Notes:**
- IDs must reference existing member files
- Can include biological, adoptive, or step-parents
- Step-parents are automatically recognized through partner info

---

### 15. MARRIAGES (Optional)
```yaml
MARRIAGES:
  - PARTNER: MID01-G50-010-02
    DATE: 1975-06-15
    PLACE: Galle Face Hotel, Colombo
    FATE: ONGOING
    CHILDREN:
      - CHILD: MID01-G51-010-01
        ORDER: 1
        PARENTAGE: BIOLOGICAL
      - CHILD: MID01-G51-010-02
        ORDER: 2
        PARENTAGE: BIOLOGICAL
```

- **Type:** List of Objects OR String
- **Required:** NO
- **Default:** `"UNMARRIED"`
- **Accepted Values:**
  - List of marriage objects
  - `[]` - Unknown marital status
  - `"UNMARRIED"` - Person never married
  - `"MARRIED"` - Married but no details available
  - `"UNKNOWN"` - Marital status unknown
  - `null` - Same as UNKNOWN

#### PARTNER Sub-field (Required if MARRIAGES entries exist)
- **Type:** String
- **Required:** YES (for each marriage entry)
- **Must be:** Valid member ID
- **Cannot be:** `UNKNOWN` or `null`

#### DATE Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Formats:** Same as BIRTH DATE

#### PLACE Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`

#### FATE Sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Accepted Values:**
  - `"ONGOING"` - Marriage is current/lasted until death
  - `"SEPARATED"` - Marriage ended in separation/divorce
  - `"UNKNOWN"` - Fate unknown
  - `null`

**Important:** If `"ONGOING"` is used for multiple partners, it indicates polygamous marriages occurring simultaneously.

#### CHILDREN Sub-field (Optional)
- **Type:** List of Objects OR String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Accepted Values:**
  - List of child objects
  - `[]` - Unknown if there are children
  - `"NONE"` - No children from this marriage
  - `"UNKNOWN"` - Unknown
  - `null`

##### CHILD Sub-sub-field (Required if CHILDREN entries exist)
- **Type:** String
- **Required:** YES (for each child entry)
- **Must be:** Valid member ID
- **Cannot be:** `UNKNOWN` or `null`

##### ORDER Sub-sub-field (Optional)
- **Type:** Integer OR String
- **Required:** NO
- **Default:** `"UNKNOWN"`
- **Accepted Values:**
  - Integer (1, 2, 3, etc.)
  - `"UNKNOWN"`
  - `null`

##### PARENTAGE Sub-sub-field (Optional)
- **Type:** String
- **Required:** NO
- **Default:** `"BIOLOGICAL"`
- **Accepted Values:**
  - `"BIOLOGICAL"` - Natural child
  - `"ADOPTED"` - Adopted child
  - `"UNKNOWN"` - Parentage uncertain
  - `null`

**Note:** Step-children are automatically recognized through their own partner info, so `"STEP"` is not allowed.

**Examples:**
```yaml
# Single marriage with children
MARRIAGES:
  - PARTNER: MID02-G50-015-01
    DATE: 1980-04-10
    PLACE: St. Mary's Church, Kandy
    FATE: ONGOING
    CHILDREN:
      - CHILD: MID01-G51-020-01
        ORDER: 1
        PARENTAGE: BIOLOGICAL
      - CHILD: MID01-G51-020-02
        ORDER: 2
        PARENTAGE: BIOLOGICAL
      - CHILD: MID01-G51-020-03
        ORDER: 3
        PARENTAGE: ADOPTED

# Marriage with no children
MARRIAGES:
  - PARTNER: MID03-G50-022-01
    DATE: 1995-11-20
    PLACE: Hilton Colombo
    FATE: ONGOING
    CHILDREN: NONE

# Multiple marriages
MARRIAGES:
  - PARTNER: MID04-G50-008-02
    DATE: 1970-03-15
    PLACE: UNKNOWN
    FATE: SEPARATED
    CHILDREN:
      - CHILD: MID01-G51-008-01
        ORDER: 1
        PARENTAGE: BIOLOGICAL
        
  - PARTNER: MID05-G50-012-01
    DATE: 1985-07-22
    PLACE: Mount Lavinia Hotel
    FATE: ONGOING
    CHILDREN:
      - CHILD: MID01-G51-012-01
        ORDER: 1
        PARENTAGE: BIOLOGICAL
      - CHILD: MID01-G51-012-02
        ORDER: 2
        PARENTAGE: BIOLOGICAL

# Never married
MARRIAGES: UNMARRIED

# Married but no details
MARRIAGES: MARRIED

# Unknown marital status
MARRIAGES: UNKNOWN
```

---

## Adding New Members

### Step-by-Step Process

#### Step 1: Determine the ID
1. Identify the family tree branch (`MID##`)
2. Calculate the generation number (`G##`)
3. Get the father's family ID (`###`)
4. Determine birth order (`##`)

**Example:** Adding a second child to father `MID01-G50-005-03`:
```
New ID: MID01-G51-005-02
```

#### Step 2: Create the YAML File
1. Create a new file: `{ID} - {SHORT_NAME}.yaml`
2. Copy the template structure (see Template below)
3. Fill in known information
4. Use `UNKNOWN` or `null` for missing data

#### Step 3: Update files.json
Add the new filename to the `files.json` array:
```json
[
    "existing-file-1.yaml",
    "existing-file-2.yaml",
    "MID01-G51-005-02 - New Person.yaml"
]
```

#### Step 4: Validate
Check:
- ✅ ID format is correct
- ✅ Filename matches ID and SHORT_NAME
- ✅ Required fields are present
- ✅ Referenced IDs exist in database
- ✅ files.json updated

### Absolute Minimal Template (Only Required Fields)
When you want all fields to use their default values, you only need to specify the ID:

```yaml
ID: MID##-G##-###-##
```

**That's it!** All other fields will automatically use their defaults:
- `PROFILE_PICTURE`: `/assets/members-img/person.png`
- `SHORT_NAME`: `"Unknown Name"`
- `FULL_NAME`: `"Unknown Name"`
- `ALTERNATE_NAMES`: `"UNKNOWN"`
- `FAMILY_NAME`: `"UNKNOWN"`
- `GENDER`: `"UNKNOWN"`
- `GENERAL_DESCRIPTION`: `"UNKNOWN"`
- `BIRTH`: `"UNKNOWN"`
- `DEATH`: `"ALIVE"`
- `LIVED`: `"UNKNOWN"`
- `ROLE_AND_STATUS`: `"UNKNOWN"`
- `SOURCES`: `"UNKNOWN"`
- `PARENTS`: `"UNKNOWN"`
- `MARRIAGES`: `"UNMARRIED"`

### Practical Minimal Template (With Basic Info)
For most cases, you'll want to include at least the basic identifying information:

```yaml
ID: MID##-G##-###-##
SHORT_NAME: First Last
FULL_NAME: First Middle Last
FAMILY_NAME: Last
GENDER: MALE
```

All other fields will use defaults.

### Standard Template (Common Fields)
This template includes the most commonly filled fields:

```yaml
ID: MID##-G##-###-##
PROFILE_PICTURE: UNKNOWN
SHORT_NAME: First Last
FULL_NAME: First Middle Last

ALTERNATE_NAMES: []

FAMILY_NAME: Last
GENDER: UNKNOWN
GENERAL_DESCRIPTION: UNKNOWN

BIRTH:
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN

DEATH:
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN

LIVED: []

ROLE_AND_STATUS: []

SOURCES: []

PARENTS:
  FATHER: UNKNOWN
  MOTHER: UNKNOWN

MARRIAGES: UNMARRIED
```

### Complete Template with All Fields
```yaml
ID: MID##-G##-###-##
PROFILE_PICTURE: /Image/Contemporary/Profile.jpg
SHORT_NAME: John Smith
FULL_NAME: John Michael Smith

ALTERNATE_NAMES:
  - NAME: J. M. Smith
    CONTEXT: OFFICIAL_DOCUMENTS
  - NAME: Johnny
    CONTEXT: NICKNAME

FAMILY_NAME: Smith
GENDER: MALE
GENERAL_DESCRIPTION: >
  Brief biography and notable information about the person.
  Can span multiple lines.

BIRTH:
  DATE: 1950-05-15
  PLACE: Colombo, Sri Lanka
  NOTES: Born at General Hospital.

DEATH:
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN

LIVED:
  - PLACE: Kandy, Sri Lanka
    FORM_DATE: 1950
    TO_DATE: 1968
    NOTES: Childhood years.
    
  - PLACE: Colombo, Sri Lanka
    FORM_DATE: 1968
    TO_DATE: CURRENT
    NOTES: Current residence.

ROLE_AND_STATUS:
  - TITLE: Chief Executive Officer
    INSTITUTION: ABC Corporation
    FORM_DATE: 2000
    TO_DATE: CURRENT
    NOTES: Founder and current CEO.

SOURCES:
  - SOURCE_NAME: Birth Certificate
    NOTE: Official birth registration.
    PATH: ASSIST/BIRTH_CERT_001.PDF
    
  - SOURCE_NAME: Identity Card
    NOTE: National ID verification.
    PATH: ASSIST/NIC_001.PDF

PARENTS:
  FATHER: MID##-G##-###-##
  MOTHER: MID##-G##-###-##

MARRIAGES:
  - PARTNER: MID##-G##-###-##
    DATE: 1975-06-15
    PLACE: Galle Face Hotel, Colombo
    FATE: ONGOING
    CHILDREN:
      - CHILD: MID##-G##-###-##
        ORDER: 1
        PARENTAGE: BIOLOGICAL
      - CHILD: MID##-G##-###-##
        ORDER: 2
        PARENTAGE: BIOLOGICAL
```

---

## Updating Existing Records

### General Guidelines
1. **Never change the ID** - IDs are permanent identifiers
2. **Update files.json if renaming** - If SHORT_NAME changes
3. **Maintain referential integrity** - Ensure referenced IDs exist
4. **Document changes** - Use NOTES fields to explain updates

### Common Update Scenarios

#### Adding Missing Information
Simply fill in fields that were previously `UNKNOWN`:

**Before:**
```yaml
BIRTH:
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN
```

**After:**
```yaml
BIRTH:
  DATE: 1950-05-15
  PLACE: Colombo, Sri Lanka
  NOTES: Found birth certificate in family records.
```

#### Correcting Errors
Replace incorrect information and document the correction:

**Before:**
```yaml
BIRTH:
  DATE: 1950-05-15
  PLACE: Kandy
  NOTES: UNKNOWN
```

**After:**
```yaml
BIRTH:
  DATE: 1950-06-15
  PLACE: Colombo
  NOTES: Corrected from family records - was incorrectly recorded as May 15.
```

#### Adding New Life Events
Append to lists (LIVED, ROLE_AND_STATUS, etc.):

**Before:**
```yaml
LIVED:
  - PLACE: Kandy, Sri Lanka
    FORM_DATE: 1950
    TO_DATE: CURRENT
    NOTES: Entire life.
```

**After:**
```yaml
LIVED:
  - PLACE: Kandy, Sri Lanka
    FORM_DATE: 1950
    TO_DATE: 1975
    NOTES: Childhood and early career.
    
  - PLACE: Colombo, Sri Lanka
    FORM_DATE: 1975
    TO_DATE: CURRENT
    NOTES: Moved for career advancement.
```

#### Recording a Death
Update from ALIVE status:

**Before:**
```yaml
DEATH:
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN
```

**After:**
```yaml
DEATH:
  DATE: 2023-12-01
  PLACE: Colombo, Sri Lanka
  NOTES: Passed away peacefully at home, surrounded by family.
```

Also update relevant LIVED and ROLE_AND_STATUS entries:
```yaml
LIVED:
  - PLACE: Colombo, Sri Lanka
    FORM_DATE: 1975
    TO_DATE: 2023  # Changed from CURRENT
    NOTES: Primary residence until passing.

ROLE_AND_STATUS:
  - TITLE: Chief Executive Officer
    INSTITUTION: ABC Corporation
    FORM_DATE: 2000
    TO_DATE: 2023  # Changed from CURRENT
    NOTES: Served until passing.
```

#### Adding a Marriage
**Before:**
```yaml
MARRIAGES: UNMARRIED
```

**After:**
```yaml
MARRIAGES:
  - PARTNER: MID02-G50-015-01
    DATE: 2023-06-15
    PLACE: Hilton Colombo
    FATE: ONGOING
    CHILDREN: []
```

#### Adding Children to Existing Marriage
**Before:**
```yaml
MARRIAGES:
  - PARTNER: MID02-G50-015-01
    DATE: 2020-06-15
    PLACE: Hilton Colombo
    FATE: ONGOING
    CHILDREN: NONE
```

**After:**
```yaml
MARRIAGES:
  - PARTNER: MID02-G50-015-01
    DATE: 2020-06-15
    PLACE: Hilton Colombo
    FATE: ONGOING
    CHILDREN:
      - CHILD: MID01-G51-015-01
        ORDER: 1
        PARENTAGE: BIOLOGICAL
```

Remember to:
1. Create the child's own YAML file
2. Update files.json with the new child's filename
3. Set the child's PARENTS to reference both parents

---

## Common Scenarios

### Scenario 1: Adding a Newborn
```yaml
# New file: MID01-G52-020-03 - Baby Smith.yaml

ID: MID01-G52-020-03
PROFILE_PICTURE: /Image/Contemporary/Baby_Profile.jpg
SHORT_NAME: Sarah Smith
FULL_NAME: Sarah Elizabeth Smith

ALTERNATE_NAMES: []

FAMILY_NAME: Smith
GENDER: FEMALE
GENERAL_DESCRIPTION: >
  Third child of John and Mary Smith, born in Colombo.

BIRTH:
  DATE: 2024-01-15
  PLACE: Asiri Hospital, Colombo
  NOTES: Healthy birth, 3.