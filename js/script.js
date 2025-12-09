// script.js

import DataLoader from './DataLoader.js';
import SnowfallAnimation from './SnowfallAnimation.js';
import FamilyTreeSvgController from './FamilyTreeSvgController.js';

let familyTreeController = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log("Website loaded successfully!");

    initSnowfall();
    initFamilyTree();
    showFamilyTreeSearchPanel();
    initNavigationHighlight();
    initTreeSearch();
    initTreeToolBarListeners();

    //showFindMemberSearchPanel();
    showMemberInfoContainer();
    initMemberSearch();


    // temptery dommy data load
    addMemberAlternateName('Podi rala', 'Society nickname');
    addMemberAlternateName('Kuda bandara', 'Society nickname');


    

    addMemberRoleInfo('Military Officer', 'In Royal Palace from 1950 to 1988');

    addMemberWifeInfo('../assets/members-img/person.png', 'Married wife', 'Dona Martha Kumari', 'Married In 1962 in Kotte, Colombo.', 'MID-0025');

    addMemberChildInfo('../assets/members-img/person.png', 'Don Frisians silva', '1st son of Lalith kumara and Mala.', 'MID-0025');
    addMemberChildInfo('../assets/members-img/person.png', 'Don Frisians silva', '2st son of Lalith kumara and Mala.', 'MID-0045');
    addMemberChildInfo('../assets/members-img/person.png', 'Don Frisians silva', 'Son of Lalith kumara and Mala.', 'MID-0075');

    addMemberParentInfo('../assets/members-img/person.png', 'Mother', 'Don Frisians silva', 'MID-0065');
    addMemberParentInfo('../assets/members-img/person.png', 'Father', 'Don Frisians silva', 'MID-0068');
    
    addMemberSiblingInfo('../assets/members-img/person.png', 'Elder brother', 'Don Frisians silva', 'MID-0078');
    addMemberSiblingInfo('../assets/members-img/person.png', 'Younger brother', 'Don Frisians silva', 'MID-0079');
    addMemberSiblingInfo('../assets/members-img/person.png', 'Younger Sister', 'Don Frisians silva', 'MID-0080');

    addMemberSourceInfo('../images/sourece-doc-icon.svg', 'Family Chronicle', 'Received training in royal military arts', 'null' );
    addMemberSourceInfo('../images/sourece-img-icon.svg', 'Family Chronicle', 'Received training in royal military arts', 'null' );
    addMemberSourceInfo('../images/sourece-img-icon.svg', 'Family Chronicle', 'Received training in royal military arts', 'null' );
});

/* -- Comon -- */
function initSnowfall() {
    const ACCENT_COLOR = '#4EBCC3';

    const snowfall = new SnowfallAnimation('bgAnimationCanvas', {
        numFlakes: 300,
        color: ACCENT_COLOR,
        minSize: 0.5,
        maxSize: 1.5,
        minSpeed: 0.25,
        maxSpeed: 1,
        glowEffect: false
    });

    snowfall.start();
}

function initTreeSearch() {
    const searchButton = document.getElementById('tree-searchButton');
    const searchInput = document.getElementById('treeSearchInput');
    const searchErrorSpan = document.getElementById('treeSearchErrorSpan');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            findMemberByInputName(searchInput, searchErrorSpan);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                findMemberByInputName(searchInput, searchErrorSpan);
            }
        });
    }
}

function findMemberByInputName(inputElement, errorViewSpan) {

    const cleanSearchValue = inputElement.value.trim();
    inputElement.value = '';

    if (cleanSearchValue.length === 0) {
        errorViewSpan.textContent = 'Please enter a name to search.';
        errorViewSpan.classList.add('show');
        return;
    }

    const dataLoader = new DataLoader();
    const result = dataLoader.findMemberIdByInputName(cleanSearchValue);

    if (result === null) {
        errorViewSpan.textContent = 'The member is not found!';
        errorViewSpan.classList.add('show');
    }
    else if (Array.isArray(result)) {
        errorViewSpan.textContent = 'Multiple members found!';
        errorViewSpan.classList.add('show');
    }
    else if (typeof result === 'string') {
        displayTreePersonInfoDiv(result);
        if (familyTreeController) {
            const centerCoords = getViewPortCenterCoordinate();
            familyTreeController.autoPanToSvgElement(result, centerCoords.centerX, centerCoords.centerY);
        }
    }
}

function initNavigationHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    const header = document.querySelector('header');

    const offset = header ? header.offsetHeight + 10 : 100;

    function activateLink() {
        let current = '';

        sections.forEach(sec => {
            const top = sec.offsetTop - offset;
            if (window.scrollY >= top) {
                current = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current !== '' && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateLink);
    activateLink();
}



/* -- Family tree Section -- */
async function initFamilyTree() {
    familyTreeController = new FamilyTreeSvgController('familyTreeContainer');

    // Pass the click handler callback
    await familyTreeController.init((clickedId) => {
        displayTreePersonInfoDiv(clickedId);
    });

    setTreePositionToRootMember();
}

function initTreeToolBarListeners() {
    // Search Icon Listener
    const searchIcon = document.getElementById('toolbarSearchIcon');
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            showFamilyTreeSearchPanel();
        });
    }

    // Reset Icon Listener
    const resetIcon = document.getElementById('toolbarResetIcon');
    if (resetIcon && familyTreeController) {
        resetIcon.addEventListener('click', () => {
            setTreePositionToRootMember();
        });
    }

    // Fullscreen Icon Listener
    const fullscreenIcon = document.getElementById('toolbarFullscreenIcon');

    const TreeSearchContainer = document.getElementById('tree-personSearch-container');
    const personInfoContainer = document.getElementById('tree-personInfo-container');
    const familyTreeContainer = document.getElementById('familyTreeContainer');

    if (fullscreenIcon) {
        fullscreenIcon.addEventListener('click', () => {

            if (fullscreenIcon.classList.contains('icon-fullscreen')) {

                personInfoContainer.classList.remove('show');
                TreeSearchContainer.classList.remove('show');
                familyTreeContainer.classList.add('show');
            }
            else if (fullscreenIcon.classList.contains('icon-exit-fullscreen')) {

                personInfoContainer.classList.remove('show');
                TreeSearchContainer.classList.add('show');
                familyTreeContainer.classList.remove('show')
            }

            fullscreenIcon.classList.toggle('icon-fullscreen');
            fullscreenIcon.classList.toggle('icon-exit-fullscreen');

        });
    }

    // Download Icon Listener
    const downloadIcon = document.getElementById('toolbarDownloadIcon');
    if (downloadIcon) {
        downloadIcon.addEventListener('click', async () => {
            if (familyTreeController) {
                await familyTreeController.downloadFamilyTreeSvg();
            }
        });
    }
}

function showFamilyTreeSearchPanel() {
    const TreeSearchContainer = document.getElementById('tree-personSearch-container');
    const personInfoContainer = document.getElementById('tree-personInfo-container');
    const searchInput = document.getElementById('treeSearchInput');

    searchInput.value = '';

    const searchErrorSpan = document.getElementById('treeSearchErrorSpan');
    searchErrorSpan.classList.remove('show');

    personInfoContainer.style.display = 'none';
    personInfoContainer.classList.remove('show');

    TreeSearchContainer.style.display = 'block';
    TreeSearchContainer.offsetHeight;
    TreeSearchContainer.classList.add('show');
}

function displayTreePersonInfoDiv(clickedId) {
    const container = document.getElementById('tree-personInfo-container');
    const imgElement = document.getElementById('tree-personInfo-img');
    const headerElement = document.getElementById('tree-personInfo-header');
    const subHeaderElement = document.getElementById('tree-personInfo-subHeader');
    const descElement = document.getElementById('tree-personInfo-desc');
    const searchContainer = document.getElementById('tree-personSearch-container');

    const dataLoader = new DataLoader();
    const personData = dataLoader.getTreePersonInfoById(clickedId);

    imgElement.src = personData.profilePic;
    headerElement.textContent = personData.mainTitle;
    subHeaderElement.textContent = personData.subTitle;
    descElement.textContent = personData.description;

    searchContainer.classList.remove('show');

    container.style.display = 'block';
    container.offsetHeight;
    container.classList.add('show');
}

function setTreePositionToRootMember() {
    const rootMemberId = 'MID-0001'
    const centerCoords = getViewPortCenterCoordinate(true);
    familyTreeController.autoPanToSvgElement(rootMemberId, centerCoords.centerX, centerCoords.centerY);
}

function getViewPortCenterCoordinate(isRootMember = false) {
    let container;

    if (isRootMember) {
        container = document.getElementById('root-treeMember-viewport-div');
    } else {
        container = document.getElementById('treeMember-viewport-div');
    }

    if (!container) {
        console.error("'treeMember-viewport-div' Id Not found.");
        return null;
    }

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return { centerX, centerY };
}



/* -- Find Member Section -- */
function showFindMemberSearchPanel() {
    const findMemberSearchContainer = document.getElementById('findMemberSearchContainer');
    const memberInfoContainer = document.getElementById('memberInfoContainer');
    const searchErrorSpan = document.getElementById('memberSearchErrorSpan');
    
    findMemberSearchContainer.classList.add('show');
    memberInfoContainer.classList.remove('show');
    searchErrorSpan.classList.remove('show');
}

function showMemberInfoContainer() {
    const findMemberSearchContainer = document.getElementById('findMemberSearchContainer');
    const memberInfoContainer = document.getElementById('memberInfoContainer');
    findMemberSearchContainer.classList.remove('show');
    memberInfoContainer.classList.add('show');
}

function initMemberSearch() {
    const searchButton = document.getElementById('member-searchButton');
    const searchInput = document.getElementById('memberSearchInput');
    const searchErrorSpan = document.getElementById('memberSearchErrorSpan');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            findMemberByInputName(searchInput, searchErrorSpan);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                findMemberByInputName(searchInput, searchErrorSpan);
            }
        });
    }
}

function addMemberAlternateName(name, context) {
    const container = document.getElementById('memberInfoAltNameContainer');
    const template = document.getElementById('memberInfoAltNameItemTemplate');
  
    const clone = template.content.cloneNode(true);
    const nameText = clone.querySelector('.memberInfoItem-AltName');
    const nameContext = clone.querySelector('.memberInfoItem-AltName-context');
    nameText.textContent = name;
    nameContext.textContent = context;
    
    container.appendChild(clone);
}





function addMemberRoleInfo(roleName, roleInfo) {
    const container = document.getElementById('memberInfoRolesContainer');
    const template = document.getElementById('memberInfoRoleItemTemplate');
  
    const clone = template.content.cloneNode(true);
    const role = clone.querySelector('.memberInfoItem-roleName');
    const info = clone.querySelector('.memberInfoItem-role-info');
    role.textContent = roleName;
    info.textContent = roleInfo;
    
    container.appendChild(clone);
}

function addMemberWifeInfo(wifeImg, marriageFate, wifeName, marriageInfo, wifeId) {
    const container = document.getElementById('memberInfoWifeInfoContainer');
    const template = document.getElementById('memberInfoWifeItemTemplate');
  
    const clone = template.content.cloneNode(true);
    const btn = clone.querySelector('.memberInfo-showMoreBtn');
    const img = clone.querySelector('.memberInfo-wife-img');
    const fate = clone.querySelector('.memberInfoItem-marriageFate');
    const name = clone.querySelector('.memberInfoItem-wifeName');
    const info = clone.querySelector('.memberInfoItem-marriageInfo');

    img.src = wifeImg;
    img.alt = wifeName;
    fate.textContent = marriageFate;
    name.textContent = wifeName;
    info.textContent = marriageInfo;
    
    btn.addEventListener("click", () => {
        console.log('Wife id : ' + wifeId);
    });

    container.appendChild(clone);
}

function addMemberChildInfo(childImg, childName, childInfo, childId) {
    const container = document.getElementById('memberInfoChildInfoContainer');
    const template = document.getElementById('memberInfoChildItemTemplate');
  
    const clone = template.content.cloneNode(true);
    const btn = clone.querySelector('.memberInfo-showMoreBtn');
    const img = clone.querySelector('.memberInfo-child-img');
    const name = clone.querySelector('.memberInfoItem-childName');
    const info = clone.querySelector('.memberInfoItem-childInfo');

    img.src = childImg;
    img.alt = childName;
    name.textContent = childName;
    info.textContent = childInfo;
    
    btn.addEventListener("click", () => {
        console.log('Child id : ' + childId);
    });

    container.appendChild(clone);
}

function addMemberParentInfo(parentImg, parentRelation, parentName, parentId) {
    const container = document.getElementById('memberInfoParentsInfoContainer');
    const template = document.getElementById('memberInfoParentItemTemplate');
  
    const clone = template.content.cloneNode(true);
    const btn = clone.querySelector('.memberInfo-showMoreBtn');
    const img = clone.querySelector('.memberInfo-parent-img');
    const relation = clone.querySelector('.memberInfoItem-parentRelation');
    const name = clone.querySelector('.memberInfoItem-parentName');

    img.src = parentImg;
    img.alt = parentImg;
    relation.textContent = parentRelation;
    name.textContent = parentName;
    
    btn.addEventListener("click", () => {
        console.log('Parent id : ' + parentId);
    });

    container.appendChild(clone);
}

function addMemberSiblingInfo(siblingImg, siblingRelation, siblingName, siblingId) {
    const container = document.getElementById('memberInfoSiblingsInfoContainer');
    const template = document.getElementById('memberInfoSiblingItemTemplate');
  
    const clone = template.content.cloneNode(true);
    const btn = clone.querySelector('.memberInfo-showMoreBtn');
    const img = clone.querySelector('.memberInfo-sibling-img');
    const relation = clone.querySelector('.memberInfoItem-siblingRelation');
    const name = clone.querySelector('.memberInfoItem-siblingName');

    img.src = siblingImg;
    img.alt = siblingImg;
    relation.textContent = siblingRelation;
    name.textContent = siblingName;
    
    btn.addEventListener("click", () => {
        console.log('sibling id : ' + siblingId);
    });

    container.appendChild(clone);
}

function addMemberSourceInfo(sourceIcon, sourceName, sourceNote, sourceLink) {
    const container = document.getElementById('memberInfoSourceContainer');
    const template = document.getElementById('memberInfoSourceItemTemplate');
  
    const clone = template.content.cloneNode(true);
    const icon = clone.querySelector('.memberInfo-source-icon');
    const name = clone.querySelector('.memberInfoItem-souceName');
    const note = clone.querySelector('.memberInfoItem-souceNote');
    
    icon.src = sourceIcon;
    name.textContent = sourceName;
    note.textContent = sourceNote;

    icon.addEventListener("click", () => {
        console.log('Source Link : ' + sourceLink);
    });
    
    container.appendChild(clone);
}