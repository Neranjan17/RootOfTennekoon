class MembersDataLoader {

  static MEMBERS_DATA_FILE_PATH = "./assets/members-data/";
  static MEMBERS_DATA_LIST = [];

  static async getInstance() {
    const loader = new MembersDataLoader();
    await loader.intLoadMemberData();

    const membersCount = MembersDataLoader.MEMBERS_DATA_LIST.length;

    for (let index = 0; index < membersCount; index++) {

      console.log("-------------------------------");
      console.log(`[${index + 1}/${membersCount}]`);
      console.log(`Member ID : ${loader.getMemberIDByIndex(index)}`);
      console.log("birth Info");
      const birthInfo = loader.getMemberBirthInfoByIndex(index);
      
      if (birthInfo === null) {
        console.log("\tNo birth information available.");
        continue;
      } else {
        console.log(`\tbirth year : ${loader.getMemberBirthInfoByIndex(index).DATE}`);
        console.log(`\tbirth place : ${loader.getMemberBirthInfoByIndex(index).PLACE}`);
        console.log(`\tbirth note : ${loader.getMemberBirthInfoByIndex(index).NOTES}`);
      }
      console.log("---------------------------------------");


    }

    return loader;
  }

  getAllMembersCount() {
    const memberCount = MembersDataLoader.MEMBERS_DATA_LIST.length;
    console.log("Calculated members count: ", memberCount);
    return memberCount;
  }

  getTotalGenerationsCount() {

    let genIdList = [];

    for (let index = 0; index < MembersDataLoader.MEMBERS_DATA_LIST.length; index++) {

      const memberID = this.getMemberIDByIndex(index);

      if (memberID === null) {
        continue;
      }

      const genId = memberID.substring(7, 9);

      if (!genIdList.includes(genId)) {
        genIdList.push(genId);
      }

    }

    console.log("Calculated Generations count: ", genIdList.length);
    return genIdList.length;
  }

  getYearsCount() {

    let oldestYear = new Date().getFullYear();

    for (let index = 0; index < MembersDataLoader.MEMBERS_DATA_LIST.length; index++) {

      const birthYear = parseInt(this.getMemberBirthInfoByIndex(index).DATE.split("-")[0]);

      if (birthYear < oldestYear) {
        oldestYear = birthYear;
      }
    }

    const currentYear = new Date().getFullYear();
    const yearCount = currentYear - oldestYear;

    console.log("Calculated years count: ", yearCount);
    return yearCount;
  }

  getMemberDeathInfoByIndex(index) {

    // need to complete 

    const memberDeathInfo = MembersDataLoader.MEMBERS_DATA_LIST[index].DEATH;

    if (memberDeathInfo === undefined) {
      return "ALIVE";
    }

    if (memberDeathInfo === null) {
      return "UNKNOWN";
    }

    if (typeof memberDeathInfo === 'string' && memberDeathInfo !== "UNKNOWN" && memberDeathInfo !== "ALIVE") {
      console.error(`Invalid Format: DEATH must be an object or "UNKNOWN" or "ALIVE" string : ${MembersDataLoader.MEMBERS_DATA_LIST[index].fileName}`);
      return null;
    }

    if (typeof memberDeathInfo !== 'object' && typeof memberDeathInfo !== 'string') {
      console.error(`Invalid Format: DEATH must be an object or a string : ${MembersDataLoader.MEMBERS_DATA_LIST[index].fileName}`);
      return null;
    }

    let date = memberDeathInfo.DATE;
    let place = memberDeathInfo.PLACE;
    let notes = memberDeathInfo.NOTES;

    if (date === undefined || date === null) {
      date = "UNKNOWN";
    }
    else if (!this.isValidDateTimeFormat(date) && date !== "UNKNOWN") {
      console.error(`Invalid Format: ${date} is not right Death date format: ${MembersDataLoader.MEMBERS_DATA_LIST[index].fileName}`);
      date = "UNKNOWN";
    }

    if (place === undefined || place === null || place === "UNKNOWN") {
      place = "UNKNOWN";
    }

    if (notes === undefined || notes === null || notes === "UNKNOWN") {
      notes = "UNKNOWN";
    }

    memberDeathInfo.DATE = date;
    memberDeathInfo.PLACE = place;
    memberDeathInfo.NOTES = notes;

    return memberDeathInfo;
  }

  getMemberBirthInfoByIndex(index) {
    const memberBirthInfo = MembersDataLoader.MEMBERS_DATA_LIST[index].BIRTH;

    if (memberBirthInfo === null || memberBirthInfo === undefined) {
      return null;
    }

    if (typeof memberBirthInfo !== 'object') {
      console.error(`Invalid Format: BIRTH must be an object : ${MembersDataLoader.MEMBERS_DATA_LIST[index].fileName}`);
      return null;
    }

    const date = memberBirthInfo.DATE;
    const place = memberBirthInfo.PLACE;
    const notes = memberBirthInfo.NOTES;

    if (date === undefined || date === null) {
      date = "UNKNOWN";
    } else if (!this.isValidDateTimeFormat(date) && date !== "UNKNOWN") {
      console.error(`Invalid Format: ${date} is not right Birth date format: ${MembersDataLoader.MEMBERS_DATA_LIST[index].fileName}`);
      date = "UNKNOWN";
    }

    if (place === undefined || place === null || place === "UNKNOWN") {
      place = "UNKNOWN";
    }

    if (notes === undefined || notes === null || notes === "UNKNOWN") {
      notes = "UNKNOWN";
    }

    memberBirthInfo.DATE = date;
    memberBirthInfo.PLACE = place;
    memberBirthInfo.NOTES = notes;
    return memberBirthInfo;
  }

  getMemberIDByIndex(index) {
    const memberID = MembersDataLoader.MEMBERS_DATA_LIST[index].ID;

    if (memberID === undefined) {
      console.error(`Member ID received: Member ID is undefined : ${MembersDataLoader.MEMBERS_DATA_LIST[index].fileName}`);
      return null;
    }

    if (memberID === null) {
      console.error(`Member ID received: Member ID is null : ${MembersDataLoader.MEMBERS_DATA_LIST[index].fileName}`);
      return null;
    }

    if (typeof memberID !== 'string') {
      console.error(`Invalid Data type: Member ID must be a string : ${MembersDataLoader.MEMBERS_DATA_LIST[index].fileName}`);
      return null;
    }

    if (!this.isValidMemberIdFormat(memberID)) {
      console.error(`Invalid Format: Please use this format MID00-G00-000-00. File: ${MembersDataLoader.MEMBERS_DATA_LIST[index].fileName}`);
      return null;
    }

    return memberID;
  }

  isValidDateTimeFormat(dateTimeStr) {

    // yyyy
    if (/^\d{4}$/.test(dateTimeStr)) return true;
    // yyyy-mm
    if (/^\d{4}-\d{2}$/.test(dateTimeStr)) return true;
    // yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateTimeStr)) return true;
    // yyyy-mm-dd hh
    if (/^\d{4}-\d{2}-\d{2} \d{2}$/.test(dateTimeStr)) return true;
    // yyyy-mm-dd hh:mm
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateTimeStr)) return true;
    // yyyy-mm-dd hh:mm:ss
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateTimeStr)) return true;

    return false;
  }

  isValidMemberIdFormat(memberID) {
    const regex = /^MID\d{2}-G\d{2}-\d{3}-\d{2}$/;
    return regex.test(memberID);
  }

  async intLoadMemberData() {
    try {
      const response = await fetch(MembersDataLoader.MEMBERS_DATA_FILE_PATH + "files.json");

      if (!response.ok) {
        console.error("files.json file is missing!");
        return;
      }

      const fileList = await response.json();
      console.log(`➤ YAML FILES LOADING: ${fileList.length} YAML data files found, which are mentioned in files.json!`);
      let index = 1;
      for (const fileName of fileList) {
        const fileResponse = await fetch(MembersDataLoader.MEMBERS_DATA_FILE_PATH + fileName);

        if (!fileResponse.ok) {
          console.error(`\t[${index++}/${fileList.length}] ✗ ${fileName} file mentioned in files.json was not found, cannot load it!`);
          continue;
        }

        const text = await fileResponse.text();
        const data = jsyaml.load(text, { schema: jsyaml.JSON_SCHEMA });

        MembersDataLoader.MEMBERS_DATA_LIST.push({
          fileName: fileName,
          ...data
        });
        console.log(`\t[${index++}/${fileList.length}] ✓ ${fileName} is successfully loaded!`);
      }

    } catch (err) {
      console.error("Error loading member data:", err);
    }
  }
}

export default MembersDataLoader;


/*

YAML File Scructure Exsample
---------------------

ID: MID00-G50-000-01
PROFILE_PICTURE: /Image/Contemporary/Unknown_Female_Profile.jpg
SHORT_NAME: Nadeesha Kumari
FULL_NAME: Nadeesha Kumari Perera

ALTERNATE_NAMES:
  - NAME: N. K. Perera
    CONTEXT: OFFICIAL_DOCUMENTS
  - NAME: Mrs. Lalith Kumara
    CONTEXT: SOCIAL_REFERENCE

FAMILY_NAME: Perera
GENDER: FEMALE
GENERAL_DESCRIPTION: >
  Nadeesha Kumari Perera is a contemporary social contributor and education advocate.
  She is known for her involvement in community welfare projects, particularly
  focusing on children's education and women's development programmes. After marriage,
  she has played a supportive role in philanthropic initiatives associated with
  K-Sig Apparel Solutions, often working behind the scenes.

BIRTH:
  DATE: 1982-09-22
  PLACE: Kandy
  NOTES: Born at a government maternity hospital in Kandy.

DEATH:
  DATE: UNKNOWN
  PLACE: UNKNOWN
  NOTES: UNKNOWN

LIVED:
  - PLACE: Kandy, Sri Lanka
    FORM_DATE: 1982
    TO_DATE: 2003
    NOTES: Childhood and early education.

  - PLACE: Colombo 07, Sri Lanka
    FORM_DATE: 2003
    TO_DATE: CURRENT
    NOTES: Residence after marriage.

ROLE_AND_STATUS:
  - TITLE: Director – Community Outreach
    INSTITUTION: K-Sig Apparel Solutions
    FORM_DATE: 2010
    TO_DATE: CURRENT
    NOTES: Oversees educational and welfare initiatives.

SOURCES:
  - SOURCE_NAME: Family Records
    NOTE: Marriage and residence details.
    PATH: ASSIST/FAMILY_RECORDS_2003.PDF

PARENTS:
  FATHER: UNKNOWN
  MOTHER: UNKNOWN

MARRIAGES:
  - PARTNER: MID01-G50-000-01
    DATE: 2003-12-01
    PLACE: Galle Face Hotel, Colombo
    FATE: ONGOING
    BIOLOGICAL_CHILDREN:
      - ID: MID01-G51-001-01
        ORDER: 1
    ADOPTED_CHILDREN: []

*/