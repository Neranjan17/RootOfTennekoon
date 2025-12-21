#!/bin/bash

# YAML Profile File Generator with JSON Index
# Generates dummy profile YAML files and creates a files.json index

# Arrays for generating random data
FIRST_NAMES_MALE=("Saman" "Kasun" "Nuwan" "Tharindu" "Dilshan" "Chamara" "Ravindra" "Dimuthu" "Pradeep" "Mahesh")
FIRST_NAMES_FEMALE=("Malsha" "Nethmi" "Hiruni" "Sachini" "Thilini" "Pavithra" "Dulani" "Sanduni" "Chamari" "Nadeeka")
LAST_NAMES=("Silva" "Perera" "Fernando" "Jayawardena" "Wickramasinghe" "Gunawardena" "Dissanayake" "Rajapaksa" "Bandara" "Wijesinghe")
CITIES=("Colombo" "Kandy" "Galle" "Jaffna" "Negombo" "Anuradhapura" "Matara" "Kurunegala" "Ratnapura" "Batticaloa")
COMPANIES=("Tech Solutions Lanka" "Green Valley Exports" "Ocean Wave Industries" "Summit Trading Co." "Global Textile Mills" "Metro Consultancy" "Sunrise Enterprises" "Blue Ocean Holdings" "Peak Performance Ltd" "Island Innovations")
TITLES=("Chief Executive Officer (CEO)" "Managing Director" "Senior Manager" "Director" "General Manager" "Vice President" "Operations Manager" "Head of Department")

# Array to store all generated filenames
declare -a FILENAMES

# Function to generate random date
generate_random_date() {
    local start_year=$1
    local end_year=$2
    local year=$((start_year + RANDOM % (end_year - start_year + 1)))
    local month=$(printf "%02d" $((1 + RANDOM % 12)))
    local day=$(printf "%02d" $((1 + RANDOM % 28)))
    echo "${year}-${month}-${day}"
}

# Function to generate a single profile
generate_profile() {
    local index=$1
    local generation=$((50 + RANDOM % 3)) # G50, G51, G52
    local id=$(printf "MID%02d-G%d-%03d-%02d" $((RANDOM % 100)) $generation $((RANDOM % 1000)) $((RANDOM % 100)))
    
    # Random gender
    if [ $((RANDOM % 2)) -eq 0 ]; then
        GENDER="MALE"
        FIRST_NAME=${FIRST_NAMES_MALE[$((RANDOM % ${#FIRST_NAMES_MALE[@]}))]}
    else
        GENDER="FEMALE"
        FIRST_NAME=${FIRST_NAMES_FEMALE[$((RANDOM % ${#FIRST_NAMES_FEMALE[@]}))]}
    fi
    
    LAST_NAME=${LAST_NAMES[$((RANDOM % ${#LAST_NAMES[@]}))]}
    FULL_NAME="${FIRST_NAME} ${LAST_NAME}"
    BIRTH_CITY=${CITIES[$((RANDOM % ${#CITIES[@]}))]}
    RESIDENCE_CITY=${CITIES[$((RANDOM % ${#CITIES[@]}))]}
    COMPANY=${COMPANIES[$((RANDOM % ${#COMPANIES[@]}))]}
    TITLE=${TITLES[$((RANDOM % ${#TITLES[@]}))]}
    
    # Generate birth date (1970-2010)
    BIRTH_DATE=$(generate_random_date 1970 2010)
    BIRTH_YEAR=$(echo $BIRTH_DATE | cut -d'-' -f1)
    
    # Generate role start date (2000-2024)
    ROLE_START=$(generate_random_date 2000 2024)
    
    # Generate residence dates
    RESIDENCE_START=$((BIRTH_YEAR + 18 + RANDOM % 10))
    
    # Generate filename
    FILENAME="${id} - ${FIRST_NAME} ${LAST_NAME}.yaml"
    
    # Add filename to array
    FILENAMES+=("$FILENAME")
    
    # Create YAML content
    cat > "$FILENAME" << EOF
ID: $id
PROFILE_PICTURE: /Image/Contemporary/${FIRST_NAME}_Profile.jpg
SHORT_NAME: ${FIRST_NAME} ${LAST_NAME}
FULL_NAME: ${FULL_NAME}

ALTERNATE_NAMES:
  - NAME: ${FIRST_NAME:0:1}. ${LAST_NAME}
    CONTEXT: OFFICIAL_DOCUMENTS
  - NAME: ${FIRST_NAME} ${LAST_NAME:0:1}.
    CONTEXT: SOCIAL_REFERENCE

FAMILY_NAME: ${LAST_NAME}
GENDER: ${GENDER}
GENERAL_DESCRIPTION: >
  ${FULL_NAME} is a contemporary professional with significant contributions
  to the business sector. Known for leadership and community engagement,
  ${FIRST_NAME} has established a notable presence in ${RESIDENCE_CITY}.
  Professional background includes extensive experience in management and
  strategic planning within the private sector.

BIRTH:
  DATE: ${BIRTH_DATE}
  PLACE: ${BIRTH_CITY}
  NOTES: Registered birth in ${BIRTH_CITY}, Sri Lanka.

DEATH:
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN

LIVED:
  - PLACE: ${BIRTH_CITY}, Sri Lanka
    FORM_DATE: ${BIRTH_YEAR}
    TO_DATE: ${RESIDENCE_START}
    NOTES: Childhood and early education.

  - PLACE: ${RESIDENCE_CITY}, Sri Lanka
    FORM_DATE: ${RESIDENCE_START}
    TO_DATE: CURRENT
    NOTES: Primary residence and professional base.

ROLE_AND_STATUS:
  - TITLE: ${TITLE}
    INSTITUTION: ${COMPANY}
    FORM_DATE: ${ROLE_START}
    TO_DATE: CURRENT
    NOTES: Current professional position.

SOURCES:
  - SOURCE_NAME: Government ID Records
    NOTE: Verified identity and birth information.
    PATH: ASSIST/NIC_RECORDS_${id}.PDF

  - SOURCE_NAME: Company Records
    NOTE: Employment and role verification.
    PATH: ASSIST/COMPANY_RECORDS_${id}.PDF

PARENTS:
  FATHER: UNKNOWN
  MOTHER: UNKNOWN

MARRIAGES: []
EOF

    echo "Generated: $FILENAME"
}

# Function to create JSON file
create_json_index() {
    echo "Creating files.json index..."
    
    # Start JSON array
    echo "[" > files.json
    
    # Add each filename
    local total=${#FILENAMES[@]}
    for ((i=0; i<total; i++)); do
        if [ $i -eq $((total-1)) ]; then
            # Last item, no comma
            echo "    \"${FILENAMES[$i]}\"" >> files.json
        else
            # Add comma for all but last item
            echo "    \"${FILENAMES[$i]}\"," >> files.json
        fi
    done
    
    # Close JSON array
    echo "]" >> files.json
    
    echo "✓ Created files.json with $total entries"
}

# Main script
echo "=========================================="
echo "   YAML Profile File Generator"
echo "=========================================="
echo ""
read -p "How many files do you need? " num_files

# Validate input
if ! [[ "$num_files" =~ ^[0-9]+$ ]] || [ "$num_files" -lt 1 ]; then
    echo "Error: Please enter a valid positive number."
    exit 1
fi

echo ""
echo "Generating $num_files profile files..."
echo ""

# Generate files
for ((i=1; i<=num_files; i++)); do
    generate_profile $i
    
    # Show progress every 100 files
    if [ $((i % 100)) -eq 0 ]; then
        echo "Progress: $i / $num_files files generated..."
    fi
done

echo ""
echo "=========================================="
echo "✓ Successfully generated $num_files YAML files!"
echo ""

# Create JSON index file
create_json_index

echo "=========================================="
echo "All files created successfully!"
echo "  - $num_files YAML profile files"
echo "  - 1 files.json index"
echo "=========================================="
