class DataLoader {
  constructor() {
    this.members = ['MID-0001', 'MID-0002', 'MID-0003', 'MID-0004'];

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
      return ['MID-A', 'MID-B', 'MID-C'];
    } else if (inputName === "no") {
      return null;
    } else {
      return inputName;
    }
  }




}

export default DataLoader;
