#!/bin/bash

# YAML Profile File Generator with JSON Index
# Generates dummy profile YAML files with varying data completeness and referential integrity

# Arrays for generating random data
FIRST_NAMES_MALE=("Saman" "Kasun" "Nuwan" "Tharindu" "Dilshan" "Chamara" "Ravindra" "Dimuthu" "Pradeep" "Mahesh" "Roshan" "Gayan" "Ashan" "Buddhika" "Chathura" "Sampath" "Nimal" "Sunil" "Ajith" "Ruwan")
FIRST_NAMES_FEMALE=("Malsha" "Nethmi" "Hiruni" "Sachini" "Thilini" "Pavithra" "Dulani" "Sanduni" "Chamari" "Nadeeka" "Anusha" "Madhavi" "Ruwani" "Shani" "Upeksha" "Kumari" "Dilini" "Ayesha" "Nimali" "Rashmi")
LAST_NAMES=("Silva" "Perera" "Fernando" "Jayawardena" "Wickramasinghe" "Gunawardena" "Dissanayake" "Rajapaksa" "Bandara" "Wijesinghe" "Karunaratne" "Senanayake" "Mendis" "Amarasinghe" "Liyanage" "Gunasekara" "Rodrigo" "De Silva" "Senarath" "Ratnayake")
CITIES=("Colombo" "Kandy" "Galle" "Jaffna" "Negombo" "Anuradhapura" "Matara" "Kurunegala" "Ratnapura" "Batticaloa" "Trincomalee" "Badulla" "Ampara" "Puttalam" "Kegalle" "Nuwara Eliya" "Chilaw" "Hambantota" "Kalutara" "Vavuniya")
COMPANIES=("Tech Solutions Lanka" "Green Valley Exports" "Ocean Wave Industries" "Summit Trading Co." "Global Textile Mills" "Metro Consultancy" "Sunrise Enterprises" "Blue Ocean Holdings" "Peak Performance Ltd" "Island Innovations" "Lanka Digital Services" "Ceylon Manufacturing Co" "Tropical Ventures" "Harbor Logistics" "Zenith Corporation")
TITLES=("Chief Executive Officer" "Managing Director" "Senior Manager" "Director of Operations" "General Manager" "Vice President" "Operations Manager" "Head of Department" "Chief Financial Officer" "Director of Human Resources" "Project Manager" "Senior Consultant" "Business Development Manager" "Marketing Director" "IT Manager")
CONTEXTS=("OFFICIAL_DOCUMENTS" "SOCIAL_REFERENCE" "MAIDEN_NAME" "BAPTISMAL_NAME" "BIRTH_NAME" "NICKNAME")
MARRIAGE_PLACES=("Galle Face Hotel, Colombo" "Cinnamon Grand, Colombo" "Mount Lavinia Hotel" "Hilton Colombo" "Taj Samudra, Colombo" "Kandy Hotel" "Queens Hotel, Kandy" "Jetwing Beach, Negombo" "St. Mary's Church, Colombo" "Sacred Heart Church, Galle" "Buddhist Temple, Kandy" "Hindu Temple, Jaffna" "Registry Office, Colombo")

# Arrays to track generated data
declare -a FILENAMES
declare -A GENERATED_MEMBERS  # Associative array: ID -> "GENDER|BIRTH_YEAR|NAME"
declare -A PENDING_REFERENCES  # IDs that need to be generated due to references

# Function to generate random date
generate_random_date() {
    local start_year=$1
    local end_year=$2
    local year=$((start_year + RANDOM % (end_year - start_year + 1)))
    local month=$(printf "%02d" $((1 + RANDOM % 12)))
    local day=$(printf "%02d" $((1 + RANDOM % 28)))
    echo "${year}-${month}-${day}"
}

# Function to generate a unique ID
generate_unique_id() {
    local generation=${1:-$((50 + RANDOM % 3))}
    local id=""
    local max_attempts=100
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        id=$(printf "MID%02d-G%02d-%03d-%02d" $((RANDOM % 100)) $generation $((RANDOM % 1000)) $((RANDOM % 100)))
        
        # Check if ID already exists
        if [ -z "${GENERATED_MEMBERS[$id]}" ]; then
            echo "$id"
            return 0
        fi
        ((attempt++))
    done
    
    echo "$id"  # Return anyway if max attempts reached
}

# Function to register a member
register_member() {
    local id=$1
    local gender=$2
    local birth_year=$3
    local name=$4
    
    GENERATED_MEMBERS[$id]="${gender}|${birth_year}|${name}"
}

# Function to get member info
get_member_info() {
    local id=$1
    echo "${GENERATED_MEMBERS[$id]}"
}

# Function to mark ID as needing generation
mark_for_generation() {
    local id=$1
    if [ -z "${GENERATED_MEMBERS[$id]}" ]; then
        PENDING_REFERENCES[$id]=1
    fi
}

# Function to generate related member (parent, spouse, child)
generate_related_member() {
    local id=$1
    local relation=$2  # "PARENT", "SPOUSE", "CHILD"
    local ref_birth_year=$3
    local ref_gender=$4
    
    local generation=$(echo $id | grep -oP 'G\K\d+')
    local gender=""
    local birth_year=""
    local first_name=""
    local last_name=${LAST_NAMES[$((RANDOM % ${#LAST_NAMES[@]}))]}
    
    case $relation in
        "PARENT")
            # Parents are older, previous generation
            birth_year=$((ref_birth_year - 25 - RANDOM % 10))
            if [ $((RANDOM % 2)) -eq 0 ]; then
                gender="MALE"
                first_name=${FIRST_NAMES_MALE[$((RANDOM % ${#FIRST_NAMES_MALE[@]}))]}
            else
                gender="FEMALE"
                first_name=${FIRST_NAMES_FEMALE[$((RANDOM % ${#FIRST_NAMES_FEMALE[@]}))]}
            fi
            ;;
        "SPOUSE")
            # Spouse is similar age
            birth_year=$((ref_birth_year + (RANDOM % 10) - 5))
            if [ "$ref_gender" == "MALE" ]; then
                gender="FEMALE"
                first_name=${FIRST_NAMES_FEMALE[$((RANDOM % ${#FIRST_NAMES_FEMALE[@]}))]}
            else
                gender="MALE"
                first_name=${FIRST_NAMES_MALE[$((RANDOM % ${#FIRST_NAMES_MALE[@]}))]}
            fi
            ;;
        "CHILD")
            # Children are younger, next generation
            birth_year=$((ref_birth_year + 25 + RANDOM % 10))
            if [ $((RANDOM % 2)) -eq 0 ]; then
                gender="MALE"
                first_name=${FIRST_NAMES_MALE[$((RANDOM % ${#FIRST_NAMES_MALE[@]}))]}
            else
                gender="FEMALE"
                first_name=${FIRST_NAMES_FEMALE[$((RANDOM % ${#FIRST_NAMES_FEMALE[@]}))]}
            fi
            ;;
    esac
    
    local name="${first_name} ${last_name}"
    register_member "$id" "$gender" "$birth_year" "$name"
    
    # Generate minimal file for this related member
    generate_file_minimal "$id" "$name" "$last_name" "$gender"
}

# Function to generate file with only ID (5%)
generate_file_id_only() {
    local id=$1
    local filename="${id} - Member.yaml"
    
    FILENAMES+=("$filename")
    
    cat > "$filename" << EOF
ID: $id
EOF
}

# Function to generate file with ID + vital stats (5%)
generate_file_vital_stats() {
    local id=$1
    local name=$2
    local last_name=$3
    local gender=$4
    
    local birth_date=$(generate_random_date 1950 2010)
    local birth_year=$(echo $birth_date | cut -d'-' -f1)
    local birth_city=${CITIES[$((RANDOM % ${#CITIES[@]}))]}
    
    # Random death status
    local is_deceased=$((RANDOM % 5))
    
    local filename="${id} - ${name}.yaml"
    FILENAMES+=("$filename")
    
    cat > "$filename" << EOF
ID: $id
SHORT_NAME: $name
GENDER: $gender

BIRTH:
  DATE: $birth_date
  PLACE: $birth_city
  NOTES: UNKNOWN

DEATH:
EOF

    if [ $is_deceased -eq 0 ]; then
        local death_date=$(generate_random_date $((birth_year + 50)) 2024)
        local death_city=${CITIES[$((RANDOM % ${#CITIES[@]}))]}
        cat >> "$filename" << EOF
  DATE: $death_date
  PLACE: $death_city
  NOTES: UNKNOWN
EOF
    else
        cat >> "$filename" << EOF
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN
EOF
    fi
    
    register_member "$id" "$gender" "$birth_year" "$name"
}

# Function to generate file with basic bio-data (15%)
generate_file_basic_bio() {
    local id=$1
    local name=$2
    local last_name=$3
    local gender=$4
    
    local birth_date=$(generate_random_date 1950 2010)
    local birth_year=$(echo $birth_date | cut -d'-' -f1)
    local birth_city=${CITIES[$((RANDOM % ${#CITIES[@]}))]}
    local residence_city=${CITIES[$((RANDOM % ${#CITIES[@]}))]}
    
    local filename="${id} - ${name}.yaml"
    FILENAMES+=("$filename")
    
    cat > "$filename" << EOF
ID: $id
SHORT_NAME: $name
FULL_NAME: $name
FAMILY_NAME: $last_name
GENDER: $gender

BIRTH:
  DATE: $birth_date
  PLACE: $birth_city
  NOTES: UNKNOWN

DEATH:
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN

LIVED:
  - PLACE: ${birth_city}, Sri Lanka
    FORM_DATE: $birth_year
    TO_DATE: CURRENT
    NOTES: UNKNOWN
EOF
    
    register_member "$id" "$gender" "$birth_year" "$name"
}

# Function to generate file with partial details (25%)
generate_file_partial() {
    local id=$1
    local name=$2
    local last_name=$3
    local gender=$4
    
    local birth_date=$(generate_random_date 1950 2010)
    local birth_year=$(echo $birth_date | cut -d'-' -f1)
    local birth_city=${CITIES[$((RANDOM % ${#CITIES[@]}))]}
    local residence_city=${CITIES[$((RANDOM % ${#CITIES[@]}))]}
    local company=${COMPANIES[$((RANDOM % ${#COMPANIES[@]}))]}
    local title=${TITLES[$((RANDOM % ${#TITLES[@]}))]}
    local role_start=$((birth_year + 22 + RANDOM % 15))
    
    local filename="${id} - ${name}.yaml"
    FILENAMES+=("$filename")
    
    cat > "$filename" << EOF
ID: $id
PROFILE_PICTURE: UNKNOWN
SHORT_NAME: $name
FULL_NAME: $name

ALTERNATE_NAMES:
  - NAME: ${name:0:1}. ${last_name}
    CONTEXT: OFFICIAL_DOCUMENTS

FAMILY_NAME: $last_name
GENDER: $gender
GENERAL_DESCRIPTION: UNKNOWN

BIRTH:
  DATE: $birth_date
  PLACE: $birth_city
  NOTES: Born in ${birth_city}, Sri Lanka.

DEATH:
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN

LIVED:
  - PLACE: ${birth_city}, Sri Lanka
    FORM_DATE: $birth_year
    TO_DATE: $((birth_year + 20))
    NOTES: Childhood and education.
    
  - PLACE: ${residence_city}, Sri Lanka
    FORM_DATE: $((birth_year + 20))
    TO_DATE: CURRENT
    NOTES: Current residence.

ROLE_AND_STATUS:
  - TITLE: $title
    INSTITUTION: $company
    FORM_DATE: $role_start
    TO_DATE: CURRENT
    NOTES: UNKNOWN

PARENTS:
  FATHER: UNKNOWN
  MOTHER: UNKNOWN

MARRIAGES: UNKNOWN
EOF
    
    register_member "$id" "$gender" "$birth_year" "$name"
}

# Function to generate file with comprehensive data (50%)
generate_file_comprehensive() {
    local id=$1
    local name=$2
    local last_name=$3
    local gender=$4
    
    local birth_date=$(generate_random_date 1950 2000)
    local birth_year=$(echo $birth_date | cut -d'-' -f1)
    local birth_city=${CITIES[$((RANDOM % ${#CITIES[@]}))]}
    local residence_city=${CITIES[$((RANDOM % ${#CITIES[@]}))]}
    local company=${COMPANIES[$((RANDOM % ${#COMPANIES[@]}))]}
    local title=${TITLES[$((RANDOM % ${#TITLES[@]}))]}
    local role_start=$((birth_year + 22 + RANDOM % 10))
    
    local generation=$(echo $id | grep -oP 'G\K\d+')
    
    # Generate parent IDs
    local father_gen=$((generation - 1))
    local mother_gen=$((generation - 1))
    local father_id=$(generate_unique_id $father_gen)
    local mother_id=$(generate_unique_id $mother_gen)
    
    mark_for_generation "$father_id"
    mark_for_generation "$mother_id"
    
    # Decide on marriage (70% chance)
    local has_marriage=$((RANDOM % 10))
    local marriage_section=""
    
    if [ $has_marriage -lt 7 ]; then
        local spouse_gen=$generation
        local spouse_id=$(generate_unique_id $spouse_gen)
        mark_for_generation "$spouse_id"
        
        local marriage_date=$(generate_random_date $((birth_year + 22)) $((birth_year + 35)))
        local marriage_place=${MARRIAGE_PLACES[$((RANDOM % ${#MARRIAGE_PLACES[@]}))]}
        local fate_choice=$((RANDOM % 10))
        local fate="ONGOING"
        if [ $fate_choice -eq 0 ]; then
            fate="SEPARATED"
        fi
        
        # Generate children (0-4)
        local num_children=$((RANDOM % 5))
        local children_section=""
        
        if [ $num_children -eq 0 ]; then
            children_section="    CHILDREN: NONE"
        else
            children_section="    CHILDREN:"
            for ((j=1; j<=num_children; j++)); do
                local child_gen=$((generation + 1))
                local child_id=$(generate_unique_id $child_gen)
                mark_for_generation "$child_id"
                
                local parentage="BIOLOGICAL"
                if [ $((RANDOM % 20)) -eq 0 ]; then
                    parentage="ADOPTED"
                fi
                
                children_section="${children_section}
      - CHILD: $child_id
        ORDER: $j
        PARENTAGE: $parentage"
            done
        fi
        
        marriage_section="MARRIAGES:
  - PARTNER: $spouse_id
    DATE: $marriage_date
    PLACE: $marriage_place
    FATE: $fate
$children_section"
    else
        marriage_section="MARRIAGES: UNMARRIED"
    fi
    
    local filename="${id} - ${name}.yaml"
    FILENAMES+=("$filename")
    
    cat > "$filename" << EOF
ID: $id
PROFILE_PICTURE: /Image/Contemporary/${name// /_}_Profile.jpg
SHORT_NAME: $name
FULL_NAME: $name

ALTERNATE_NAMES:
  - NAME: ${name:0:1}. ${last_name}
    CONTEXT: OFFICIAL_DOCUMENTS
  - NAME: ${name} ${last_name:0:1}.
    CONTEXT: SOCIAL_REFERENCE

FAMILY_NAME: $last_name
GENDER: $gender
GENERAL_DESCRIPTION: >
  ${name} is a contemporary professional with significant contributions
  to the business and community sectors. Known for leadership qualities
  and dedication to community service. Professional background includes
  extensive experience in management and strategic planning.

BIRTH:
  DATE: $birth_date
  PLACE: $birth_city
  NOTES: Registered birth in ${birth_city}, Sri Lanka.

DEATH:
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN

LIVED:
  - PLACE: ${birth_city}, Sri Lanka
    FORM_DATE: $birth_year
    TO_DATE: $((birth_year + 20))
    NOTES: Childhood and early education period.
    
  - PLACE: ${residence_city}, Sri Lanka
    FORM_DATE: $((birth_year + 20))
    TO_DATE: CURRENT
    NOTES: Primary residence and professional base.

ROLE_AND_STATUS:
  - TITLE: $title
    INSTITUTION: $company
    FORM_DATE: $role_start
    TO_DATE: CURRENT
    NOTES: Current professional position and responsibilities.

SOURCES:
  - SOURCE_NAME: Government ID Records
    NOTE: Verified identity and birth information.
    PATH: ASSIST/NIC_RECORDS_${id}.PDF
    
  - SOURCE_NAME: Company Records
    NOTE: Employment and role verification.
    PATH: ASSIST/COMPANY_RECORDS_${id}.PDF

PARENTS:
  FATHER: $father_id
  MOTHER: $mother_id

$marriage_section
EOF
    
    register_member "$id" "$gender" "$birth_year" "$name"
}

# Function to generate minimal file (for referenced members)
generate_file_minimal() {
    local id=$1
    local name=$2
    local last_name=$3
    local gender=$4
    
    local filename="${id} - ${name}.yaml"
    FILENAMES+=("$filename")
    
    cat > "$filename" << EOF
ID: $id
SHORT_NAME: $name
FULL_NAME: $name
FAMILY_NAME: $last_name
GENDER: $gender
EOF
}

# Function to generate a profile based on percentage
generate_profile() {
    local index=$1
    local total=$2
    local percentage=$((index * 100 / total))
    
    local id=$(generate_unique_id)
    
    # Random gender and name
    local gender=""
    local first_name=""
    if [ $((RANDOM % 2)) -eq 0 ]; then
        gender="MALE"
        first_name=${FIRST_NAMES_MALE[$((RANDOM % ${#FIRST_NAMES_MALE[@]}))]}
    else
        gender="FEMALE"
        first_name=${FIRST_NAMES_FEMALE[$((RANDOM % ${#FIRST_NAMES_FEMALE[@]}))]}
    fi
    
    local last_name=${LAST_NAMES[$((RANDOM % ${#LAST_NAMES[@]}))]}
    local name="${first_name} ${last_name}"
    
    # Determine file type based on distribution
    if [ $percentage -lt 50 ]; then
        # First 50%: Comprehensive
        generate_file_comprehensive "$id" "$name" "$last_name" "$gender"
    elif [ $percentage -lt 75 ]; then
        # Next 25%: Partial
        generate_file_partial "$id" "$name" "$last_name" "$gender"
    elif [ $percentage -lt 90 ]; then
        # Next 15%: Basic bio
        generate_file_basic_bio "$id" "$name" "$last_name" "$gender"
    elif [ $percentage -lt 95 ]; then
        # Next 5%: Vital stats
        generate_file_vital_stats "$id" "$name" "$last_name" "$gender"
    else
        # Last 5%: ID only
        generate_file_id_only "$id"
    fi
}

# Function to create JSON file
create_json_index() {
    echo ""
    echo "Creating files.json index..."
    
    echo "[" > files.json
    
    local total=${#FILENAMES[@]}
    for ((i=0; i<total; i++)); do
        if [ $i -eq $((total-1)) ]; then
            echo "    \"${FILENAMES[$i]}\"" >> files.json
        else
            echo "    \"${FILENAMES[$i]}\"," >> files.json
        fi
    done
    
    echo "]" >> files.json
    
    echo "✓ Created files.json with $total entries"
}

# Main script
clear
echo "=========================================="
echo "   YAML Profile File Generator"
echo "   With Referential Integrity"
echo "=========================================="
echo ""
read -p "How many files do you need? " num_files

# Validate input
if ! [[ "$num_files" =~ ^[0-9]+$ ]] || [ "$num_files" -lt 1 ]; then
    echo "Error: Please enter a valid positive number."
    exit 1
fi

echo ""
echo "Distribution:"
echo "  50% - Comprehensive data (with references)"
echo "  25% - Partial details"
echo "  15% - Basic bio-data"
echo "   5% - Vital statistics only"
echo "   5% - ID only"
echo ""
echo "Generating $num_files profile files..."
echo ""

start_time=$(date +%s)

# Phase 1: Generate main files
for ((i=1; i<=num_files; i++)); do
    generate_profile $i $num_files
    
    if [ $((i % 50)) -eq 0 ]; then
        echo "Phase 1: $i / $num_files main files generated..."
    fi
done

echo ""
echo "Phase 1 complete: $num_files main files generated"
echo ""

# Phase 2: Generate referenced members
echo "Phase 2: Generating referenced members..."
ref_count=0

for id in "${!PENDING_REFERENCES[@]}"; do
    if [ -z "${GENERATED_MEMBERS[$id]}" ]; then
        # Generate this referenced member
        info=$(get_member_info "$id")
        
        if [ -z "$info" ]; then
            # Generate with random data
            local gender=""
            local first_name=""
            if [ $((RANDOM % 2)) -eq 0 ]; then
                gender="MALE"
                first_name=${FIRST_NAMES_MALE[$((RANDOM % ${#FIRST_NAMES_MALE[@]}))]}
            else
                gender="FEMALE"
                first_name=${FIRST_NAMES_FEMALE[$((RANDOM % ${#FIRST_NAMES_FEMALE[@]}))]}
            fi
            
            local last_name=${LAST_NAMES[$((RANDOM % ${#LAST_NAMES[@]}))]}
            local name="${first_name} ${last_name}"
            local birth_year=$((1950 + RANDOM % 50))
            
            register_member "$id" "$gender" "$birth_year" "$name"
            generate_file_minimal "$id" "$name" "$last_name" "$gender"
            ((ref_count++))
        fi
    fi
done

end_time=$(date +%s)
elapsed=$((end_time - start_time))

echo "Phase 2 complete: $ref_count referenced members generated"
echo ""
echo "=========================================="
echo "✓ Successfully generated all YAML files!"
echo "  Main files: $num_files"
echo "  Referenced members: $ref_count"
echo "  Total files: $((num_files + ref_count))"
echo "  Time taken: ${elapsed} seconds"
echo ""

create_json_index

echo "=========================================="
echo "Generation Complete!"
echo "  - $((num_files + ref_count)) YAML profile files"
echo "  - 1 files.json index"
echo "  - All references resolved"
echo "  - All files in current directory"
echo "=========================================="
