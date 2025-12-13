class DataLoader {
  constructor() {
    this.members = ['MID-0001-50', 'MID-0002-50', 'MID-0003-50', 'MID-0004-50'];

    this.familyTree = {
      profilePic: '../assets/members-img/person.png',
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
    return 'MID-0001-50';
  }

  getMemberDataById(memberId) {

    const memberImgLink = '../assets/members-img/person.png';
    const memberShortName = 'Susila Tennekoon';
    const memberFullName = 'Don Basil wijayawarhana tennekoon';
    const memberLineageName = 'Member of Wijayawarhana Tennekoon lineage';
    const memberBirthInfoMain = 'Born 2 November 1987 in Colombo';
    const memberBirthInfoSub = 'Registered in Kandy, born in Nugegoda.';
    const memberDeathInfoMain = 'Died 2 May 2025 in Colombo';
    const memberDeathInfoSub = 'In Colombo at age of 37.';
    const memberGenderIconLink = '../images/male-icon.svg';
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
        { wifeImg: "../assets/members-img/person.png", marriageFate: "Married wife", wifeName: "Dona Martha Kumari", marriageInfo: "Married In 1962 in Kotte, Colombo.", wifeId: "MID-0021-50" }
    ];

    const childrenDataList = [
        { childImg: "../assets/members-img/person.png", childName: "Don Frisians silva", childInfo: "1st son of Lalith kumara and Mala.", childId: "MID-0034-50" },
        { childImg: "../assets/members-img/person.png", childName: "Don Frisians silva", childInfo: "2st son of Lalith kumara and Mala.", childId: "MID-0035-50" },
        { childImg: "../assets/members-img/person.png", childName: "Don Frisians silva", childInfo: "Son of Lalith kumara and Mala.", childId: "MID-0036-50" }
    ];

    const parentDataList = [
        { parentImg: "../assets/members-img/person.png", parentRelation: "Mother", parentName: "Don Frisians silva", parentId: "MID-0011-50" },
        { parentImg: "../assets/members-img/person.png", parentRelation: "Father", parentName: "Don Frisians silva", parentId: "MID-0012-50" }
    ];

    const siblingsDataList = [
        { siblingImg: "../assets/members-img/person.png", siblingRelation: "Elder brother", siblingName: "Don Frisians silva", siblingId: "MID-0015-50" },
        { siblingImg: "../assets/members-img/person.png", siblingRelation: "Younger brother", siblingName: "Don Frisians silva", siblingId: "MID-0016-50" },
        { siblingImg: "../assets/members-img/person.png", siblingRelation: "Younger Sister", siblingName: "Don Frisians silva", siblingId: "MID-0017-50" }
    ];

    const sourcesDataList = [
        { sourceIcon: "../images/sourece-doc-icon.svg", sourceName: "Family Chronicle", sourceNote: "Received training in royal military arts", sourcePath: "../assets/members-sources/dommy-source.png" },
        { sourceIcon: "../images/sourece-img-icon.svg", sourceName: "Family Chronicle", sourceNote: "Received training in royal military arts", sourcePath: "../assets/members-sources/dommy-source.png" },
        { sourceIcon: "../images/sourece-img-icon.svg", sourceName: "Family Chronicle", sourceNote: "Received training in royal military arts", sourcePath: "../assets/members-sources/dommy-source.png" }
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
      return ['MID-0001-50', 'MID-0002-50', 'MID-0003-50'];
    } else if (inputName === "no") {
      return null;
    } else {
      return inputName;
    }
  }




}

export default DataLoader;
