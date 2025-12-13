// FamilyTreeSvgController.js

import DataLoader from './DataLoader.js';

class FamilyTreeSvgController {
    constructor(containerSelector) {
        this.container = document.getElementById(containerSelector);
        this.wrapper = null;
        this.svg = null;
        this.dataLoader = new DataLoader();

        // Zoom and pan state
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.touchStartDist = 0;
        this.touchStartScale = 1;
        this.onMemberClick = null;
    }

    autoPanToSvgElement(elementId, parentX, parentY) {

        /* -- Reset to default zoom & position -- */
        this.scale = 1;

        /* -- Find elementId's svg eliment center point -- */
        if (!this.svg) {
            console.error("SVG not loaded yet.");
            return null;
        }

        const element = this.svg.getElementById(elementId);
        if (!element) {
            console.error(`SVG element with ID "${elementId}" not found.`);
            return null;
        }

        const bbox = element.getBBox();
        const ctm = element.getCTM();
        if (!ctm) {
            console.error("Could not read CTM for element:", elementId);
            return null;
        }
        const localCenterX = bbox.x + bbox.width / 2;
        const localCenterY = bbox.y + bbox.height / 2;
        const svgX = ctm.a * localCenterX + ctm.c * localCenterY + ctm.e;
        const svgY = ctm.b * localCenterX + ctm.d * localCenterY + ctm.f;

        /* -- pan to member -- */
        this.translateX = parentX - (svgX * this.scale);
        this.translateY = parentY - (svgY * this.scale);

        if (this.svg) {

            this.svg.style.transition = 'transform 0.8s ease-out';
            this.svg.style.transform =
                `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;

            setTimeout(() => {
                this.updateTransform();
            }, 800);
        }
        this.deselectAllMembers();
        this.selectMemberById(elementId);
        this.highlightMemberById(elementId);
    }

    async init(onMemberClickCallback = null) {
        if (!this.container) {
            console.error("Family tree container not found");
            return false;
        }

        console.log("Family tree container found");

        this.onMemberClick = onMemberClickCallback;
        this.wrapper = this.createSvgWrapper();
        await this.loadFamilyTreeSvg();

        return true;
    }

    createSvgWrapper() {
        const wrapper = document.createElement('div');
        wrapper.id = 'svgWrapper';
        wrapper.style.cssText = `
            width: 100%;
            height: 100%;
            cursor: grab;
            overflow: hidden;
        `;
        return wrapper;
    }

    async loadFamilyTreeSvg() {
        try {
            const res = await fetch('assets/family-tree/tennekoon-family-tree.svg');
            console.log("SVG fetch response:", res.status);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const svgContent = await res.text();
            console.log("SVG content loaded, length:", svgContent.length);

            this.wrapper.innerHTML = svgContent;
            this.container.innerHTML = '';
            this.container.appendChild(this.wrapper);

            this.svg = this.wrapper.querySelector('svg');
            if (!this.svg) {
                console.error("SVG element not found in loaded content");
                return;
            }

            this.svg.style.transition = 'transform 0.1s ease-out';
            this.svg.style.transformOrigin = '0 0';

            this.initZoomPan();
            this.updateFamilyTreeAll();
            this.attachMemberClickHandlers();

        } catch (err) {
            console.error("Error loading SVG:", err);
            this.container.innerHTML =
                '<p style="color:red; padding:20px;">Error loading family tree. Check console.</p>';
        }
    }

    initZoomPan() {
        this.updateTransform();

        // Mouse Wheel Zoom
        this.wrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = this.scale * delta;

            if (newScale < 0.3 || newScale > 5) return;

            const rect = this.wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.translateX = x - (x - this.translateX) * (newScale / this.scale);
            this.translateY = y - (y - this.translateY) * (newScale / this.scale);

            this.scale = newScale;
            this.updateTransform();
        });

        // Mouse Drag Pan
        this.wrapper.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.clientX - this.translateX;
            this.startY = e.clientY - this.translateY;
            this.wrapper.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.translateX = e.clientX - this.startX;
            this.translateY = e.clientY - this.startY;
            this.updateTransform();
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.wrapper.style.cursor = 'grab';
        });

        // Touch Support
        this.wrapper.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.startX = e.touches[0].clientX - this.translateX;
                this.startY = e.touches[0].clientY - this.translateY;
            } else if (e.touches.length === 2) {
                this.isDragging = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                this.touchStartDist = Math.sqrt(dx * dx + dy * dy);
                this.touchStartScale = this.scale;
            }
        });

        this.wrapper.addEventListener('touchmove', (e) => {
            e.preventDefault();

            if (e.touches.length === 1 && this.isDragging) {
                this.translateX = e.touches[0].clientX - this.startX;
                this.translateY = e.touches[0].clientY - this.startY;
                this.updateTransform();
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const newScale = this.touchStartScale * (dist / this.touchStartDist);
                if (newScale < 0.3 || newScale > 5) return;

                this.scale = newScale;
                this.updateTransform();
            }
        }, { passive: false });

        this.wrapper.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }

    updateTransform() {
        if (this.svg) {
            this.svg.style.transform =
                `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        }
    }

    attachMemberClickHandlers() {
        const memberElements = document.querySelectorAll('.member');
        memberElements.forEach(element => {
            element.addEventListener('click', (event) => {
                const clickedId = event.currentTarget.id;
                if (clickedId) {

                    this.deselectAllMembers();
                    this.selectMemberById(clickedId);

                    if (this.onMemberClick) {
                        this.onMemberClick(clickedId);
                    }
                }
            });
        });
    }

    updateFamilyTreeAll() {
        const memberIds = this.dataLoader.getAllMembersId();
        const svgMemberIds = this.getMemberIdsFromSVG();

        console.log(`➤ ${memberIds.length} files will be updated.`);

        memberIds.forEach((id, index) => {
            const treeData = this.dataLoader.getFamilyTreeDataById(id);
            const result = this.updateTreeMemberById(
                id,
                treeData.profilePic,
                treeData.mainTitle,
                treeData.subTitle
            );

            if (result.success) {
                const indexToRemove = svgMemberIds.indexOf(id);
                if (indexToRemove !== -1) {
                    svgMemberIds.splice(indexToRemove, 1);
                }
                console.log(`\t[${index + 1}/${memberIds.length}] ✓ Updated ${id}`);
            } else {
                console.error(`\t[${index + 1}/${memberIds.length}] ✗ Failed to update ${id}:`, result.message);
            }
        });

        if (svgMemberIds.length > 0) {
            console.log(`➤ ${svgMemberIds.length} data files related to these files are missing!`);
            svgMemberIds.forEach(id => {
                console.log(`\t⚠ Data file is missing: ${id}`);
            });
        }
    }

    getMemberIdsFromSVG() {
        if (!this.svg) {
            console.error("SVG element not yet loaded.");
            return [];
        }

        const memberElements = this.svg.querySelectorAll('.member');
        return Array.from(memberElements)
            .map(element => element.getAttribute('id'))
            .filter(id => id && id.length > 0);
    }

    updateTreeMemberById(memberId, imagePath, mainText, subText) {
        if (!memberId || typeof memberId !== 'string') {
            return {
                success: false,
                message: 'Invalid member ID provided'
            };
        }

        if (!this.svg) {
            return {
                success: false,
                message: 'SVG element not found. Make sure the SVG is loaded.'
            };
        }

        const memberGroup = this.svg.getElementById(memberId);
        if (!memberGroup) {
            return {
                success: false,
                message: `Member with ID "${memberId}" not found in SVG`
            };
        }

        const updatedFields = [];
        const errors = [];

        if (imagePath) {
            const imgElement = memberGroup.querySelector('.img-container');
            if (imgElement) {
                imgElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imagePath);
                updatedFields.push('image');
            } else {
                errors.push('Image container (.img-container) not found');
            }
        }

        if (mainText) {
            const mainTextElement = memberGroup.querySelector('.main-text tspan');
            if (mainTextElement) {
                mainTextElement.textContent = mainText;
                updatedFields.push('main text');
            } else {
                errors.push('Main text element (.main-text tspan) not found');
            }
        }

        if (subText) {
            const subTextElement = memberGroup.querySelector('.sub-text tspan');
            if (subTextElement) {
                subTextElement.textContent = subText;
                updatedFields.push('sub text');
            } else {
                errors.push('Sub text element (.sub-text tspan) not found');
            }
        }

        if (updatedFields.length > 0) {
            return {
                success: true,
                message: `Successfully updated: ${updatedFields.join(', ')}`,
                updatedFields,
                errors: errors.length > 0 ? errors : null
            };
        } else {
            return {
                success: false,
                message: 'Failed to update member',
                errors
            };
        }
    }

    selectMemberById(memberId) {
        if (!memberId || typeof memberId !== 'string') {
            console.error('Invalid member ID provided');
            return false;
        }

        if (!this.svg) {
            console.error('SVG element not found. Make sure the SVG is loaded.');
            return false;
        }

        // Find the member element
        const memberElement = this.svg.getElementById(memberId);

        if (!memberElement) {
            console.error(`Member with ID "${memberId}" not found in SVG`);
            return false;
        }

        // Check if it has the 'member' class
        if (!memberElement.classList.contains('member')) {
            console.error(`Element with ID "${memberId}" is not a member element`);
            return false;
        }

        // Add the 'selected' class
        memberElement.classList.add('selected');
        return true;
    }

    deselectAllMembers() {
        if (!this.svg) {
            console.error('SVG element not found. Make sure the SVG is loaded.');
            return 0;
        }

        // Find all elements with class 'member' that also have 'selected' class
        const selectedMembers = this.svg.querySelectorAll('.member.selected');

        let count = 0;
        selectedMembers.forEach(member => {
            member.classList.remove('selected');
            count++;
        });

        return count;
    }

    highlightMemberById(memberId, duration = 3000) {
        if (!memberId || typeof memberId !== 'string') {
            console.error('Invalid member ID provided');
            return false;
        }

        if (!this.svg) {
            console.error('SVG element not found. Make sure the SVG is loaded.');
            return false;
        }

        // Find the member element
        const memberElement = this.svg.getElementById(memberId);

        if (!memberElement) {
            console.error(`Member with ID "${memberId}" not found in SVG`);
            return false;
        }

        // Check if it has the 'member' class
        if (!memberElement.classList.contains('member')) {
            console.error(`Element with ID "${memberId}" is not a member element`);
            return false;
        }

        // Remove highlight class if it already exists (to restart animation)
        if (memberElement.classList.contains('highlight')) {
            memberElement.classList.remove('highlight');
            // Force reflow to restart animation
            void memberElement.offsetWidth;
        }

        // Add the 'highlight' class
        memberElement.classList.add('highlight');

        // Remove the class after animation completes
        setTimeout(() => {
            memberElement.classList.remove('highlight');
        }, duration);

        return true;
    }

    


    // Download family tree 
    async downloadFamilyTreeSvg(filename = 'tennekoon-family-tree.svg') {
        if (!this.svg) {
            console.error('SVG element not found. Make sure the SVG is loaded.');
            return false;
        }

        try {
            console.log('➤ Preparing SVG for download...');

            // Clone the SVG to avoid modifying the displayed version
            const svgClone = this.svg.cloneNode(true);

            // Remove any transform styles applied by zoom/pan
            svgClone.style.transform = '';
            svgClone.style.transition = '';
            svgClone.style.transformOrigin = '';

            // Add background color from CSS variable --bg-light
            this.addBackgroundToSvg(svgClone);

            // Convert all external images to base64 data URIs
            await this.embedImagesAsBase64(svgClone);

            // Serialize the SVG to string
            const serializer = new XMLSerializer();
            let svgString = serializer.serializeToString(svgClone);

            // Add XML declaration if not present
            if (!svgString.startsWith('<?xml')) {
                svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
            }

            // Create a Blob from the SVG string
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

            // Create a download link and trigger it
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log(`✓ Family tree SVG downloaded as "${filename}"`);
            return true;

        } catch (error) {
            console.error('Error downloading SVG:', error);
            return false;
        }
    }

    addBackgroundToSvg(svgElement) {
        // Get the --bg-light color from CSS variables
        const bgColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--bg-light').trim();

        console.log(`\tAdding background color: ${bgColor}`);

        // Get SVG dimensions
        const viewBox = svgElement.getAttribute('viewBox');
        let width, height, x = 0, y = 0;

        if (viewBox) {
            const values = viewBox.split(/\s+/);
            x = parseFloat(values[0]) || 0;
            y = parseFloat(values[1]) || 0;
            width = parseFloat(values[2]) || 0;
            height = parseFloat(values[3]) || 0;
        } else {
            width = parseFloat(svgElement.getAttribute('width')) || 0;
            height = parseFloat(svgElement.getAttribute('height')) || 0;
        }

        // Create a background rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', bgColor || '#0d202a');
        rect.setAttribute('id', 'background-rect');

        // Insert as the first child (behind everything else)
        if (svgElement.firstChild) {
            svgElement.insertBefore(rect, svgElement.firstChild);
        } else {
            svgElement.appendChild(rect);
        }
    }

    async embedImagesAsBase64(svgElement) {
        // Find all image elements with xlink:href attributes
        const images = svgElement.querySelectorAll('image[*|href]');
        
        console.log(`\tFound ${images.length} images to embed`);

        // Create an array of promises to convert images
        const conversionPromises = Array.from(images).map(async (img, index) => {
            const href = img.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || img.getAttribute('href');
            
            // Skip if already base64
            if (!href || href.startsWith('data:')) {
                return;
            }

            try {
                const base64Data = await this.imageToBase64(href);
                img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', base64Data);
                console.log(`\t[${index + 1}/${images.length}] ✓ Embedded image: ${href}`);
            } catch (error) {
                console.warn(`\t[${index + 1}/${images.length}] ✗ Failed to embed image: ${href}`, error);
            }
        });

        // Wait for all images to be converted
        await Promise.all(conversionPromises);
    }

    imageToBase64(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous'; // Handle CORS if needed
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    // Convert to base64 (PNG format)
                    const dataUrl = canvas.toDataURL('image/png');
                    resolve(dataUrl);
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = (error) => {
                reject(new Error(`Failed to load image: ${imageUrl}`));
            };
            
            img.src = imageUrl;
        });
    }

}

export default FamilyTreeSvgController;












































































