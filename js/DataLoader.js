class DataLoader {
  constructor() {
    this.members = ['MID01-G50-001-01', 'MID00-G50-000-01', 'MID01-G50-002-01', 'MID00-G50-000-02'];

    this.familyTree = {
      profilePic: './assets/members-img/person.png',
      mainTitle: 'John Doe',
      subTitle: '1950 - 2015',
      description:
        'He was a respected landowner and community leader in the early 20th century. Known for his generosity and wisdom, he supported education and local agriculture in his village.'
    };
  }

  getAllMembersId() {
    return this.members;
  }

  getRootMemberId() {
    return 'MID01-G50-001-01';
  }

  getMemberDataById(memberId) {

    const memberImgLink = './assets/members-img/person.png';
    const memberShortName = 'Susila Tennekoon';
    const memberFullName = 'Don Basil wijayawarhana tennekoon';
    const memberLineageName = 'Member of Wijayawarhana Tennekoon lineage';
    const memberBirthInfoMain = 'Born 2 November 1987 in Colombo';
    const memberBirthInfoSub = 'Registered in Kandy, born in Nugegoda.';
    const memberDeathInfoMain = 'Died 2 May 2025 in Colombo';
    const memberDeathInfoSub = 'In Colombo at age of 37.';
    const memberGenderIconLink = './images/male-icon.svg';
    const memberGender = 'Male';
    const memberDescription = 'Don Wijesinghe Basil was the eldest biological son of the influential court official, Keerthi Lekam, born into apromine';

    const alternateNamesList = [
        { name: "Podi rala", nameContext: "Society nickname" },
        { name: "Kuda bandara", nameContext: "Society nickname" }
    ];

    const livedPlaceList = [
        { mainText: "Colombo 03, from to 1988 to 2001", subText: "Wife’s home" },
        { mainText: "Colombo 07, from to 1950 to 1988", subText: "Primary residence after university" }
    ];

    const roleAndStatusList = [
        { roleName: "Military Officer", roleInfo: "In Royal Palace from 1940 to 1985" },
    ];

    const wivesDataList = [
        { wifeImg: "./assets/members-img/person.png", marriageFate: "Married wife", wifeName: "Dona Martha Kumari", marriageInfo: "Married In 1962 in Kotte, Colombo.", wifeId: "MID01-G51-001-01" }
    ];

    const childrenDataList = [
        { childImg: "./assets/members-img/person.png", childName: "Don Frisians silva", childInfo: "1st son of Lalith kumara and Mala.", childId: "MID01-G51-002-01" },
        { childImg: "./assets/members-img/person.png", childName: "Don Frisians silva", childInfo: "2st son of Lalith kumara and Mala.", childId: "MID00-G51-000-03" },
        { childImg: "./assets/members-img/person.png", childName: "Don Frisians silva", childInfo: "Son of Lalith kumara and Mala.", childId: "MID00-G51-000-04" }
    ];

    const parentDataList = [
        { parentImg: "./assets/members-img/person.png", parentRelation: "Mother", parentName: "Don Frisians silva", parentId: "MID01-G52-001-01" },
        { parentImg: "./assets/members-img/person.png", parentRelation: "Father", parentName: "Don Frisians silva", parentId: "MID00-G52-000-05" }
    ];

    const siblingsDataList = [
        { siblingImg: "./assets/members-img/person.png", siblingRelation: "Elder brother", siblingName: "Don Frisians silva", siblingId: "MID01-G52-001-02" },
        { siblingImg: "./assets/members-img/person.png", siblingRelation: "Younger brother", siblingName: "Don Frisians silva", siblingId: "MID00-G52-000-06" },
        { siblingImg: "./assets/members-img/person.png", siblingRelation: "Younger Sister", siblingName: "Don Frisians silva", siblingId: "MID01-G52-001-03" }
    ];

    const sourcesDataList = [
        { sourceIcon: "./images/sourece-doc-icon.svg", sourceName: "Family Chronicle", sourceNote: "Received training in royal military arts", sourcePath: "./assets/members-sources/dommy-source.png" },
        { sourceIcon: "./images/sourece-img-icon.svg", sourceName: "Family Chronicle", sourceNote: "Received training in royal military arts", sourcePath: "./assets/members-sources/dommy-source.png" },
        { sourceIcon: "./images/sourece-img-icon.svg", sourceName: "Family Chronicle", sourceNote: "Received training in royal military arts", sourcePath: "./assets/members-sources/dommy-source.png" }
    ];

    return {
      memberImgLink,
      memberShortName,
      memberFullName,
      memberLineageName,
      memberBirthInfoMain,
      memberBirthInfoSub,
      memberDeathInfoMain,
      memberDeathInfoSub,
      memberGenderIconLink,
      memberGender,
      memberDescription,
      alternateNamesList,
      livedPlaceList,
      roleAndStatusList,
      wivesDataList,
      childrenDataList,
      parentDataList,
      siblingsDataList,
      sourcesDataList
    };
  }

  getFamilyTreeDataById(memberId) {
    return {
      profilePic: this.familyTree.profilePic,
      mainTitle: this.familyTree.mainTitle,
      subTitle: this.familyTree.subTitle
    };
  }

  getTreePersonInfoById(memberId) {
    return {
      profilePic: this.familyTree.profilePic,
      mainTitle: this.familyTree.mainTitle,
      subTitle: this.familyTree.subTitle,
      description: this.familyTree.description
    };
  }

  findMemberIdByInputName(inputName) {

    if (inputName === "multi") {
      return ['MID01-G50-001-01', 'MID00-G50-000-01', 'MID01-G50-002-01'];
    } else if (inputName === "no") {
      return null;
    } else {
      return inputName;
    }
  }




}

export default DataLoader;
