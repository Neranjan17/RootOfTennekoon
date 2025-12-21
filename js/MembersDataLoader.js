class MembersDataLoader {

  static MEMBERS_DATA_FILE_PATH = "./assets/members-data/";
  static MEMBERS_DATA_LIST = [];

  static async getInstance() {
    const loader = new MembersDataLoader();
    await loader.intLoadMemberData();

    console.log("Member name: ", MembersDataLoader.MEMBERS_DATA_LIST[0].FULL_NAME);
    console.log("Member Birth date string: ", MembersDataLoader.MEMBERS_DATA_LIST[0].BIRTH.DATE);
    return loader;
  }

  getAllMembersCount() {
    return MembersDataLoader.MEMBERS_DATA_LIST.length;
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

    // need to complete this method later
    const oldestYear = 1752;
    const currentYear = new Date().getFullYear();
    const yearCount = currentYear - oldestYear;

    return yearCount;
  }

  getMemberIDByIndex(index) {
    const memberID = MembersDataLoader.MEMBERS_DATA_LIST[index].ID

    if (memberID === undefined) {
      console.error(`Member ID is undefined : ${MembersDataLoader.MEMBERS_DATA_LIST[index].fileName}`);
      return null;
    }

    if (memberID === null) {
      console.error(`Member ID is null : ${MembersDataLoader.MEMBERS_DATA_LIST[index].fileName}`);
      return null;
    }

    return memberID;
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
        const data = jsyaml.load(text);

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